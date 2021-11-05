import React from "react";
import {IAppContext} from "./IAppContext";
import Header from "../Header";
import {Route, RouteComponentProps, Switch, withRouter} from "react-router-dom";
import Login from "../forms/Login";
import Loading from "../Loading";
import Register from "../forms/Register";
import {RedirectNotAuthenticated} from "../auth/RedirectNotAuthenticated";
import PostSnippet from "../forms/PostSnippet";
import Logout from "../Logout";
import NotFound from "../../NotFound";
import AppContext from "./AppContext";
import {AuthService} from "../../utils/auth/AuthService";
import {Profile} from "../Profile";
import {Home} from "../Home";
import {Settings} from "../settings/Settings";
import SearchPage from "../SearchPage";
import queryString from "querystring";

interface IProps extends RouteComponentProps {

}

interface IState extends IAppContext {
    loading: boolean;
    query?: string;
}

class App extends React.Component<IProps, IState> {
    public constructor(props: any) {
        super(props);
        
        this.prepare = this.prepare.bind(this);
        
        this.state = {
            loading: true,
            authService: new AuthService(this),
        };
    }
    
    public render() {
        if (this.state.loading) {
            return <Loading/>;
        }
        
        let args = queryString.parse(this.props.location.search.substring(1));
        
        return (
            <AppContext.Provider value={{
                credentials: this.state.credentials,
                authService: this.state.authService
            }}>
                <Header onSearchChanged={() => this.forceUpdate()}/>
                <div className="container">
                    <div className="pb-3">
                        <Switch>
                            {/* Public routes */}
                            <Route path="/login">
                                <Login/>
                            </Route>
                            <Route path="/loading">
                                <Loading/>
                            </Route>
                            <Route path="/register">
                                <Register/>
                            </Route>
                            
                            {/* Authenticated routes */}
                            <Route path="/post">
                                <RedirectNotAuthenticated/>
                                <PostSnippet/>
                            </Route>
                            
                            <Route path="/logout">
                                <RedirectNotAuthenticated/>
                                <Logout/>
                            </Route>
                            
                            <Route path="/" exact={true}>
                                <RedirectNotAuthenticated/>
                                <Home/>
                            </Route>
                            
                            <Route path="/search">
                                <RedirectNotAuthenticated/>
                                <SearchPage query={args.q as string}/>
                            </Route>
                            
                            <Route path="/user/:username" render={props => (
                                    <span>
                                        <RedirectNotAuthenticated/>
                                        <Profile username={props.match.params.username}/>
                                    </span>
                                )}>
                            </Route>
                            
                            <Route path="/profile">
                                <RedirectNotAuthenticated/>
                                <Profile username={this.state.credentials?.username}/>
                            </Route>
                            
                            <Route path="/settings">
                                <RedirectNotAuthenticated/>
                                <Settings/>
                            </Route>
                            
                            {/* Not found */}
                            <Route path="/">
                                <NotFound/>
                            </Route>
                        </Switch>
                    </div>
                </div>
            </AppContext.Provider>
        );
    }
    
    public componentDidMount() {
        this.prepare().then();
    }
    
    /**
     * @summary Initializes the necessary services
     * @private
     */
    private async prepare() {
        await this.state.authService.authenticateFromCookies();
        this.setState({loading: false});
    }
}

export default withRouter(App);