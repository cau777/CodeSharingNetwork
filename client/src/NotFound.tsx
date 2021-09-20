import {Component} from "react";

class NotFound extends Component {
    public render() {
        return (
            <div>
                <h1>Not found</h1>
                <h3>Route {window.location.pathname} was not found</h3>
            </div>
        );
    }
}

export default NotFound;