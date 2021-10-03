import React, {Component} from "react";
import AppContext from "../app/AppContext";

export class NotAuthenticated extends Component{
    static contextType = AppContext;
    context!: React.ContextType<typeof AppContext>;
    
    public render() {
        if (this.context.credentials === undefined) {
            return this.props.children;
        }
        return ("");
    }
}