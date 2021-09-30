import "../css/SyntaxHighlighter.css";
import {LanguageOptions} from "./code_editor/languages/LanguageOptions";
import {escapeRegExp} from "../utils/StringUtils";

export class SyntaxHighlighter {
    private readonly keywordClass = "keyword";
    private readonly numberClass = "number";
    private readonly stringClass = "string";
    private readonly commentClass = "comment";
    private readonly options: LanguageOptions;
    
    public constructor(options: LanguageOptions) {
        this.options = options;
    }
    
    public highlight(text: string) {
        let charColors: string[] = [];
        
        for (let j = 0; j < text.length; j++) {
            charColors.push("");
        }
        
        for (let keyword of this.options.keywords) {
            SyntaxHighlighter.applyColor(text, charColors, "\\b" + escapeRegExp(keyword) + "\\b", this.keywordClass);
        }
        
        for (let literal of this.options.literals) {
            SyntaxHighlighter.applyColor(text, charColors, "\\b" + escapeRegExp(literal) + "\\b", this.keywordClass);
        }
        
        if (this.options.numberHighlight) {
            SyntaxHighlighter.applyColor(text, charColors, "\\b[_\\d]+\\b", this.numberClass);
        }
        
        if (this.options.stringHighlight) {
            let enclosedBy = "";
            for (let i = 0; i < text.length; i++) {
                let char = text.charAt(i);
                let escaping = i !== 0 && text.charAt(i - 1) === "\\";
                
                if (enclosedBy === "") {
                    if ((char === "\"" || char === "'") && !escaping) {
                        enclosedBy = char;
                        charColors[i] = this.stringClass;
                    }
                } else {
                    charColors[i] = this.stringClass;
                    if (char === enclosedBy && !escaping) {
                        enclosedBy = "";
                    }
                }
            }
        }
        
        if (this.options.inlineComments) {
            SyntaxHighlighter.applyColor(text, charColors, escapeRegExp(this.options.inlineComments) + ".*", this.commentClass);
        }
        
        if (this.options.multilineComments) {
            let regexStr = escapeRegExp(this.options.multilineComments.start) + "[\\s\\S]*?(" +
                escapeRegExp(this.options.multilineComments.end) + "|$)";
            SyntaxHighlighter.applyColor(text, charColors, regexStr, this.commentClass);
        }
        
        return charColors;
    }
    
    public generateLines(text: string, charColors: string[]) {
        let lineResult: JSX.Element[] = [];
        let lines: JSX.Element[][] = [];
        let currentColor = "";
        let textBuffer = "";
        let spanIndex = 0;
        
        for (let i = 0; i <= text.length; i++) {
            let char = text.charAt(i);
            
            if (char === "\n" || i === text.length) {
                if (textBuffer !== "")
                    lineResult.push(<span key={spanIndex++} className={"code-" + currentColor}>{textBuffer}</span>);
                
                if (lineResult.length === 0) lineResult.push(<span key={spanIndex++}>{" "}</span>);
                lines.push(lineResult);
                lineResult = [];
                textBuffer = "";
                currentColor = "";
            } else {
                let color = charColors[i];
                
                if (currentColor !== color) {
                    if (textBuffer !== "")
                        lineResult.push(<span key={spanIndex++} className={"code-" + currentColor}>{textBuffer}</span>);
                    currentColor = color;
                    textBuffer = "";
                }
                
                textBuffer += char;
            }
        }
        
        return lines;
    }
    
    private static applyColor(text: string, charColors: string[], regexStr: string, colorCode: string) {
        let matches = text.matchAll(new RegExp(regexStr, "g"));
        for (let match of matches) {
            let start = match.index;
            if (start === undefined) continue;
            
            for (let groupIndex = 0; groupIndex < match[0].length; groupIndex++) {
                charColors[start + groupIndex] = colorCode;
            }
        }
    }
}