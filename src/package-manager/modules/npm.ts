import { readFileSync } from 'fs';
import { minimatch } from 'minimatch';
import { isDirectDependency } from '../../utils/isDirectDependency';
import { BasicPackageInfo, PackageInfo, PackageManager } from '../PackageManager';

export class NpmModule implements PackageManager {
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
        return output;
    };

    private getPackageInfo = (input: string): BasicPackageInfo => {
        const output = this.normalizePackageName(input);
        const regex: RegExp = /^@?[^@\s]+/;
        const matching = regex.exec(output);
        if (!matching) {
            return { name: output };
        }
        return { name: matching[0] };
    };

    private isMatching = (packageName: string, packageFinding: string): boolean => {
        const pkgInfo = this.getPackageInfo(packageName);
        return minimatch(pkgInfo.name, packageFinding);
    };

    private transform = (packageInfo: BasicPackageInfo, packageDetail: any): PackageInfo => {
        const isDirectProjectDependency = isDirectDependency(this.cwd, packageInfo.name, packageDetail.version);
        return {
            name: packageInfo.name,
            version: packageDetail.version,
            isDirectProjectDependency,
            dev: packageDetail.dev,
            license: packageDetail.license,
            engines: packageDetail.engines
        };
    };

    getInstalledPackage(packageFinding: string): PackageInfo[] {
        const lockFileContent = readFileSync(this.lockFilePath, { encoding: 'utf-8' });
        const packageLock = JSON.parse(lockFileContent);

        // Get all dependencies
        let allDependencies = [];
        switch (packageLock.lockfileVersion) {
            case 1:
                allDependencies = packageLock.dependencies;
                break;
            case 2:
                allDependencies = packageLock.packages || packageLock.dependencies;
                break;
            case 3:
                allDependencies = packageLock.packages;
                break;
            default:
                break;
        }

        // Find the package
        return Object.entries(allDependencies)
            .filter(([text]) => this.isMatching(text, packageFinding))
            .map(([text, packageDetail]) => this.transform(this.getPackageInfo(text), packageDetail));
    }
}
