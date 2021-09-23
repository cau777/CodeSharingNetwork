import {IClaim} from "./ICredentials";
import CookieManager from "../CookieManager";
import api from "../api";

export class AuthService {
    private static readonly authenticationEvents: ((authenticated: boolean) => void)[] = [];
    private static readonly CookieName = "jwt";
    private static claims: IClaim[] | undefined;
    private static token: string | undefined;
    
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
        
        await api.get<IClaim[]>("auth/info", {headers: {Authorization: authorization}}).then(response => {
            AuthService.token = token;
            AuthService.claims = response.data;
            api.defaults.headers.Authorization = authorization;
            
            CookieManager.setCookie(AuthService.CookieName, AuthService.token, 3600 * 4);
            AuthService.authenticationEvents.forEach(o => o(true));
        }, () => AuthService.logout()); // Logout if the token is expired
    }
    
    public static logout() {
        AuthService.token = undefined;
        AuthService.claims = undefined;
        api.defaults.headers.Authorization = undefined;
        CookieManager.clearCookie(AuthService.CookieName);
        AuthService.authenticationEvents.forEach(o => o(false));
    }
}