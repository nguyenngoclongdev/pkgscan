export interface PackageInfo {
    name: string;
    version: string;
    [key: string]: string;
}

export interface PackageManager {
    lockFilePath: string;
    getInstalledPackage(packageName: string): Promise<PackageInfo[]>;
}
