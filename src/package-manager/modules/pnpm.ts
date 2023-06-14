import { readFileSync } from 'fs';
import yaml from 'js-yaml';
import { PackageInfo, PackageManager } from '../PackageManager';

export class PnpmModule implements PackageManager {
    public readonly lockFilePath: string;
    constructor(lockFilePath: string) {
        this.lockFilePath = lockFilePath;
    }

    private match = (installedPackage: string, packageNameFinding: string) => {
        return installedPackage.startsWith(`/${packageNameFinding}@`);
    };

    private getPackageName = (text: string): string => {
        const packageName = text.replace('/', '');
        return packageName.split('@')[0];
    };

    private transform = (text: string, detail: any): PackageInfo => {
        return {
            name: this.getPackageName(text),
            version: detail.version,
            engines: detail.engines,
            hasBin: detail.hasBin,
            dev: detail.dev
        };
    };

    async getInstalledPackage(packageNameFinding: string): Promise<PackageInfo[]> {
        const lockFileContent = readFileSync(this.lockFilePath, { encoding: 'utf-8' });

        // Get all dependencies
        const installedPackages = (yaml.load(lockFileContent) as any).packages;
        for (const pkg in installedPackages) {
            let version = pkg.match(/\d+(\.\d+)+/);
            if (version) {
                installedPackages[pkg]['version'] = version[0];
            }
        }

        // Find the package
        return Object.entries(installedPackages)
            .filter(([installedPackage]) => this.match(installedPackage, packageNameFinding))
            .map((values) => this.transform(values[0], values[1]));
    }
}
