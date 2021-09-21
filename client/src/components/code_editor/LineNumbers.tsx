import "../../css/LineNumbers.css"
import {Component} from "react";

interface IProps {
    lineNumbers: number;
}

class LineNumbers extends Component<IProps, any> {
    public render() {
        let children: JSX.Element[] = [];
        
        for (let i = 0; i < this.props.lineNumbers; i++) {
            children.push(
                <tr key={"line " + i}>
                    <td>{i+1}</td>
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
                        <td height={20}>
                        
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

export default LineNumbers;