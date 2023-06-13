import { existsSync } from 'fs';
import { posix } from 'path';
import { PackageManager } from './package-manager/PackageManager';
import { NpmModule } from './package-manager/modules/npm';
import { PnpmModule } from './package-manager/modules/pnpm';
import { YarnModule } from './package-manager/modules/yarn';

// Current working directory
export const root: string = process.cwd();

export const autodetectPackageManager = (): PackageManager | undefined => {
    const npmLockFile = posix.join(root, NpmModule.getLockFile());
    if (existsSync(npmLockFile)) {
        return new NpmModule(npmLockFile);
    }

    const pnpmLockFile = posix.join(root, PnpmModule.getLockFile());
    if (existsSync(pnpmLockFile)) {
        return new PnpmModule(pnpmLockFile);
    }

    const yarnLockFile = posix.join(root, YarnModule.getLockFile());
    if (existsSync(yarnLockFile)) {
        return new YarnModule(yarnLockFile);
    }
    return undefined;
};

export const findInstalledPackage = async (packageName: string): Promise<any> => {
    const packageManager = autodetectPackageManager();
    if (!packageManager) {
        console.log('Could not detect any package manager use on this project.');
    }

    const installedPackage = await packageManager?.getInstalledPackage(packageName);
    return installedPackage;
};
