import { parse } from '@yarnpkg/lockfile';
import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { getPackageName } from '../../utils/getPackageName';
import { PackageInfo, PackageManager } from '../PackageManager';

export class YarnModule implements PackageManager {
    public readonly cwd: string;
    public readonly lockFilePath: string;
    constructor(cwd: string, lockFilePath: string) {
        this.cwd = cwd;
        this.lockFilePath = lockFilePath;
    }

    private isDirectProjectDependency = (packageName: string, packageVersion: string): boolean => {
        try {
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
            isDirectProjectDependency: this.isDirectProjectDependency(packageName, packageDetail.version)
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
