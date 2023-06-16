const REGEX_PACKAGE: RegExp = /^@?[^@\s]+/;

const normalizePackageName = (input: string) => {
    let output = input;
    if (output.startsWith('node_modules/')) {
        output = output.replace('node_modules/', '');
    }
    if (output.startsWith('/')) {
        output = output.substring(1);
    }
    return output;
};

export const getPackageName = (input: string) => {
    const output = normalizePackageName(input);
    const matching = REGEX_PACKAGE.exec(output);
    if (!matching) {
        return output;
    }
    return matching[0];
};
