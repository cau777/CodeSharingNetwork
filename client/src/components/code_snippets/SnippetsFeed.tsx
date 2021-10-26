import React, {Component} from 'react';
import '../../css/SnippetsFeed.css';
import {CodeSnippet} from "./CodeSnippet";
import Loading from "../Loading";
import {getDocumentHeight} from "../../utils/DOMUtils";

interface IProps {
    snippetsIdGenerator: AsyncGenerator<number[], void>;
}

interface IState {
    loadingNewSnippets: boolean;
    content: JSX.Element[];
}

class SnippetsFeed extends Component<IProps, IState> {
    private elementPosition: number; // Element position in the list to serve as keys
    private snippetsAvailable?: boolean;
    private componentExists: boolean;
    private snippetsLoading: number;
    
    public constructor(props: any) {
        super(props);
        this.render = this.render.bind(this);
        this.startFeed = this.startFeed.bind(this);
        this.updateSnippets = this.updateSnippets.bind(this);
        this.updateWindow = this.updateWindow.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.snippetLoaded = this.snippetLoaded.bind(this);
        
        this.state = {
            loadingNewSnippets: false,
            content: []
        };
        
        this.elementPosition = 0;
        this.componentExists = true;
        this.snippetsLoading = 0;
    }
    
    public componentDidMount() {
        window.addEventListener("scroll", this.updateWindow);
        this.startFeed().then();
    }
    
    public render() {
        return (
            <div>
                <div className="snippets-display" id="snippets-display">
                    {this.state.content}
                </div>
                <div hidden={this.state.loadingNewSnippets}>
                    <p>No more snippets. Sorry</p>
                </div>
                <div hidden={!this.state.loadingNewSnippets}>
                    <Loading/>
                </div>
            </div>
        );
    }
    
    public componentWillUnmount() {
        this.componentExists = false;
        window.removeEventListener("scroll", this.updateWindow);
    }
    
    private updateWindow() {
        let scrollPosition = window.scrollY;
        
        let documentHeight = getDocumentHeight();
        let scrollLimit = documentHeight - window.innerHeight * 1.4;
        
        if (scrollPosition > scrollLimit) {
            if (this.state.loadingNewSnippets) return;
            if (!this.snippetsAvailable) return;
            if (this.snippetsLoading !== 0) return;
            
            this.setState({loadingNewSnippets: true});
            
            this.updateSnippets().then();
        }
    }
    
    private async updateSnippets() {
        let result = await this.props.snippetsIdGenerator.next();
        let data = result.value;
        
        if (data !== undefined) {
            let content = this.state.content;
            this.snippetsLoading = data.length;
            
            for (let snippetId of data) {
                let elementPosition = this.elementPosition++;
                content.push(
                    <CodeSnippet key={"snippet-" + elementPosition} order={elementPosition}
                                 snippetId={snippetId} onLoad={this.snippetLoaded}/>
                );
            }
    
            // Avoids error: Can't perform a React state update on an unmounted component
            if (!this.componentExists) return;
            this.setState({content: content});
        }
        
        
        this.setState({loadingNewSnippets: false});
    }
    
    private snippetLoaded() {
        this.snippetsLoading--;
        if (this.snippetsLoading === 0) {
            this.updateWindow();
        }
    }
    
    private async startFeed() {
        this.snippetsAvailable = true;
        
        if (this.componentExists) { // Avoids error: Can't perform a React state update on an unmounted component
            this.updateWindow();
        }
    }
}

export default SnippetsFeed;
