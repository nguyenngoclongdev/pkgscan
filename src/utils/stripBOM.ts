export const stripBom = (content: string): string => {
    if (typeof content !== 'string') {
        throw new TypeError(`Expected a string, got ${typeof content}`);
    }

    // Catches EFBBBF (UTF-8 BOM) because the buffer-to-string
    // conversion translates it to FEFF (UTF-16 BOM).
    if (content.charCodeAt(0) === 0xfeff) {
        return content.slice(1);
    }
    return content;
};
