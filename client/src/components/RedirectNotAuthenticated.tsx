import {Component} from "react";
import {Redirect} from "react-router-dom";

function checkAuthenticated(): boolean {
    return false;
}

class RedirectNotAuthenticated extends Component {
    public render() {
        if (!checkAuthenticated()) {
            return (<Redirect to="/login"/>);
        }
        return ("");
    }
}

export default RedirectNotAuthenticated;