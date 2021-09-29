import {Component} from "react";
import {LanguageOptions} from "./languages/LanguageOptions";

interface IProps {
    text: string;
    selected: number;
    language: LanguageOptions;
}

export class CodeEditorDisplay extends Component<IProps, any> {
    public render() {
        let textLines = this.props.text.split("\n");
        let lines: JSX.Element[] = [];
        for (let i = 0; i < textLines.length; i++) {
            let className = "";
            if (this.props.selected === i) className += "selected ";
            
            let text = textLines[i];
            if (text.length === 0) text += " ";
            
            let charColors: string[] = [];
            
            for (let j = 0; j < text.length; j++) {
                charColors.push("");
            }
            
            let options = this.props.language;
            
            for (let keyword of options.keywords) {
                CodeEditorDisplay.applyColor(text, charColors, "\\b" + keyword + "\\b", "keyword");
            }
            
            if (options.numberHighlight) {
                CodeEditorDisplay.applyColor(text, charColors, "\\b\\d+\\b", "number");
            }
            
            if (options.stringHighlight) {
                CodeEditorDisplay.applyColor(text, charColors, "\"[^\"]*(\"|$)", "string");
                CodeEditorDisplay.applyColor(text, charColors, "'[^']*('|$)", "string");
            }
            
            let currentColor = "";
            let textBuffer = "";
            let result: JSX.Element[] = [];
            
            for (let charIndex = 0; charIndex < text.length; charIndex++) {
                let char = text.charAt(charIndex);
                let color = charColors[charIndex];
                
                if (currentColor !== color) {
                    if (textBuffer !== "")
                        result.push(<span className={"code-" + currentColor}>{textBuffer}</span>);
                    currentColor = color;
                    textBuffer = "";
                }
                
                textBuffer += char;
            }
            
            if (textBuffer !== "")
                result.push(<span className={"code-" + currentColor}>{textBuffer}</span>);
            
            lines.push(
                <tr key={"line " + i}>
                    <td className={className}>
                        {result}
                    </td>
                </tr>
            );
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