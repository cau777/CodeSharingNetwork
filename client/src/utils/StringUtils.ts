function find(str: string, target: string, start: number = 0, end: number = str.length - target.length + 1): number | undefined {
    let targetLen = target.length;
    
    for (let i = start; i < end; i++) {
        if (str.substr(i, targetLen) === target) return i;
    }
    
    return undefined;
}

function findReversed(str: string, target: string, start: number = 0, end: number = str.length - target.length + 1): number | undefined {
    let targetLen = target.length;
    
    for (let i = end - 1; i >= start; i--) {
        if (str.substr(i, targetLen) === target) return i;
    }
    
    return undefined;
}

function countOccurrences(str: string, target: string, start: number = 0, end: number = str.length - target.length + 1): number {
    let count = 0;
    for (let i = start; i < end; i++) {
        let sub = str.substr(i, target.length);
        if (sub === target) count++;
    }
    return count;
}

function regexTestRange(str: string, regex: RegExp, start: number = 0, end: number = str.length) {
    let sub = str.substring(start, end);
    return sub.match(regex) !== null;
}

function reverseStr(str: string): string {
    let reversed = "";
    for (let i = str.length - 1; i >= 0; i--) {
        reversed += str.charAt(i);
    }
    return reversed;
}

export {find, findReversed, countOccurrences, regexTestRange, reverseStr};