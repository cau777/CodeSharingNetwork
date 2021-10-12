import React, {Component} from 'react';
import '../css/Main.css';
import api from "../utils/api";
import {CodeSnippet} from "./code_snippets/CodeSnippet";
import Loading from "./Loading";
import {copyDate, minDate, subtractDays} from "../utils/DateUtils";
import {getDocumentHeight} from "../utils/DOMUtils";

interface IState {
    loadingNewSnippets: boolean;
    content: JSX.Element[];
}

class Main extends Component<any, IState> {
    private elementPosition: number; // Element position in the list to serve as keys
    private snippetsAvailable?: boolean;
    private componentExists: boolean;
    private feedStart!: Date;
    private postsDateStart!: Date;
    private postsDateEnd!: Date;
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
        // Loops until it gets snippets or 204 No Content (to show that there are no more snippets)
        while (true) {
            let start = this.postsDateStart;
            let end = minDate(this.feedStart, this.postsDateEnd);

            let response = await api.get<number[]>("snippets/recommended/", {params: {start: start, end: end}});

            if (response.status === 200) { // Success
                let emptyResponse = response.data.length === 0;

                if (!emptyResponse) {
                    let data = response.data;
                    let content = this.state.content;
                    this.snippetsLoading = data.length;

                    for (let snippetId of data) {
                        let elementPosition = this.elementPosition++;
                        content.push(
                            <CodeSnippet key={"snippet-" + elementPosition} order={elementPosition}
                                         snippetId={snippetId} onLoad={this.snippetLoaded}/>
                        );
                    }

                    this.setState({content: content});
                }

                subtractDays(this.postsDateStart, 1);
                subtractDays(this.postsDateEnd, 1);

                if (emptyResponse) continue;
            } else if (response.status === 204) { // No content
                this.snippetsAvailable = false;
            } else { // Error
                console.log(response);
            }

            this.setState({loadingNewSnippets: false});
            break;
        }
    }

    private snippetLoaded() {
        this.snippetsLoading--;
        if (this.snippetsLoading === 0) {
            this.updateWindow();
        }
    }

    private async startFeed() {
        this.snippetsAvailable = true;
        this.feedStart = new Date();

        this.postsDateEnd = copyDate(this.feedStart);
        this.postsDateEnd.setHours(23);
        this.postsDateEnd.setMinutes(59);
        this.postsDateEnd.setSeconds(59);
        this.postsDateEnd.setMilliseconds(999);

        this.postsDateStart = copyDate(this.feedStart);
        this.postsDateStart.setHours(0);
        this.postsDateStart.setMinutes(0);
        this.postsDateStart.setSeconds(0);
        this.postsDateStart.setMilliseconds(0);

        if (this.componentExists) { // Avoids error: Can't perform a React state update on an unmounted component
            this.updateWindow();
        }
    }
}

export default Main;
