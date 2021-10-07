import React, {Component} from 'react';
import '../css/Main.css';
import api from "../utils/api";
import {CodeSnippet} from "./code_snippets/CodeSnippet";
import Loading from "./Loading";

interface IState {
    loading: boolean;
    scrollPosition: number;
    content: JSX.Element[];
}

class Main extends Component<any, IState> {
    private currentPage: number;
    private elementPosition: number;
    private canGetSnippets: boolean;
    private componentExists: boolean;
    
    public constructor(props: any) {
        super(props);
        this.render = this.render.bind(this);
        this.prepareRecommendations = this.prepareRecommendations.bind(this);
        this.update = this.update.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        
        this.state = {
            loading: false,
            scrollPosition: 0,
            content: []
        };
        
        this.currentPage = 0;
        this.elementPosition = 0;
        this.canGetSnippets = true;
        this.componentExists = true;
    }
    
    public componentDidMount() {
        window.addEventListener("scroll", this.update);
        this.prepareRecommendations().then();
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
                    <Loading/>
                </div>
            </div>
        );
    }
    
    public componentWillUnmount() {
        this.componentExists = false;
        window.removeEventListener("scroll", this.update);
    }
    
    private static async getSnippetsIds(page: number) {
        let response = await api.get<number[]>("snippets/recommended/" + page);
        
        if (response.status === 200) {
            return response.data;
        }
        
        return undefined;
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
            
            Main.getSnippetsIds(currentPage).then(data => {
                if (data === undefined || data.length === 0) {
                    this.canGetSnippets = false;
                    this.setState({loading: false});
                } else {
                    let content = this.state.content;
                    
                    for (let snippetId of data) {
                        let elementPosition = this.elementPosition++;
                        content.push(
                            <CodeSnippet key={"snippet-" + elementPosition} order={elementPosition}
                                         snippetId={snippetId}/>
                        );
                    }
                    
                    this.setState({loading: false, content: content});
                }
            })
        }
    }
    
    private async prepareRecommendations() {
        await api.post("/snippets/recommended");
        this.canGetSnippets = true;
        
        if (this.componentExists) {
            this.update();
        }
    }
}

export default Main;
