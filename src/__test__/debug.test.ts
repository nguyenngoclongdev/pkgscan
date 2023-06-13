import { findInstalledPackage } from '../main';

describe('Test Gherkin Code Parse', () => {
    const cypressCases = [
        ['./fixtures/npm.package-lock.json', 'typescript', '1.1.0'],
        ['./fixtures/npm.yarn-lock.json', 'typescript', '1.1.0'],
        ['./fixtures/npm.pnpm-lock.json', 'typescript', '1.1.0']
    ];
    test.each(cypressCases)('Test', (lockPath: string, findPackage: string, expectVersion: string) => {
        // Mock root path = lockPath
        const info = findInstalledPackage(findPackage);
        console.log('🚀 ~ info:', info);
    });
});
