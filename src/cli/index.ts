#! /usr/bin/env node
import colors from 'ansi-colors';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { findInstalledPackage } from '../main.js';
import { logger } from '../utils/logger.js';

const run = async (argv: ArgvType) => {
    const { pkg = '', cwd = '' } = argv;
    try {
        const installedPackageFound = await findInstalledPackage(pkg, cwd);
        if (!installedPackageFound) {
            logger.warn('Could not found package.');
            return;
        }

        logger.info(`Found installed package:`);
        logger.table(installedPackageFound);
    } catch (error) {
        logger.error((error as any).message);
    }
};

// Define arguments and run command
const yargsInstance = yargs(hideBin(process.argv));
const argv = yargsInstance
    .usage(`Usage: ${colors.blue(colors.bold(`pkgscan -- [options]`))}`)
    .option('pkg', {
        alias: 'p',
        type: 'string',
        default: '',
        description: colors.dim('The package name.')
    })
    .option('cwd', {
        alias: 'c',
        type: 'string',
        default: `${process.cwd()}`,
        description: colors.dim('Current working directory')
    })
    .option('limit', {
        alias: 'd',
        type: 'number',
        default: 0,
        description: colors.dim('The number of items to returned')
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
    .hide('version')
    .wrap(yargsInstance.terminalWidth())
    .epilog('© NGUYEN NGOC LONG. All Rights Reserved.')
    .parseSync();

// Execute main
export type ArgvType = {
    pkg: string;
    cwd: string;
    limit: number;
    debug: boolean;
};
run(argv);
