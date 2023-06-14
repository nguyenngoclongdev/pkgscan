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
        return new NpmModule(npmLockFile);
    }

    const pnpmLockFileName = 'pnpm-lock.yaml';
    const pnpmLockFile = cwd.endsWith(pnpmLockFileName) ? cwd : path.join(cwd, pnpmLockFileName);
    if (existsSync(pnpmLockFile)) {
        return new PnpmModule(pnpmLockFile);
    }

    const yarnLockFileName = 'yarn.lock';
    const yarnLockFile = cwd.endsWith(yarnLockFileName) ? cwd : path.join(cwd, yarnLockFileName);
    if (existsSync(yarnLockFile)) {
        return new YarnModule(yarnLockFile);
    }
    return undefined;
};
