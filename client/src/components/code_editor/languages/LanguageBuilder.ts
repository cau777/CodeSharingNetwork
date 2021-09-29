import {LanguageOptions} from "./LanguageOptions";

export class LanguageBuilder {
    private readonly lang: string;
    private autoIndent = true;
    private spacesNumber = 4;
    private keywords: string[] = [];
    private stringHighlight: boolean = true;
    
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
    
    public setSpacesNumber(num: number) {
        this.spacesNumber = num;
        return this;
    }
    
    public addKeywords(...keywords: string[]) {
        this.keywords.push(...keywords);
        return this;
    }
    
    public addAccessModifiers() {
        this.keywords.push("public", "private", "protected");
        return this;
    }
    
    public build() {
        return new LanguageOptions(this.lang, this.autoIndent, this.spacesNumber, this.keywords, this.stringHighlight)
    }
}