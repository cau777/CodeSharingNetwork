import {Component} from "react";
import {AuthService} from "../../utils/auth/AuthService";

interface IState {
    authenticated: boolean;
}

export class Authenticated extends Component<any, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            authenticated: AuthService.isAuthenticated()
        };
    }
    
    public render() {
        if (this.state.authenticated) {
            return this.props.children;
        }
        return ("");
    }
    
    public componentDidMount() {
        AuthService.addAuthenticationEvent(authenticated => this.setState({authenticated: authenticated}));
    }
}
