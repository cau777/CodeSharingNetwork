import CookieManager from "../CookieManager";
import api from "../api";
import {ICredentials} from "./ICredentials";

export class AuthService {
    public static credentials?: ICredentials;
    
    private static readonly authenticationEvents: ((authenticated: boolean) => void)[] = [];
    private static readonly CookieName = "jwt";
    private static token?: string;
    
    public static isAuthenticated() {
        return AuthService.token !== undefined;
    }
    
    public static addAuthenticationEvent(event: (authenticated: boolean) => void) {
        AuthService.authenticationEvents.push(event);
    }
    
    public static async authenticateFromCookies() {
        let cookie = CookieManager.getCookie(AuthService.CookieName);
        if (cookie !== undefined && cookie !== "") {
            await AuthService.authenticate(cookie);
        }
    }
    
    public static async authenticate(token: string) {
        let authorization = "Bearer " + token;
        
        await api.get<ICredentials>("auth/info", {headers: {Authorization: authorization}}).then(response => {
            AuthService.token = token;
            AuthService.credentials = response.data;
            api.defaults.headers.Authorization = authorization;
            
            CookieManager.setCookie(AuthService.CookieName, AuthService.token, 3600 * 4);
            AuthService.authenticationEvents.forEach(o => o(true));
        }, () => AuthService.logout()); // Logout if the token is expired
    }
    
    public static logout() {
        AuthService.token = undefined;
        AuthService.credentials = undefined;
        api.defaults.headers.Authorization = undefined;
        CookieManager.clearCookie(AuthService.CookieName);
        AuthService.authenticationEvents.forEach(o => o(false));
    }
}