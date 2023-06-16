import { parse } from '@yarnpkg/lockfile';
import { readFileSync } from 'fs';
import resolvePackagePath from 'resolve-package-path';
import { getPackageName } from '../../utils/getPackageName';
import { PackageInfo, PackageManager } from '../PackageManager';

export class YarnModule implements PackageManager {
    public readonly cwd: string;
    public readonly lockFilePath: string;
    constructor(cwd: string, lockFilePath: string) {
        this.cwd = cwd;
        this.lockFilePath = lockFilePath;
    }

    private transform = (packageName: string, packageDetail: any): PackageInfo => {
        const packageJSONPath = packageName ? resolvePackagePath(packageName, this.cwd, false) : undefined;
        return {
            name: packageName,
            version: packageDetail.version,
            isDirectProjectDependency: packageJSONPath?.includes(packageDetail.version) || false
        };
    };

    async getInstalledPackage(packageNameFinding: string): Promise<PackageInfo[]> {
        const lockFileContent = readFileSync(this.lockFilePath, { encoding: 'utf-8' });

        // Get all dependencies
        const installedPackages = parse(lockFileContent).object;

        // Find the package
        return Object.entries(installedPackages)
            .filter(([text]) => getPackageName(text) === packageNameFinding)
            .map(([text, packageDetail]) => this.transform(getPackageName(text), packageDetail));
    }
}
