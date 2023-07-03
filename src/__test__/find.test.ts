import path from 'path/posix';
import { getInstalledPackageDetails } from '..';
import { logger } from '../utils/logger';

const getCurrentPath = (filePath: string): string => {
    return path.join(__dirname, filePath);
};

describe('Test pkgscan', () => {
    const cases = [
        { lockFilePath: './fixtures/npm/v1', packageName: '@types/node', expectedVersion: '8.0.10' },
        { lockFilePath: './fixtures/npm/v2', packageName: '@types/node', expectedVersion: '18.7.9' },
        { lockFilePath: './fixtures/npm/v3', packageName: '@types/node', expectedVersion: '20.3.1' },
        { lockFilePath: './fixtures/yarn', packageName: '@types/node', expectedVersion: '20.3.1' },
        { lockFilePath: './fixtures/pnpm', packageName: '@types/node', expectedVersion: '12.20.55' },

        { lockFilePath: './fixtures/npm/v1', packageName: 'typescript', expectedVersion: '2.4.1' },
        { lockFilePath: './fixtures/npm/v2', packageName: 'typescript', expectedVersion: '4.7.4' },
        { lockFilePath: './fixtures/npm/v3', packageName: 'typescript', expectedVersion: '5.1.3' },
        { lockFilePath: './fixtures/yarn', packageName: 'typescript', expectedVersion: '5.1.3' },
        { lockFilePath: './fixtures/pnpm', packageName: 'typescript', expectedVersion: '5.0.4' }
    ];
    test.each(cases)(
        'Find package $packageName at the $lockFilePath',
        ({ packageName, lockFilePath, expectedVersion }) => {
            // Test method
            const packages = getInstalledPackageDetails(packageName, getCurrentPath(lockFilePath));

            // Print the result
            logger.info(`Find package ${packageName} at the ${lockFilePath}`);
            logger.table(packages);

            // Check the result
            expect(packages).toBeDefined();
            expect(packages?.[0].version).toBe(expectedVersion);
        }
    );
});
