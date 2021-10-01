import React, {Component} from 'react';
import '../css/Main.css';
import api from "../utils/api";
import {ISnippetData} from "./code_snippets/ISnippetData";
import {CodeSnippet} from "./code_snippets/CodeSnippet";

interface IState {
    loading: boolean;
    scrollPosition: number;
    content: JSX.Element[];
}

class Main extends Component<any, IState> {
    private currentPage: number;
    private elementPosition: number;
    private canGetSnippets: boolean;
    
    public constructor(props: any) {
        super(props);
        this.render = this.render.bind(this);
        this.prepareRecommendations = this.prepareRecommendations.bind(this);
        this.update = this.update.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.getSnippets = this.getSnippets.bind(this);
        
        this.state = {
            loading: false,
            scrollPosition: 0,
            content: []
        };
        
        this.currentPage = 0;
        this.elementPosition = 0;
        this.canGetSnippets = true;
    }
    
    public componentDidMount() {
        window.addEventListener("scroll", this.update);
        this.prepareRecommendations().then(() => this.update());
    }
    
    public render() {
        return (
            <div>
                <div className="snippets-display" id="snippets-display">
                    {this.state.content}
                </div>
                <div hidden={this.state.loading}>
                    <p>No more snippets. Sorry</p>
                </div>
                <div hidden={!this.state.loading}>
                    <p>Loading</p>
                </div>
            </div>
        );
    }
    
    public componentWillUnmount() {
        window.removeEventListener("scroll", this.update);
    }
    
    private async getSnippets(page: number) {
        let snippetsIds = await api.get<number[]>("snippets/recommended/" + page);
        let snippets: ISnippetData[] = [];
        
        for (let snippetId of snippetsIds.data) {
            let response = await api.get<ISnippetData>("snippets/" + snippetId);
            snippets.push(response.data);
        }
        
        return snippets;
    }
    
    private update() {
        const scrollPosition = window.scrollY;
        const scrollLimit = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight,
            document.documentElement.scrollHeight, document.documentElement.offsetHeight) - window.innerHeight * 1.4;
        
        if (scrollPosition > scrollLimit) {
            if (this.state.loading) return;
            if (!this.canGetSnippets) return;
            
            this.setState({loading: true});
            
            let currentPage = this.currentPage++;
            this.getSnippets(currentPage).then(data => {
                let content = this.state.content;
                
                if (data.length === 0) {
                    this.canGetSnippets = false;
                    this.setState({loading: false});
                } else {
                    for (let snippet of data) {
                        let elementPosition = this.elementPosition++;
                        content.push(
                            <CodeSnippet key={"snippet-" + elementPosition} order={elementPosition}
                                         snippet={snippet}/>
                        );
                    }
                    
                    this.setState({loading: false, content: content});
                }
            }, () => this.setState({loading: false}));
        }
    }
    
    private async prepareRecommendations() {
        await api.post("/snippets/recommended");
        this.canGetSnippets = true;
    }
}

export default Main;
