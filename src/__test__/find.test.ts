import path from 'path/posix';
import { getInstalledPackageDetails } from '..';

const getCurrentPath = (filePath: string): string => {
    return path.join(__dirname, filePath);
};

describe('Test Gherkin Code Parse', () => {
    const cypressCases = [
        ['./fixtures/npm/v1', '@types/node', '8.0.10'],
        ['./fixtures/npm/v2', '@types/node', '18.7.9'],
        ['./fixtures/npm/v3', '@types/node', '20.3.1'],
        ['./fixtures/yarn', '@types/node', '20.3.1'],
        ['./fixtures/pnpm', '@types/node', '12.20.55']
    ];
    test.each(cypressCases)('Test %s', async (lockPath: string, findPackage: string, expectVersion: string) => {
        const lockFilePath = getCurrentPath(lockPath);
        const packages = await getInstalledPackageDetails(findPackage, lockFilePath);
        expect(packages).toBeDefined();
        expect(packages?.[0].version).toBe(expectVersion);
    });
});
