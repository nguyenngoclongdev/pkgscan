import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { getPackageName } from '../../utils/getPackageName';
import { PackageInfo, PackageManager } from '../PackageManager';

export class NpmModule implements PackageManager {
    public readonly cwd: string;
    public readonly lockFilePath: string;
    constructor(cwd: string, lockFilePath: string) {
        this.cwd = cwd;
        this.lockFilePath = lockFilePath;
    }

    private isDirectProjectDependency = (packageName: string, packageVersion: string): boolean => {
        try {
            // HACK: yarn list --depth=0 not work correctly
            // https://github.com/yarnpkg/yarn/issues/3569
            const buffer = execSync('npm list --depth=0', { encoding: 'utf-8', cwd: this.cwd });
            const list = buffer
                .split('\n')
                .filter((line) => line.startsWith('├─') || line.startsWith('└─'))
                .map((line) => line.trim().split(' ')[1]);
            const fullName = `${packageName}@${packageVersion}`;
            return list.includes(fullName);
        } catch {
            return false;
        }
    };

    private transform = (packageName: string, packageDetail: any): PackageInfo => {
        return {
            name: packageName,
            version: packageDetail.version,
            isDirectProjectDependency: this.isDirectProjectDependency(packageName, packageDetail.version),
            dev: packageDetail.dev,
            license: packageDetail.license,
            engines: packageDetail.engines
        };
    };

    async getInstalledPackage(packageNameFinding: string): Promise<PackageInfo[]> {
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
            .filter(([text]) => getPackageName(text) === packageNameFinding)
            .map(([text, packageDetail]) => this.transform(getPackageName(text), packageDetail));
    }
}
