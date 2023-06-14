import { readFileSync } from 'fs';
import { PackageInfo, PackageManager } from '../PackageManager';

export class NpmModule implements PackageManager {
    public readonly lockFilePath: string;
    constructor(lockFilePath: string) {
        this.lockFilePath = lockFilePath;
    }

    private match = (installedPackage: string, packageNameFinding: string) => {
        const installedPackageNoPrefix = installedPackage.replace('node_modules/', '');
        return installedPackageNoPrefix.startsWith(`${packageNameFinding}`);
    };

    private transform = (name: string, raw: any): PackageInfo => {
        return {
            name: name.replace('node_modules/', '').split('@')[0],
            version: raw.version,
            dev: raw.dev,
            license: raw.license,
            engines: raw.engines
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
            .filter(([installedPackage]) => this.match(installedPackage, packageNameFinding))
            .map((p) => this.transform(p[0], p[1]));
    }
}
