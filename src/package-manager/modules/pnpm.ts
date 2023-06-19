import { readFileSync } from 'fs';
import yaml from 'js-yaml';
import { getPackageName, isMatching } from '../../utils/getPackageName';
import { isDirectDependency } from '../../utils/isDirectDependency';
import { PackageInfo, PackageManager } from '../PackageManager';

export class PnpmModule implements PackageManager {
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
            isDirectProjectDependency,
            engines: packageDetail.engines
        };
    };

    async getInstalledPackage(packageFinding: string): Promise<PackageInfo[]> {
        const lockFileContent = readFileSync(this.lockFilePath, { encoding: 'utf-8' });
        const lockfileData = yaml.load(lockFileContent);

        // Get all dependencies
        const allDependencies = (lockfileData as any).packages;
        for (const pkg in allDependencies) {
            let version = pkg.match(/\d+(\.\d+)+/);
            if (version) {
                allDependencies[pkg]['version'] = version[0];
            }
        }

        // Find the package
        return Object.entries(allDependencies)
            .filter(([text]) => isMatching(text, packageFinding))
            .map(([text, packageDetail]) => this.transform(getPackageName(text), packageDetail));
    }
}
