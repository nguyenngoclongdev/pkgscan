import { minimatch } from 'minimatch';
import { isDirectDependency } from '../../utils/isDirectDependency';
import { BasicPackageInfo, PackageInfo, PackageManager } from '../PackageManager';
import { readWantedLockfile } from './pnpm/read';

export class PnpmModule implements PackageManager {
    public readonly cwd: string;
    public readonly lockFilePath: string;
    constructor(cwd: string, lockFilePath: string) {
        this.cwd = cwd;
        this.lockFilePath = lockFilePath;
    }

    private normalizePackageName = (input: string) => {
        let output = input;
        if (output.startsWith('node_modules/')) {
            output = output.replace('node_modules/', '');
        }
        if (output.startsWith('/')) {
            output = output.substring(1);
        }

        // @typescript-eslint/eslint-plugin/5.59.11(@typescript-eslint/parser@5.59.11)(eslint@8.43.0)(typescript@5.1.3)
        // => @typescript-eslint/eslint-plugin/5.59.11
        const removeDependentRegex = /\([^)]*\)/g;
        const result = output.replace(removeDependentRegex, '').trim();
        return result.trim();
    };

    private getPackageInfo = (input: string): BasicPackageInfo => {
        const output = this.normalizePackageName(input);
        const split = output.split('/');
        const packageVersion = split[split.length - 1];
        split.pop(); // remove last item (constain version number)
        const packageName = split.join('/');
        return { name: packageName, version: packageVersion };
    };

    private isMatching = (packageName: string, packageFinding: string): boolean => {
        const pkgInfo = this.getPackageInfo(packageName);
        return minimatch(pkgInfo.name, packageFinding);
    };

    private transform = (packageInfo: BasicPackageInfo, packageDetail: any): PackageInfo => {
        const isDirectProjectDependency = isDirectDependency(this.cwd, packageInfo.name, packageInfo.version || packageDetail.version);
        return {
            name: packageInfo.name,
            version: packageInfo.version || '',
            isDirectProjectDependency,
            engines: packageDetail.engines
        };
    };

    getInstalledPackage(packageFinding: string): PackageInfo[] {
        const result = readWantedLockfile(this.cwd, { ignoreIncompatible: true });
        if (!result?.packages) {
            return [];
        }

        // Find the package
        const allDependencies = result.packages;
        return Object.entries(allDependencies)
            .filter(([text]) => this.isMatching(text, packageFinding))
            .map(([pkg, packageDetail]) => {
                const pkgInfo = this.getPackageInfo(pkg);
                return this.transform(pkgInfo, packageDetail);
            });
    }
}
