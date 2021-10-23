import React, {Component} from "react";
import {RouteComponentProps, withRouter} from "react-router-dom";
import AppContext from "./app/AppContext";

interface IProps extends RouteComponentProps {
}

class Logout extends Component<IProps, any> {
    static contextType = AppContext;
    context!: React.ContextType<typeof AppContext>;
    
    public render() {
        return (
            <div/>
        );
    }
    
    public componentDidMount() {
        this.context.authService.logout();
        this.props.history.push("/login");
    }
}

export default withRouter(Logout);