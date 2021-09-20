export class OpenCloseSet {
    public readonly elements: [string, string][];
    
    public constructor(elements: [string, string][]) {
        this.elements = elements;
    }
    
    public isOpenCharacter(char: string) {
        for (let [open] of this.elements) {
            if (char === open) return true;
        }
        return false;
    }
    
    public isCloseCharacter(char: string) {
        for (let [, close] of this.elements) {
            if (char === close) return true;
        }
        return false;
    }
    
    public findCloseCharacter(openChar: string) {
        for (let [open, close] of this.elements) {
            if (open === openChar) return close;
        }
        return "";
    }
    
    public findOpenCharacter(closeChar: string) {
        for (let [open, close] of this.elements) {
            if (close === closeChar) return open;
        }
        return "";
    }
}