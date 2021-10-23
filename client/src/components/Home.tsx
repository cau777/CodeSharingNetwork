import React, {Component} from "react";
import {generateSnippetsByDay} from "./code_snippets/SnippetsGenerators";
import SnippetsFeed from "./code_snippets/SnippetsFeed";

export class Home extends Component<any, any> {
    public render() {
        return (
            <div>
                <SnippetsFeed snippetsIdGenerator={generateSnippetsByDay()}/>
            </div>
        );
    }
}