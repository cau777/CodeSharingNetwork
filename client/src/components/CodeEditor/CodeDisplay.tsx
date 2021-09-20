import {Component} from "react";

interface IProps {
    text: string;
    selected: number;
}

export class CodeDisplay extends Component<IProps, any> {
    public render() {
        let textLines = this.props.text.split("\n");
        let lines: JSX.Element[] = [];
        for (let i = 0; i < textLines.length; i++) {
            let className = "";
            if (this.props.selected === i) className += "selected ";
            
            let text = textLines[i];
            if (text.length === 0) text += " ";
            
            lines.push(
                <tr key={"line " + i}>
                    <td className={className}>
                        {text}
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
}