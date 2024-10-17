export interface BasicPackageInfo {
    name: string;
    version?: string;
}

export interface PackageInfo {
    name: string;
    version: string;
    isDirectProjectDependency: boolean;
    [key: string]: any;
}

export interface PackageManager {
    cwd: string;
    lockFilePath: string;
    getInstalledPackage(packageName: string): Promise<PackageInfo[]>;
}
