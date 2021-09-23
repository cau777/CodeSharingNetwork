import {Component} from "react";
import {AuthService} from "../../utils/auth/AuthService";

export class NotAuthenticated extends Component<any, any>{
    public render() {
        if (!AuthService.isAuthenticated()) {
            return (
                <div>
                    {this.props.children}
                </div>
            );
        }
        return ("");
    }
}