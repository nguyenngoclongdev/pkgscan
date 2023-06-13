import yarn from '@yarnpkg/lockfile';
import { readFileSync } from 'fs';
import { PackageManager } from '../PackageManager';

export class YarnModule implements PackageManager {
    private lockPath: string;
    constructor(rootPath: string) {
        this.lockPath = rootPath;
    }

    static getLockFile = () => {
        return 'yarn.lock';
    };

    private match = (installedPackage: string, packageNameFinding: string) => {
        return installedPackage.startsWith(`${packageNameFinding}@`);
    };

    async getInstalledPackage(packageNameFinding: string): Promise<any> {
        const lockFileContent = readFileSync(this.lockPath, { encoding: 'utf-8' });
        const installedPackages = yarn.parse(lockFileContent).object;

        return Object.entries(installedPackages).find(([installedPackage]) =>
            this.match(installedPackage, packageNameFinding)
        )?.[1];
    }
}
