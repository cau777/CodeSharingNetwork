import CookieManager from "../CookieManager";
import api from "../api";
import {ICredentials} from "./ICredentials";
import React from "react";
import {IAuthServiceContext} from "./IAuthServiceContext";

/**
 * @summary Class to control authentication and set the credentials to a component state
 */
export class AuthService {
    private static readonly CookieName = "jwt";
    private component: React.Component<any, IAuthServiceContext>;
    
    public constructor(component: React.Component<any, IAuthServiceContext>) {
        this.component = component;
    }
    
    public async authenticateFromCookies() {
        let cookie = CookieManager.getCookie(AuthService.CookieName);
        if (cookie !== undefined && cookie !== "") {
            await this.authenticate(cookie);
        }
    }
    
    public async authenticate(token: string) {
        let authorization = "Bearer " + token;
        
        // Tries getting the credentials of the current user
        try {
            let response = await api.get<ICredentials>("auth/credentials", {headers: {Authorization: authorization}});
            if (response.status !== 200) {
                // Logout if the token is invalid or expired
                this.logout()
            } else {
                api.defaults.headers.Authorization = authorization;
                
                CookieManager.setCookie(AuthService.CookieName, token, 3600 * 4);
                this.component.setState({credentials: response.data});
            }
        } catch (e) {
            this.logout();
        }
    }
    
    public logout() {
        this.component.setState({credentials: undefined});
        api.defaults.headers.Authorization = undefined;
        CookieManager.clearCookie(AuthService.CookieName);
    }
}