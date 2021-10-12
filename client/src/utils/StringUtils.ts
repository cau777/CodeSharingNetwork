/**
 * @summary searches for a pattern in part of a string
 * @param str The string to search
 * @param pattern The pattern to search for
 * @param start The first index to search (inclusive)
 * @param end The last index to search (exclusive)
 */
function find(str: string, pattern: string, start: number = 0, end: number = str.length - pattern.length + 1): number | undefined {
    let targetLen = pattern.length;
    
    for (let i = start; i < end; i++) {
        if (str.substr(i, targetLen) === pattern) return i;
    }
    
    return undefined;
}

/**
 * @summary searches for a pattern in part of a string in reverse
 * @param str The string to search
 * @param pattern The pattern to search for
 * @param start The first index to search (inclusive)
 * @param end The last index to search (exclusive)
 */
function findReversed(str: string, pattern: string, start: number = 0, end: number = str.length - pattern.length + 1): number | undefined {
    let targetLen = pattern.length;
    
    for (let i = end - 1; i >= start; i--) {
        if (str.substr(i, targetLen) === pattern) return i;
    }
    
    return undefined;
}

/**
 * @summary counts how many times a pattern appears in part of a string (including overlaps)
 * @param str The string to search
 * @param pattern The pattern to search for
 * @param start The first index to search (inclusive)
 * @param end The last index to search (exclusive)
 */
function countOccurrences(str: string, pattern: string, start: number = 0, end: number = str.length - pattern.length + 1): number {
    let count = 0;
    for (let i = start; i < end; i++) {
        let sub = str.substr(i, pattern.length);
        if (sub === pattern) count++;
    }
    return count;
}

/**
 * @summary Test if a regex matches part of a string
 * @param str The string to search
 * @param regex The regex to apply
 * @param start The first index to search (inclusive)
 * @param end The last index to search (exclusive)
 */
function regexTestRange(str: string, regex: RegExp, start: number = 0, end: number = str.length) {
    let sub = str.substring(start, end);
    return sub.match(regex) !== null;
}

/**
 * @summary Reverses a string
 * @param str The string to reverse
 */
function reverseStr(str: string) {
    let reversed = "";
    for (let i = str.length - 1; i >= 0; i--) {
        reversed += str.charAt(i);
    }
    return reversed;
}

/**
 * @summary Escape characters that have special meaning in regular expressions
 * @param str The string to escape characters
 */
function escapeRegExp(str: string) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * @summary Capitalizes the first letter of a string
 * @param str The string to capitalize
 */
function capitalize(str: string) {
    if (str.length !== 0) {
        return str[0].toUpperCase() + str.substr(1);
    }
    return str;
}

export {find, findReversed, countOccurrences, regexTestRange, reverseStr, escapeRegExp, capitalize};