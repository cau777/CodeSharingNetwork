import {LanguageBuilder} from "./LanguageBuilder";
import {LanguageOptions} from "./LanguageOptions";

export class Languages {
    public static languages = [
        new LanguageOptions("Other", false, 4, [], [], false, false),
        
        new LanguageBuilder("Java")
            .addInlineComments("//")
            .addMultilineComments("/*", "*/")
            .addLiterals("true", "false", "null")
            .addAccessModifiers()
            .addKeywords("abstract", "assert", "boolean", "break", "byte", "case", "catch", "char", "class", "continue", "const", "default", "do", "double", "else", "enum", "exports", "extends", "final", "finally", "float", "for", "goto", "if", "implements", "import", "instanceof", "int", "interface", "long", "module", "native", "new", "package", "requires", "return", "short", "static", "strictfp", "super", "switch", "synchronized", "this", "throw", "throws", "transient", "try", "var", "void", "volatile", "while")
            .build(),
        
        new LanguageBuilder("C#")
            .addInlineComments("//")
            .addMultilineComments("/*", "*/")
            .addLiterals("true", "false", "null")
            .addAccessModifiers()
            .addKeywords("abstract", "add", "as", "ascending", "async", "await", "base", "bool", "break", "break", "by", "byte", "case", "case", "catch", "catch", "char", "checked", "checked", "checked", "class", "const", "continue", "continue", "decimal", "default", "default", "descending", "do", "do", "double", "dynamic", "else", "else", "enum", "equals", "event", "extern", "extern", "finally", "finally", "fixed", "fixed", "float", "for", "for", "foreach", "foreach", "from", "global", "goto", "goto", "group", "if", "if", "in", "in", "in", "int", "internal", "into", "is", "join", "let", "lock", "lock", "long", "new", "new", "namespace", "on", "operator", "orderby", "out", "override", "params", "partial", "readonly", "ref", "return", "return", "sbyte", "sealed", "select", "set", "short", "sizeof", "stackalloc", "static", "string", "struct", "switch", "switch", "this", "throw", "throw", "try", "try", "typeof", "uint", "ulong", "unchecked", "unchecked", "unchecked", "unsafe", "ushort", "using", "value", "value", "var", "virtual", "void", "volatile", "where", "while", "while", "yield", "yield")
            .build(),
        
        new LanguageBuilder("Typescript")
            .addInlineComments("//")
            .addMultilineComments("/*", "*/")
            .addAccessModifiers()
            .addLiterals("true", "false", "null", "undefined")
            .addKeywords("await", "break", "case", "catch", "class", "const", "continue", "debugger", "default", "delete", "do", "else", "enum", "export", "extends", "false", "finally", "for", "function", "if", "implements", "import", "in", "instanceof", "interface", "let", "new", "package", "return", "super", "switch", "static", "this", "throw", "try", "true", "typeof", "var", "void", "while", "with", "yield")
            .addKeywords("number", "string", "boolean", "enum", "void", "any", "never", "Array", "tuple")
            .build(),
        
        new LanguageBuilder("Javascript")
            .addInlineComments("//")
            .addMultilineComments("/*", "*/")
            .addAccessModifiers()
            .addLiterals("true", "false", "null", "undefined")
            .addKeywords("await", "break", "case", "catch", "class", "const", "continue", "debugger", "default", "delete", "do", "else", "enum", "export", "extends", "false", "finally", "for", "function", "if", "implements", "import", "in", "instanceof", "interface", "let", "new", "package", "return", "super", "switch", "static", "this", "throw", "try", "true", "typeof", "var", "void", "while", "with", "yield")
            .build(),
        
        new LanguageBuilder("Python")
            .addInlineComments("#")
            .disableAutoIndent()
            .addLiterals("True", "False", "None")
            .addKeywords("and", "as", "assert", "bool", "break", "bytearray", "bytes", "class", "complex", "continue", "def", "del", "dict", "elif", "else", "except", "finally", "float", "for", "from", "frozenset", "global", "if", "import", "in", "int", "is", "lambda", "list", "memoryview", "nonlocal", "not", "or", "pass", "raise", "range", "return", "set", "str", "try", "tuple", "while", "with", "yield")
            .build()
    ];
    
    public static get languageNames() {
        return Languages.languages.map(o => o.name);
    }
    
    public static findLanguage(name: string) {
        return Languages.languages.find(o => o.name === name) ?? Languages.languages[0];
    }
}