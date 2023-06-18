import { parse } from '@yarnpkg/lockfile';
import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { getPackageName, isMatching } from '../../utils/getPackageName';
import { PackageInfo, PackageManager } from '../PackageManager';

export class YarnModule implements PackageManager {
    public readonly cwd: string;
    public readonly lockFilePath: string;
    constructor(cwd: string, lockFilePath: string) {
        this.cwd = cwd;
        this.lockFilePath = lockFilePath;
    }

    private installedPackageList: string[] | undefined;
    private isDirectProjectDependency = (packageName: string, packageVersion: string): boolean => {
        try {
            // HACK: yarn list --depth=0 not work correctly
            // https://github.com/yarnpkg/yarn/issues/3569
            if (!this.installedPackageList) {
                const buffer = execSync('npm list --depth=0', { encoding: 'utf-8', cwd: this.cwd });
                this.installedPackageList = buffer
                    .split('\n')
                    .filter((line) => line.startsWith('├─') || line.startsWith('└─'))
                    .map((line) => line.trim().split(' ')[1]);
            }

            const fullName = `${packageName}@${packageVersion}`;
            return this.installedPackageList.includes(fullName);
        } catch {
            return false;
        }
    };

    private transform = (packageName: string, packageDetail: any): PackageInfo => {
        const isDirectProjectDependency = this.isDirectProjectDependency(packageName, packageDetail.version);
        return {
            name: packageName,
            version: packageDetail.version,
            isDirectProjectDependency
        };
    };

    async getInstalledPackage(packageFinding: string): Promise<PackageInfo[]> {
        const lockFileContent = readFileSync(this.lockFilePath, { encoding: 'utf-8' });

        // Get all dependencies
        const allDependencies = parse(lockFileContent).object;

        // Find the package
        return Object.entries(allDependencies)
            .filter(([text]) => isMatching(text, packageFinding))
            .map(([text, packageDetail]) => this.transform(getPackageName(text), packageDetail));
    }
}
