import "../css/Link.css";
import {Component} from "react";
import {RouteComponentProps, withRouter} from "react-router-dom";

interface IProps extends RouteComponentProps {
    to: string;
}

class Link extends Component<IProps, any> {
    public render() {
        return (
            <span className="link" onClick={() => this.props.history.push(this.props.to)}>{this.props.children}</span>
        );
    }
}

export default withRouter(Link);