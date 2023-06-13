import colors from 'ansi-colors';
import { createSpinner } from 'nanospinner';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { findInstalledPackage } from '../main.js';

const run = async (argv: ArgvType) => {
    const { pkg = '' } = argv;
    const spinner = createSpinner('Detect the package').start({ color: 'yellow' });
    try {
        const installedPackageFound = await findInstalledPackage(pkg);
        if (!installedPackageFound) {
            spinner.warn({ text: 'Could not found package.', mark: ':|' });
            return;
        }

        spinner.success({ text: `Found installed package: ${pkg}` });
        console.log(installedPackageFound);
    } catch (error) {
        spinner.error({ text: (error as any).message, mark: ':(' });
    } finally {
        spinner.stop();
    }
};

// Define arguments and run command
const yargsInstance = yargs(hideBin(process.argv));
const argv = yargsInstance
    .usage(`Usage: ${colors.blue(colors.bold(`pnpm buff -- [options]`))}`)
    .option('pkg', {
        alias: 'p',
        type: 'string',
        default: '',
        description: colors.dim('The package name.')
    })
    .option('lock-path', {
        alias: 'l',
        type: 'string',
        default: '',
        description: colors.dim('The lock file path. (e.g. npm, yarn, vsm, vsx)')
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
    lockPath: string;
    limit: number;
    debug: boolean;
};
run(argv);
