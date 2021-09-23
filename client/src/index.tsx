import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';
import Main from './components/Main';
import Header from "./components/Header";
import Login from "./components/Login";
import {Route, BrowserRouter as Router, Switch} from 'react-router-dom'
import Loading from "./components/Loading";
import Register from "./components/Register";
import {AuthService} from "./utils/auth/AuthService";
import PostSnippet from "./components/PostSnippet";
import NotFound from "./NotFound";
import {RedirectNotAuthenticated} from "./components/auth/RedirectNotAuthenticated";
import {Logout} from "./components/Logout";

async function prepareDependencies() {
    await AuthService.authenticateFromCookies();
}

prepareDependencies().then(() =>
    ReactDOM.render(
        <React.StrictMode>
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
        </React.StrictMode>,
        document.getElementById('root')
    )
);
