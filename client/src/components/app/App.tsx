import React from "react";
import {IAppContext} from "./IAppContext";
import Header from "../Header";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Login from "../Login";
import Loading from "../Loading";
import Register from "../Register";
import {RedirectNotAuthenticated} from "../auth/RedirectNotAuthenticated";
import PostSnippet from "../PostSnippet";
import {Logout} from "../Logout";
import Main from "../Main";
import NotFound from "../../NotFound";
import AppContext from "./AppContext";
import {AuthService} from "../../utils/auth/AuthService";

interface IState extends IAppContext {
    loading: boolean;
}

export class App extends React.Component<any, IState> {
    public constructor(props: any) {
        super(props);
        
        this.prepare = this.prepare.bind(this);
        
        this.state = {
            loading: true,
            authService: new AuthService(this)
        };
    }
    
    public render() {
        if (this.state.loading){
            return <Loading/>;
        }
        
        return (
            <AppContext.Provider value={{
                credentials: this.state.credentials,
                authService: this.state.authService,
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
                                    <Main/>
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
    
    private async prepare() {
        await this.state.authService.authenticateFromCookies();
        this.setState({loading: false});
    }
}