export class LanguageOptions {
    public readonly name: string;
    public readonly tab: string;
    public readonly autoIndent: boolean;
    public readonly keywords: string[];
    
    public constructor(name: string, autoIndent: boolean, spacesNumber: number, keywords: string[]) {
        this.name = name;
        this.autoIndent = autoIndent;
        this.tab = " ".repeat(spacesNumber);
        this.keywords = keywords;
    }
}