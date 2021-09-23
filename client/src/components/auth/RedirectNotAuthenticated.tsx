import {Component} from "react";
import {NotAuthenticated} from "./NotAuthenticated";
import {Redirect} from "react-router-dom";

export class RedirectNotAuthenticated extends Component<any, any>{
    public render() {
        return (
            <NotAuthenticated>
                <Redirect to={"/login"}/>
            </NotAuthenticated>
        );
    }
}