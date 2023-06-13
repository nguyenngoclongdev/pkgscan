import colors from 'ansi-colors';

class Logger {
    info = (message: string, ...optionalParams: any[]) => {
        const prefix = colors.blue('ℹ');
        console.info(`${prefix} ${message}`, ...optionalParams);
    };

    success = (message: string, ...optionalParams: any[]) => {
        const prefix = colors.green('✔');
        console.info(`${prefix} ${message}`, ...optionalParams);
    };

    warn = (message: string, ...optionalParams: any[]) => {
        const prefix = colors.yellow('⚠');
        console.warn(`${prefix} ${message}`, ...optionalParams);
    };

    error = (message: string, ...optionalParams: any[]) => {
        const prefix = colors.red('✖');
        console.error(`${prefix} ${message}`, ...optionalParams);
    };

    private isNullOrEmpty = (tabularData: any): boolean => {
        if (!tabularData) {
            return true;
        }
        if (Array.isArray(tabularData)) {
            if (tabularData.length <= 0) {
                return true;
            }
        }
        return false;
    };

    table = (tabularData: any, properties?: ReadonlyArray<string>) => {
        if (this.isNullOrEmpty(tabularData)) {
            this.warn('No Data');
            return;
        }
        console.table(tabularData, properties);
    };
}

export const logger = new Logger();
