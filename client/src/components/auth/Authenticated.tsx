import {Component} from "react";
import {AuthService} from "../../utils/auth/AuthService";

export class Authenticated extends Component {
    public render() {
        if (AuthService.isAuthenticated()) {
            return (
                <div>
                    {this.props.children}
                </div>
            );
        }
        return ("");
    }
}
