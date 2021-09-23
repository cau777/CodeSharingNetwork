import {Component} from "react";
import {RouteComponentProps, withRouter} from "react-router-dom";

interface IProps extends RouteComponentProps {
    to: string;
}

class SimpleLink extends Component<IProps, any> {
    public render() {
        return (
            <span onClick={() => this.props.history.push(this.props.to)}>{this.props.children}</span>
        );
    }
}

export default withRouter(SimpleLink);