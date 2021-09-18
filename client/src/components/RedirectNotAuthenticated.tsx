import {Component} from "react";
import {Redirect} from "react-router-dom";
import {AuthService} from "../utils/auth/AuthService";

class RedirectNotAuthenticated extends Component {
    public render() {
        if (!AuthService.isAuthenticated()) {
            return (<Redirect to="/login"/>);
        }
        return ("");
    }
}

export default RedirectNotAuthenticated;