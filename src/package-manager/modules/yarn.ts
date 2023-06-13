import { parse } from '@yarnpkg/lockfile';
import { readFileSync } from 'fs';
import { PackageInfo, PackageManager } from '../PackageManager';

export class YarnModule implements PackageManager {
    public readonly lockFilePath: string;
    constructor(lockFilePath: string) {
        this.lockFilePath = lockFilePath;
    }

    private match = (installedPackage: string, packageNameFinding: string) => {
        return installedPackage.startsWith(`${packageNameFinding}@`);
    };

    private getPackageName = (text: string): string => {
        const packageName = text.replace('/', '');
        return packageName.split('@')[0];
    };

    private transform = (text: string, detail: any): PackageInfo => {
        return {
            name: this.getPackageName(text),
            version: detail.version,
            resolved: detail.resolved
        };
    };

    async getInstalledPackage(packageNameFinding: string): Promise<PackageInfo[]> {
        const lockFileContent = readFileSync(this.lockFilePath, { encoding: 'utf-8' });
        const installedPackages = parse(lockFileContent).object;

        const packages = Object.entries(installedPackages).filter(([installedPackage]) =>
            this.match(installedPackage, packageNameFinding)
        );
        return packages.map((p) => this.transform(p[0], p[1]));
    }
}
