import React, {Component} from "react";
import {Redirect} from "react-router-dom";
import AppContext from "./app/AppContext";

export class Logout extends Component<any, any> {
    static contextType = AppContext;
    context!: React.ContextType<typeof AppContext>;
    
    public render() {
        this.context.authService.logout();
        
        return (
            <div>
                <Redirect to="/login"/>
            </div>
        );
    }
}