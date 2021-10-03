import CookieManager from "../CookieManager";
import api from "../api";
import {ICredentials} from "./ICredentials";
import React from "react";
import {IAuthServiceContext} from "./IAuthServiceContext";

export class AuthService {
    private static readonly CookieName = "jwt";
    private token?: string;
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
        
        let response = await api.get<ICredentials>("auth/info", {headers: {Authorization: authorization}});
        if (response.status !== 200) {
            console.log("token expired"); // Logout if the token is expired
            this.logout()
        } else {
            this.token = token;
            this.component.setState({credentials: response.data});
            api.defaults.headers.Authorization = authorization;
            
            CookieManager.setCookie(AuthService.CookieName, this.token, 3600 * 4);
        }
    }
    
    public logout() {
        this.component.setState({credentials: undefined});
        api.defaults.headers.Authorization = undefined;
        CookieManager.clearCookie(AuthService.CookieName);
    }
}