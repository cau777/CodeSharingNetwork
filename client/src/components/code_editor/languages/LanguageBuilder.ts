import {LanguageOptions} from "./LanguageOptions";

export class LanguageBuilder {
    private readonly lang: string;
    private autoIndent = true;
    private spacesNumber = 4;
    private keywords: string[] = [];
    private literals: string[] = [];
    private stringHighlight: boolean = true;
    private numberHighlight: boolean = true;
    private inlineComments?: string;
    private multilineComments?: {start: string, end: string};
    
    public constructor(name: string) {
        this.lang = name;
    }
    
    public disableAutoIndent() {
        this.autoIndent = false;
        return this;
    }
    
    public disableStringHighlight() {
        this.stringHighlight = false;
        return this;
    }
    
    public disableNumberHighlight() {
        this.numberHighlight = false;
        return this;
    }
    
    public setSpacesNumber(num: number) {
        this.spacesNumber = num;
        return this;
    }
    
    public addKeywords(...keywords: string[]) {
        this.keywords.push(...keywords);
        return this;
    }
    
    public addLiterals(...literals: string[]) {
        this.literals.push(...literals);
        return this;
    }
    
    public addAccessModifiers() {
        this.keywords.push("public", "private", "protected");
        return this;
    }
    
    public addInlineComments(start: string) {
        this.inlineComments = start;
        return this;
    }
    
    public addMultilineComments(start: string, end: string) {
        this.multilineComments = {start: start, end: end};
        return this;
    }
    
    public build() {
        return new LanguageOptions(this.lang, this.autoIndent, this.spacesNumber, this.keywords, this.literals,
            this.stringHighlight, this.numberHighlight, this.inlineComments, this.multilineComments);
    }
}