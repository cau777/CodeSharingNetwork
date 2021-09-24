import "../../css/CodeSnippet.css"

import {Component} from "react";
import {ISnippetData} from "./ISnippetData";
import {Card} from "react-bootstrap";
import CardHeader from "react-bootstrap/CardHeader";
import {checkVisible} from "../../utils/DOMUtils";

interface IProps {
    order: number;
    snippet: ISnippetData;
}

interface IState {
    visible: boolean;
}

export class CodeSnippet extends Component<IProps, IState> {
    public constructor(props: IProps) {
        super(props);
        
        this.componentDidMount = this.componentDidMount.bind(this);
        this.updateVisibility = this.updateVisibility.bind(this);
        
        this.state = {
            visible: true
        }
    }
    
    public render() {
        let content: JSX.Element;
        
        if (this.state.visible) {
            let snippet = this.props.snippet;
            let rows = snippet.code.split("\n");
            let tableRows: JSX.Element[] = [];
            
            for (let i = 0; i < rows.length; i++) {
                let row = rows[i];
                tableRows.push(
                    <tr key={this.props.order + " " + i}>
                        <td className={"col-numbers"}>{i + 1}</td>
                        <td className={"col-text"}>{row}</td>
                    </tr>
                )
            }
            
            content = (
                <Card>
                    <CardHeader>
                        <div>
                            {/* Placeholder */}
                            <div className={"snippet-title"}>
                                <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
                                     className={"user-img round-img"} alt="author"/>
                                <h4>{snippet.title}</h4>
                            </div>
                            <p>{snippet.description}</p>
                        </div>
                    </CardHeader>
                    <div className="card-body">
                        <div className={"code-snippet"}>
                            <table className="snippet">
                                <colgroup>
                                    <col/>
                                    <col/>
                                </colgroup>
                                <tbody>
                                {tableRows}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Card>
            );
        } else {
            content = <div/>;
        }
        
        return (
            <div className="card-snippet" id={"snippet-" + this.props.order}>
                {content}
            </div>
        );
    }
    
    public componentDidMount() {
        // Locks the height of the element
        let mainDiv = document.getElementById("snippet-" + this.props.order) as HTMLDivElement;
        mainDiv.style.minHeight = mainDiv.clientHeight + "px";
        
        window.addEventListener("scroll", this.updateVisibility);
    }
    
    public componentWillUnmount() {
        window.removeEventListener("scroll", this.updateVisibility);
    }
    
    private updateVisibility() {
        let mainDiv = document.getElementById("snippet-" + this.props.order) as HTMLDivElement;
        
        this.setState({visible: checkVisible(mainDiv)});
    }
}