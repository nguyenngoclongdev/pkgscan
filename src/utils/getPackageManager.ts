import { existsSync } from 'fs';
import path from 'path/posix';
import { PackageManager } from '../package-manager/PackageManager';
import { NpmModule } from '../package-manager/modules/npm';
import { PnpmModule } from '../package-manager/modules/pnpm';
import { YarnModule } from '../package-manager/modules/yarn';

const lockFileNames = {
    npm: 'package-lock.json',
    yarn: 'yarn.lock',
    pnpm: 'pnpm-lock.yaml'
};

type LockFileInfo = {
    type: 'npm' | 'yarn' | 'pnpm';
    path: string;
};

const getLockFile = (cwd: string): LockFileInfo | undefined => {
    // Return direct link if set full file path
    if (existsSync(cwd)) {
        if (cwd.endsWith(lockFileNames.npm)) {
            return { type: 'npm', path: cwd };
        }
        if (cwd.endsWith(lockFileNames.yarn)) {
            return { type: 'yarn', path: cwd };
        }
        if (cwd.endsWith(lockFileNames.pnpm)) {
            return { type: 'pnpm', path: cwd };
        }
    }

    // Return file path by priority
    const npmLockFile = path.join(cwd, lockFileNames.npm);
    if (existsSync(npmLockFile)) {
        return { type: 'npm', path: cwd };
    }
    const yarnLockFile = path.join(cwd, lockFileNames.yarn);
    if (existsSync(yarnLockFile)) {
        return { type: 'yarn', path: cwd };
    }
    const pnpmLockFile = path.join(cwd, lockFileNames.pnpm);
    if (existsSync(pnpmLockFile)) {
        return { type: 'pnpm', path: cwd };
    }
    return undefined;
};

export const getPackageManager = (cwd: string): PackageManager | undefined => {
    const lockFile = getLockFile(cwd);
    if (!lockFile) {
        return undefined;
    }

    let rootPath = '';
    switch (lockFile.type) {
        case 'npm': {
            rootPath = lockFile.path.replace(lockFileNames.npm, '');
            break;
        }
        case 'yarn': {
            rootPath = lockFile.path.replace(lockFileNames.yarn, '');
            break;
        }
        case 'pnpm': {
            rootPath = lockFile.path.replace(lockFileNames.pnpm, '');
            break;
        }
    }
    return new NpmModule(rootPath, lockFile.path);
};
