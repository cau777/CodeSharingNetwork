import {IClaim} from "./ICredentials";
import CookieManager from "../CookieManager";
import api from "../api";

export class AuthService {
    private static readonly CookieName = "jwt";
    private static claims: IClaim[] | undefined;
    private static token: string | undefined;
    
    public static isAuthenticated() {
        return AuthService.token !== undefined;
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
        }, () => CookieManager.setCookie(AuthService.CookieName, ""));
    }
}