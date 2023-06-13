export interface PackageManager {
    getInstalledPackage(packageName: string): Promise<any>;
}
