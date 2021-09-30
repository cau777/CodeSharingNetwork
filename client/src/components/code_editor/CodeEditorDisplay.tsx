import {Component} from "react";
import {LanguageOptions} from "./languages/LanguageOptions";
import {escapeRegExp} from "../../utils/StringUtils";

interface IProps {
    text: string;
    selected: number;
    language: LanguageOptions;
}

export class CodeEditorDisplay extends Component<IProps, any> {
    public render() {
        let keywordClass = "keyword";
        let numberClass = "number";
        let stringClass = "string";
        let commentClass = "comment";
        
        let text = this.props.text;
        let lines: JSX.Element[] = [];
        let charColors: string[] = [];
        let options = this.props.language;
        
        for (let j = 0; j < text.length; j++) {
            charColors.push("");
        }
        
        for (let keyword of options.keywords) {
            CodeEditorDisplay.applyColor(text, charColors, "\\b" + escapeRegExp(keyword) + "\\b", keywordClass);
        }
        
        for (let literal of options.literals) {
            CodeEditorDisplay.applyColor(text, charColors, "\\b" + escapeRegExp(literal) + "\\b", keywordClass);
        }
        
        if (options.numberHighlight) {
            CodeEditorDisplay.applyColor(text, charColors, "\\b[_\\d]+\\b", numberClass);
        }
        
        if (options.stringHighlight) {
            CodeEditorDisplay.applyColor(text, charColors, "\"[^\"]*(\"|$)", stringClass);
            CodeEditorDisplay.applyColor(text, charColors, "'[^']*('|$)", stringClass);
        }
        
        if (options.inlineComments) {
            CodeEditorDisplay.applyColor(text, charColors, escapeRegExp(options.inlineComments) + ".*", commentClass);
        }
        
        if (options.multilineComments) {
            let regexStr = escapeRegExp(options.multilineComments.start) + "[\\s\\S]*?(" + escapeRegExp(options.multilineComments.end) + "|$)";
            CodeEditorDisplay.applyColor(text, charColors, regexStr, commentClass);
        }
        
        let lineResult: JSX.Element[] = [];
        let lineIndex = 0;
        let currentColor = "";
        let textBuffer = "";
        let spanIndex = 0;
        
        for (let i = 0; i <= text.length; i++) {
            let char = text.charAt(i);
            
            if (char === "\n" || i === text.length) {
                if (textBuffer !== "")
                    lineResult.push(<span key={spanIndex++} className={"code-" + currentColor}>{textBuffer}</span>);
                
                if (lineResult.length === 0) lineResult.push(<span>{" "}</span>);
                
                lines.push(
                    <tr key={"line " + lineIndex}>
                        <td className={this.props.selected === lineIndex ? "selected" : ""}>
                            {lineResult}
                        </td>
                    </tr>
                );
                
                lineIndex++;
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
        
        return (
            <table>
                <colgroup>
                    <col/>
                </colgroup>
                <tbody>
                {lines}
                </tbody>
            </table>
        );
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