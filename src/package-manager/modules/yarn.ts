import { parse } from '@yarnpkg/lockfile';
import { readFileSync } from 'fs';
import { getPackageName, isMatching } from '../../utils/getPackageName';
import { isDirectDependency } from '../../utils/isDirectDependency';
import { PackageInfo, PackageManager } from '../PackageManager';

export class YarnModule implements PackageManager {
    public readonly cwd: string;
    public readonly lockFilePath: string;
    constructor(cwd: string, lockFilePath: string) {
        this.cwd = cwd;
        this.lockFilePath = lockFilePath;
    }

    private transform = (packageName: string, packageDetail: any): PackageInfo => {
        const isDirectProjectDependency = isDirectDependency(this.cwd, packageName, packageDetail.version);
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
