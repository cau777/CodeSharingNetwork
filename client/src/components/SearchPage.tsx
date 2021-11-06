import {Component} from "react";
import Link from "./Link";
import SnippetsFeed from "./code_snippets/SnippetsFeed";
import {generateSearchSnippets} from "./code_snippets/SnippetsGenerators";
import {UsersSearchList} from "./UsersSearchList";

interface IProps {
    query: string;
}

class SearchPage extends Component<IProps, any> {
    public constructor(props: IProps) {
        super(props);
    }
    
    public render() {
        return (
            <div>
                <h3>Search results for "{this.props.query}"</h3>
                <p>Back to <Link to="/">Home</Link></p>
                <UsersSearchList query={this.props.query}/>
                <SnippetsFeed snippetsIdGenerator={generateSearchSnippets(this.props.query)}/>
            </div>
        );
    }
}

export default SearchPage;