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
    currentDate: Date;
    currentElementOrder: number;
    
    public constructor(props: any) {
        super(props);
        this.render = this.render.bind(this);
        this.update = this.update.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        
        this.state = {
            loading: false,
            scrollPosition: 0,
            content: []
        };
        
        this.currentDate = new Date();
        this.currentElementOrder = 0;
    }
    
    
    public componentDidMount() {
        window.addEventListener("scroll", this.update);
        this.update();
    }
    
    public render() {
        return (
            <div>
                <div className="snippets-display" id="snippets-display">
                    {this.state.content}
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
    
    private update() {
        if (this.state.loading) return;
        
        const scrollPosition = window.scrollY;
        const scrollLimit = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight,
            document.documentElement.scrollHeight, document.documentElement.offsetHeight) - window.innerHeight * 1.4;
        
        if (scrollPosition > scrollLimit) {
            this.setState({loading: true});
            
            Main.getSnippets().then(data => {
                let content = this.state.content;
                
                for (let snippet of data) {
                    let elementOrder = this.currentElementOrder++;
                    content.push(
                        <CodeSnippet key={"snippet-" + elementOrder} order={elementOrder} snippet={snippet}/>
                    );
                }
                
                this.setState({loading: false, content: content});
            }, () => this.setState({loading: false}));
        }
    }
    
    private static async getSnippets() {
        let snippetsIds = await api.get<number[]>("snippets/recommended");
        let snippets: ISnippetData[] = [];
        
        for (let snippetId of snippetsIds.data) {
            let response = await api.get<ISnippetData>("snippets/" + snippetId);
            snippets.push(response.data);
        }
        
        return snippets;
    }
}

export default Main;
