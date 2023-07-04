import { existsSync, readFileSync } from 'fs';
import { posix } from 'path';
import semver from 'semver';

let dependencies: Record<string, string> = {};
export const isDirectDependency = (cwd: string, packageName: string, packageVersion: string): boolean => {
    const packageJsonPath = posix.join(cwd, 'package.json');
    if (existsSync(packageJsonPath)) {
        const size = Object.keys(dependencies).length;
        if (size <= 0) {
            const packageJsonContent = readFileSync(packageJsonPath, 'utf-8');
            const packageJson = JSON.parse(packageJsonContent);
            dependencies = {
                ...(packageJson.optionalDependencies || {}),
                ...(packageJson.devDependencies || {}),
                ...(packageJson.peerDependencies || {}),
                ...(packageJson.dependencies || {}),
                ...(packageJson.resolutions || {})
            };
        }
        const pkg = dependencies[packageName];
        return semver.satisfies(packageVersion, pkg);
    }
    return false;
};
