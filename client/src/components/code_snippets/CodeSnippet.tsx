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
import {Heart} from "../../svg/Icons";
import api from "../../utils/api";

interface IProps {
    order: number;
    snippetId: number;
}

interface IState {
    visible: boolean;
    snippet?: ISnippetData;
}

export class CodeSnippet extends Component<IProps, IState> {
    private componentExists!: boolean;
    private firstLoad: boolean;
    
    public constructor(props: IProps) {
        super(props);
        
        this.componentDidMount = this.componentDidMount.bind(this);
        this.updateVisibility = this.updateVisibility.bind(this);
        this.updateSnippetData = this.updateSnippetData.bind(this);
        
        this.state = {
            visible: true,
        }
        this.firstLoad = true;
        this.componentExists = true;
    }
    
    public componentDidMount() {
        this.updateSnippetData().then();
    }
    
    public componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any) {
        if (this.firstLoad) {
            // Locks the height of the element
            let mainDiv = document.getElementById("snippet-" + this.props.order) as HTMLDivElement;
            mainDiv.style.minHeight = mainDiv.clientHeight + "px";
            
            window.addEventListener("scroll", this.updateVisibility);
            this.firstLoad = false;
        }
    }
    
    public render() {
        let snippet = this.state.snippet;
        
        if (!snippet) return (
            <div>Loading</div>
        );
        
        let content: JSX.Element;
        
        if (!this.state.visible) {
            content = <div/>;
        } else {
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
                            <span className="like" onClick={() => this.likeClick()}>
                                <span className="like-icon">
                                    <Heart active={snippet.userLiked}/>
                                </span>
                                <span className="like-number">
                                    {snippet.likeCount}
                                </span>
                            </span>
                            
                            <h6 className="ms-auto">{formatDateTime(snippet.posted)}</h6>
                        </div>
                    </div>
                </Card>
            );
        }
        
        return (
            <div className="card-snippet" id={"snippet-" + this.props.order}>
                {content}
            </div>
        );
    }
    
    public componentWillUnmount() {
        this.componentExists = false;
        window.removeEventListener("scroll", this.updateVisibility);
    }
    
    private async updateSnippetData() {
        let result = await api.get<ISnippetData>("/snippets/" + this.props.snippetId);
        
        if (!this.componentExists) return;
        
        if (result.status === 200) {
            this.setState({snippet: result.data})
        }
    }
    
    private updateVisibility() {
        let mainDiv = document.getElementById("snippet-" + this.props.order) as HTMLDivElement;
        
        this.setState({visible: checkVisible(mainDiv)});
    }
    
    private async likeClick() {
        if (this.state.snippet === undefined) return;
        
        await api.post("/snippets/" + this.props.snippetId + "/" + (this.state.snippet.userLiked ? "unlike" : "like"));
    
        if (!this.componentExists) return;
    
        await this.updateSnippetData();
    }
    
}