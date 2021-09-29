import {LanguageBuilder} from "./LanguageBuilder";

export class Languages {
    public static languages = [
        new LanguageBuilder("None").disableAutoIndent().build(),
        new LanguageBuilder("Java").addKeywords("class").addAccessModifiers().build(),
        new LanguageBuilder("C#").build(),
        new LanguageBuilder("Typescript").build(),
        new LanguageBuilder("Javascript").build(),
        new LanguageBuilder("Python").disableAutoIndent().build()
    ];
    
    public static get languageNames() {
        return Languages.languages.map(o => o.name);
    }
    
    public static findLanguage(name: string) {
        return Languages.languages.find(o => o.name === name) ?? Languages.languages[0];
    }
}