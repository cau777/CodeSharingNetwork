import {Component} from "react";
import {AuthService} from "../utils/auth/AuthService";
import {Redirect} from "react-router-dom";

export class Logout extends Component<any, any> {
    public render() {
        AuthService.logout();
        return (
            <div>
                <Redirect to="/login"/>
            </div>
        );
    }
}