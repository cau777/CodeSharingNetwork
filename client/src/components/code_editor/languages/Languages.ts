import {LanguageBuilder} from "./LanguageBuilder";
import {LanguageOptions} from "./LanguageOptions";

export class Languages {
    public static languages = [
        new LanguageOptions("None", false, 4, [], false),
        new LanguageBuilder("Java").addAccessModifiers().addKeywords("abstract", "assert", "boolean", "break", "byte", "case", "catch", "char", "class", "continue", "const", "default", "do", "double", "else", "enum", "exports", "extends", "final", "finally", "float", "for", "goto", "if", "implements", "import", "instanceof", "int", "interface", "long", "module", "native", "new", "package", "requires", "return", "short", "static", "strictfp", "super", "switch", "synchronized", "this", "throw", "throws", "transient", "try", "var", "void", "volatile", "while").build(),
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