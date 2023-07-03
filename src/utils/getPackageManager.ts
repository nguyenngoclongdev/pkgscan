import { existsSync } from 'fs';
import path from 'path/posix';
import { PackageManager } from '../package-manager/PackageManager';
import { NpmModule } from '../package-manager/modules/npm';
import { PnpmModule } from '../package-manager/modules/pnpm';
import { YarnModule } from '../package-manager/modules/yarn';

export const getPackageManager = (cwd: string): PackageManager | undefined => {
    const npmLockFileName = 'package-lock.json';
    const npmLockFile = cwd.endsWith(npmLockFileName) ? cwd : path.join(cwd, npmLockFileName);
    if (existsSync(npmLockFile)) {
        const rootPath = cwd.endsWith(npmLockFileName) ? cwd.replace(npmLockFileName, '') : cwd;
        return new NpmModule(rootPath, npmLockFile);
    }

    const pnpmLockFileName = 'pnpm-lock.yaml';
    const pnpmLockFile = cwd.endsWith(pnpmLockFileName) ? cwd : path.join(cwd, pnpmLockFileName);
    if (existsSync(pnpmLockFile)) {
        const rootPath = cwd.endsWith(pnpmLockFileName) ? cwd.replace(pnpmLockFileName, '') : cwd;
        return new PnpmModule(rootPath, pnpmLockFile);
    }

    const yarnLockFileName = 'yarn.lock';
    const yarnLockFile = cwd.endsWith(yarnLockFileName) ? cwd : path.join(cwd, yarnLockFileName);
    if (existsSync(yarnLockFile)) {
        const rootPath = cwd.endsWith(yarnLockFileName) ? cwd.replace(yarnLockFileName, '') : cwd;
        return new YarnModule(rootPath, yarnLockFile);
    }
    return undefined;
};
