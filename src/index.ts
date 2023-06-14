import { getPackageManager } from './utils/getPackageManager';
import { PackageInfo } from './package-manager/PackageManager';

/**
 * Retrieves information about an installed package in the project.
 * @param packageName The name of the package to retrieve information for.
 * @param cwd The current working directory of the project.
 * @returns An array of objects containing information about the installed package, or undefined if the package is not found.
 * @throws An error if the package name is null or empty, or if no package manager is detected.
 */
export const getInstalledPackageDetails = async (
    packageName: string,
    cwd?: string
): Promise<PackageInfo[] | undefined> => {
    if (!packageName) {
        throw Error('The package name provided is null or empty.');
    }

    // Detect the package manager based on the current working directory.
    const packageManager = getPackageManager(cwd || process.cwd());
    if (!packageManager) {
        throw Error(`Unable to detect a package manager at ${cwd}.`);
    }

    // Retrieve information about the installed package.
    return await packageManager.getInstalledPackage(packageName);
};
