class CookieManager {
    public static getCookie(name: string) {
        return document.cookie.split("; ").find(o => o.startsWith(name + "="))?.split("=")[1];
    }
    
    public static setCookie(name: string, value: string, maxAge: number | undefined = undefined) {
        let cookie = name + "=" + value + "; ";
        if (maxAge !== undefined) cookie += "max-age=" + maxAge + "; ";
        
        document.cookie = cookie;
    }
}

export default CookieManager;