import React from "react";
import {IAppContext} from "./IAppContext";
import Header from "../Header";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
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

interface IState extends IAppContext {
    loading: boolean;
}

export class App extends React.Component<any, IState> {
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
        
        return (
            <AppContext.Provider value={{
                credentials: this.state.credentials,
                authService: this.state.authService
            }}>
                <Router>
                    <Header/>
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
                                
                                <Route path="/profile">
                                    <RedirectNotAuthenticated/>
                                    <Profile/>
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
                </Router>
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