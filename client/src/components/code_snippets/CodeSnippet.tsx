import "../../css/CodeSnippet.css"

import {Component} from "react";
import {ISnippetData} from "./ISnippetData";
import {Card} from "react-bootstrap";
import CardHeader from "react-bootstrap/CardHeader";
import {checkVisible} from "../../utils/DOMUtils";
import {capitalize} from "../../utils/StringUtils";
import {SyntaxHighlighter} from "../SyntaxHighlighter";
import {Languages} from "../code_editor/languages/Languages";
import {formatDateTime} from "../../utils/DateUtils";

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
            let tableRows: JSX.Element[] = [];
            let language = capitalize(snippet.language);
            
            let highlighter = new SyntaxHighlighter(Languages.findLanguage(language));
            let charColors = highlighter.highlight(snippet.code);
            let lines = highlighter.generateLines(snippet.code, charColors);
            
            for (let i = 0; i < lines.length; i++) {
                let line = lines[i];
                tableRows.push(
                    <tr key={this.props.order + " " + i}>
                        <td className={"col-numbers"}>{i + 1}</td>
                        <td className={"col-text"}>{line}</td>
                    </tr>
                )
            }
            
            content = (
                <Card>
                    <CardHeader>
                        <div>
                            <div className="snippet-author-header flex-center">
                                {/* Placeholder */}
                                <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
                                     className={"user-img round-img"} alt="author"/>
                                <h5 className={"snippet-author"}>{snippet.authorName}</h5>
                                <h6 className="snippet-language ms-auto">{capitalize(snippet.language)}</h6>
                            
                            </div>
                            <h4 className="snippet-title">{snippet.title}</h4>
                            <p className="snippet-description">{snippet.description}</p>
                        </div>
                    </CardHeader>
                    <div className="card-body">
                        <div className="code-snippet">
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
                        <div className="flex-center mt-2">
                            <h6 className="ms-auto">{formatDateTime(snippet.posted)}</h6>
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