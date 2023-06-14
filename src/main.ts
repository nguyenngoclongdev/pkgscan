import { existsSync } from 'fs';
import path from 'path/posix';
import { PackageInfo, PackageManager } from './package-manager/PackageManager';
import { NpmModule } from './package-manager/modules/npm';
import { PnpmModule } from './package-manager/modules/pnpm';
import { YarnModule } from './package-manager/modules/yarn';
import { logger } from './utils/logger';

export const autodetectPackageManager = (cwd: string | undefined): PackageManager | undefined => {
    let currentWorkingDir = cwd;
    if (!currentWorkingDir) {
        currentWorkingDir = process.cwd();
    }

    const npmLockFileName = 'package-lock.json';
    const npmLockFile = currentWorkingDir.endsWith(npmLockFileName)
        ? currentWorkingDir
        : path.join(currentWorkingDir, npmLockFileName);
    if (existsSync(npmLockFile)) {
        return new NpmModule(npmLockFile);
    }

    const pnpmLockFileName = 'pnpm-lock.yaml';
    const pnpmLockFile = currentWorkingDir.endsWith(pnpmLockFileName)
        ? currentWorkingDir
        : path.join(currentWorkingDir, pnpmLockFileName);
    if (existsSync(pnpmLockFile)) {
        return new PnpmModule(pnpmLockFile);
    }

    const yarnLockFileName = 'yarn.lock';
    const yarnLockFile = currentWorkingDir.endsWith(yarnLockFileName)
        ? currentWorkingDir
        : path.join(currentWorkingDir, yarnLockFileName);
    if (existsSync(yarnLockFile)) {
        return new YarnModule(yarnLockFile);
    }
    return undefined;
};

export const findInstalledPackage = async (packageName: string, cwd?: string): Promise<PackageInfo[] | undefined> => {
    const packageManager = autodetectPackageManager(cwd);
    if (!packageManager) {
        logger.warn('Could not detect any package manager use on this project.');
        return undefined;
    }

    logger.info(`Analyze package manager at the ${packageManager.lockFilePath}...`);
    const installedPackage = await packageManager?.getInstalledPackage(packageName);
    return installedPackage;
};
