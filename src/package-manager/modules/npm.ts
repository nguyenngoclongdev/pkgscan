import { readFileSync } from 'fs';
import { getPackageName, isMatching } from '../../utils/getPackageName';
import { isDirectDependency } from '../../utils/isDirectDependency';
import { PackageInfo, PackageManager } from '../PackageManager';

export class NpmModule implements PackageManager {
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
            dev: packageDetail.dev,
            license: packageDetail.license,
            engines: packageDetail.engines
        };
    };

    getInstalledPackage(packageFinding: string): PackageInfo[] {
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
            .filter(([text]) => isMatching(text, packageFinding))
            .map(([text, packageDetail]) => this.transform(getPackageName(text), packageDetail));
    }
}
