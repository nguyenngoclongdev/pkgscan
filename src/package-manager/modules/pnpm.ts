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

    private normalizeRawLine = (line: string) => {
        let output = line;
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

    private normalizePackageName = (lineSplit: string[]) => {
        const rawPackageName = [...lineSplit];

        // @typescript-eslint/eslint-plugin/5.59.11 => @typescript-eslint/eslint-plugin
        rawPackageName.pop(); // remove last item (constain version number)
        return rawPackageName.join('/');
    };

    private normalizePackageVersion = (lineSplit: string[]) => {
        const rawPackageVersion = lineSplit[lineSplit.length - 1];
        let output = rawPackageVersion?.trim() || '';

        // 12.2.0_57ubdvajp6562okxygabugvlve => 12.2.0
        const split = output.split('_');
        if (split.length > 1) {
            split.pop(); // remove last item (constain version integrity)
        }
        return split.join('');
    };

    private getPackageInfo = (line: string): BasicPackageInfo => {
        const output = this.normalizeRawLine(line);
        const lineSplit = output.split('/');
        return { name: this.normalizePackageName(lineSplit), version: this.normalizePackageVersion(lineSplit) };
    };

    private isMatching = (packageName: string, packageFinding: string): boolean => {
        const pkgInfo = this.getPackageInfo(packageName);
        return minimatch(pkgInfo.name, packageFinding);
    };

    private transform = (packageInfo: BasicPackageInfo, packageDetail: any): PackageInfo => {
        const isDirectProjectDependency = isDirectDependency(
            this.cwd,
            packageInfo.name,
            packageInfo.version || packageDetail.version
        );
        return {
            name: packageInfo.name,
            version: packageInfo.version || '',
            isDirectProjectDependency,
            engines: packageDetail.engines || undefined
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
