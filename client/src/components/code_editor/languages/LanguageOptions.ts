export class LanguageOptions {
    public readonly name: string;
    public readonly tab: string;
    public readonly autoIndent: boolean;
    public readonly keywords: string[];
    public readonly literals: string[];
    public readonly stringHighlight: boolean;
    public readonly numberHighlight: boolean;
    public readonly inlineComments?: string;
    public readonly multilineComments?: { start: string; end: string };
    
    public constructor(name: string, autoIndent: boolean, spacesNumber: number, keywords: string[], literals: string[],
                       stringHighlight: boolean, numberHighlight: boolean, inlineComments?: string, multilineComments?: {start: string, end: string}) {
        this.name = name;
        this.autoIndent = autoIndent;
        this.tab = " ".repeat(spacesNumber);
        this.keywords = keywords;
        this.literals = literals;
        this.stringHighlight = stringHighlight;
        this.numberHighlight = numberHighlight;
        this.inlineComments = inlineComments;
        this.multilineComments = multilineComments;
    }
}