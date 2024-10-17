import { minimatch } from 'minimatch';
import { isDirectDependency } from '../../utils/isDirectDependency';
import { BasicPackageInfo, PackageInfo, PackageManager } from '../PackageManager';
import { readWantedLockfile } from './pnpm/read';

export class PnpmModule implements PackageManager {
    public readonly cwd: string;
    public readonly lockFilePath: string;
    constructor(cwd: string, lockFilePath: string) {
        this.cwd = cwd;
        this.lockFilePath = lockFilePath;
    }

    private normalizeRawLine = (line: string) => {
        // 'tsup@7.2.0(typescript@5.1.3)' => 'tsup@7.2.0'
        // '@pnpm/git-resolver@9.0.8(@pnpm/logger@5.2.0)' => '@pnpm/git-resolver@9.0.8'
        // '@typescript-eslint/eslint-plugin@5.59.11(@typescript-eslint/parser@5.59.11(eslint@8.43.0)(typescript@5.1.3))(eslint@8.43.0)(typescript@5.1.3)' => '@typescript-eslint/eslint-plugin@5.59.11'
        // 'ts-jest@29.1.0(@babel/core@7.22.1)(@jest/types@29.5.0)(babel-jest@29.5.0(@babel/core@7.22.1))(esbuild@0.18.4)(jest@29.5.0(@types/node@20.3.1))(typescript@5.1.3)' => 'ts-jest@29.1.0'
        const regex = /(@[^/]+\/[^()]+\/\d+\.\d+\.\d+)/;
        const matching = regex.exec(line);
        return matching ? matching[0] : line;
    };

    private normalizePackageName = (normalizeLine: string) => {
        // 'yargs@17.7.2' => 'yargs'
        // '@types/yargs@17.0.24' => '@types/yargs'
        const regex = /(@?[a-zA-Z0-9-]+)/;
        const matching = regex.exec(normalizeLine);
        return matching ? matching[0] : normalizeLine;
    };

    private normalizePackageVersion = (normalizeLine: string) => {
        // 'yargs@17.7.2' => '17.7.2'
        // '@types/yargs@17.0.24' => '17.0.24'
        const regex = /(\d+\.\d+\.\d+(-\w+)?)/;
        const matching = regex.exec(normalizeLine);
        return matching ? matching[0] : normalizeLine;
    };

    private getPackageInfo = (line: string): BasicPackageInfo => {
        const normalizeLine = this.normalizeRawLine(line);
        return { name: this.normalizePackageName(normalizeLine), version: this.normalizePackageVersion(normalizeLine) };
    };

    private isMatching = (packageName: string, packageFinding: string): boolean => {
        const pkgInfo = this.getPackageInfo(packageName);
        return minimatch(pkgInfo.name, packageFinding);
    };

    private transform = (packageInfo: BasicPackageInfo, packageDetail: any): PackageInfo => {
        const isDirectProjectDependency = isDirectDependency(
            this.cwd,
            packageInfo.name,
            packageInfo.version || packageDetail.version
        );
        return {
            name: packageInfo.name,
            version: packageInfo.version || '',
            isDirectProjectDependency,
            engines: packageDetail.engines || ''
        };
    };

    async getInstalledPackage(packageFinding: string): Promise<PackageInfo[]> {
        const result = await readWantedLockfile(this.cwd, { ignoreIncompatible: true });
        console.log('result', result);
        if (!result?.packages) {
            return [];
        }

        // Find the package
        const allDependencies = result.packages;
        return Object.entries(allDependencies)
            .filter(([text]) => this.isMatching(text, packageFinding))
            .map(([pkg, packageDetail]) => {
                const pkgInfo = this.getPackageInfo(pkg);
                return this.transform(pkgInfo, packageDetail);
            });
    }
}
