import { readFileSync } from 'fs';
import yaml from 'js-yaml';
import { PackageManager } from '../PackageManager';

export class PnpmModule implements PackageManager {
    private lockPath: string;
    constructor(rootPath: string) {
        this.lockPath = rootPath;
    }

    static getLockFile = () => {
        return 'pnpm-lock.yaml';
    };

    private match = (installedPackage: string, packageNameFinding: string) => {
        return installedPackage.startsWith(`/${packageNameFinding}@`);
    };

    async getInstalledPackage(packageNameFinding: string): Promise<any> {
        const lockFileContent = readFileSync(this.lockPath, { encoding: 'utf-8' });
        const installedPackages = (yaml.load(lockFileContent) as any).packages;
        for (const pkg in installedPackages) {
            let version = pkg.match(/\d+(\.\d+)+/);
            if (version) {
                installedPackages[pkg]['version'] = version[0];
            }
        }

        return Object.entries(installedPackages)
            .filter(([installedPackage]) => this.match(installedPackage, packageNameFinding))
            .map((values) => {
                return {
                    name: values[0],
                    detail: JSON.stringify(values[1], null, 2)
                };
            });
    }
}
