import {Component} from "react";
import {LanguageOptions} from "./languages/LanguageOptions";
import {SyntaxHighlighter} from "../SyntaxHighlighter";

interface IProps {
    text: string;
    selected: number;
    language: LanguageOptions;
}

export class CodeEditorDisplay extends Component<IProps, any> {
    public render() {
        let options = this.props.language;
        let highlighter = new SyntaxHighlighter(options);
        let text = this.props.text;
        let charColors = highlighter.highlight(text);
        let lines = highlighter.generateLines(text, charColors);
        let tableRows: JSX.Element[] = [];
        let lineIndex = 0;
        
        for (let line of lines) {
            tableRows.push(
                <tr key={"line " + lineIndex}>
                    <td className={this.props.selected === lineIndex ? "selected" : ""}>
                        {line}
                    </td>
                </tr>);
            lineIndex++;
        }
        
        return (
            <table>
                <colgroup>
                    <col/>
                </colgroup>
                <tbody>
                {tableRows}
                </tbody>
            </table>
        );
    }
}