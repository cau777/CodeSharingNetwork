import {Component} from "react";

interface IProps {
    lineCount: number;
}

export class CodeEditorLineNumbers extends Component<IProps, any> {
    public render() {
        let children: JSX.Element[] = [];

        for (let i = 0; i < this.props.lineCount; i++) {
            children.push(
                <tr key={"line " + i} className={"line-number"}>
                    <td>{i + 1}</td>
                </tr>
            );
        }

        return (
            <div id="line-numbers-wrapper">
                <table id="line-numbers" className="line-numbers">
                    <colgroup>
                        <col/>
                    </colgroup>
                    <tbody>
                    {children}
                    <tr>
                        <td height={20}/>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}