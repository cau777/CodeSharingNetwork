import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Main from './components/Main';
import Header from "./components/Header";
import Login from "./components/Login";
import {Route, BrowserRouter as Router, Switch} from 'react-router-dom'
import RedirectNotAuthenticated from "./components/RedirectNotAuthenticated";
import Loading from "./components/Loading";


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
                        
                        <RedirectNotAuthenticated/>
                        
                        {/* Authenticated routes */}
                        <Route exact path="/" strict={true}>
                            <Main/>
                        </Route>
                    </Switch>
                </div>
            </div>
        </Router>
    </React.StrictMode>,
    document.getElementById('root')
);
