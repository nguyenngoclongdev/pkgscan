import { parse } from '@yarnpkg/lockfile';
import { readFileSync } from 'fs';
import { minimatch } from 'minimatch';
import { isDirectDependency } from '../../utils/isDirectDependency';
import { BasicPackageInfo, PackageInfo, PackageManager } from '../PackageManager';

export class YarnModule implements PackageManager {
    public readonly cwd: string;
    public readonly lockFilePath: string;
    constructor(cwd: string, lockFilePath: string) {
        this.cwd = cwd;
        this.lockFilePath = lockFilePath;
    }

    private normalizeRawLine = (line: string) => {
        let output = line;
        if (output.startsWith('node_modules/')) {
            output = output.replace('node_modules/', '');
        }
        if (output.startsWith('/')) {
            output = output.substring(1);
        }
        return output;
    };

    private getPackageInfo = (line: string): BasicPackageInfo => {
        const output = this.normalizeRawLine(line);
        const regex: RegExp = /^@?[^@\s]+/;
        const matching = regex.exec(output);
        if (!matching) {
            return { name: output };
        }
        return { name: matching[0] };
    };

    private isMatching = (packageName: string, packageFinding: string): boolean => {
        const pkgInfo = this.getPackageInfo(packageName);
        return minimatch(pkgInfo.name, packageFinding);
    };

    private transform = (packageInfo: BasicPackageInfo, packageDetail: any): PackageInfo => {
        const isDirectProjectDependency = isDirectDependency(this.cwd, packageInfo.name, packageDetail.version);
        return {
            name: packageInfo.name,
            isDirectProjectDependency,
            ...packageDetail // version, dev, license, engines...
        };
    };

    getInstalledPackage(packageFinding: string): PackageInfo[] {
        const lockFileContent = readFileSync(this.lockFilePath, { encoding: 'utf-8' });

        // Get all dependencies
        const allDependencies = parse(lockFileContent).object;

        // Find the package
        return Object.entries(allDependencies)
            .filter(([text]) => this.isMatching(text, packageFinding))
            .map(([text, packageDetail]) => this.transform(this.getPackageInfo(text), packageDetail));
    }
}
