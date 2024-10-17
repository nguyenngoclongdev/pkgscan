#! /usr/bin/env node
import colors from 'ansi-colors';
import { EOL } from 'os';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { getPackageManager } from './utils/getPackageManager.js';
import { logger } from './utils/logger.js';
import * as packageFile from '../package.json';

const main = async (argv: ArgvType) => {
    const { pkg, cwd = process.cwd() } = argv;
    if (!pkg) {
        logger.warn(`The package name provided is null or empty.`);
        return;
    }

    try {
        // Detect the package manager based on the current working directory.
        const packageManager = getPackageManager(cwd);
        if (!packageManager) {
            logger.warn(`Unable to detect a package manager at ${cwd}.`);
            return;
        }

        // Retrieve information about the installed package.
        logger.info(`Analyzing the package manager ${packageManager.lockFilePath}...`);
        const installedPackageFound = await packageManager.getInstalledPackage(pkg);
        if (!installedPackageFound || installedPackageFound.length <= 0) {
            logger.warn(`The "${pkg}" package was not found.`);
            return;
        }

        logger.success(`Installed package found:`);
        logger.table(installedPackageFound);
    } catch (error) {
        const message = (error as any).message;
        logger.error(`Oops, something went wrong.`, message);
    }
};

// Define arguments and run command
const yargsInstance = yargs(hideBin(process.argv));
const argv = yargsInstance
    .usage(`${EOL}Usage: pkgscan [options]`)
    .option('pkg', {
        alias: 'p',
        type: 'string',
        default: '',
        requiresArg: true,
        description: colors.dim('The name of the package to retrieve information for.')
    })
    .option('cwd', {
        alias: 'c',
        type: 'string',
        default: `${process.cwd()}`,
        description: colors.dim('The current working directory of the project.')
    })
    .option('debug', {
        type: 'boolean',
        default: false,
        description: colors.dim('Debug mode.')
    })
    .option('help', {
        alias: 'h',
        type: 'string',
        description: colors.dim('Show help')
    })
    .version(packageFile.version)
    .alias('v', 'version')
    .wrap(yargsInstance.terminalWidth())
    .epilog('© NGUYEN NGOC LONG. All Rights Reserved.')
    .parseSync();

// Execute main
export type ArgvType = {
    pkg: string;
    cwd: string;
    debug: boolean;
};
main(argv);
