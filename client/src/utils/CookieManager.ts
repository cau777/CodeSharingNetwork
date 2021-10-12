/**
 * @summary Static utility class to manage cookies
 */
class CookieManager {
    /**
     * @summary Gets the value of the cookie with the provided name
     * @param name The cookie name to search
     */
    public static getCookie(name: string) {
        return document.cookie.split("; ").find(o => o.startsWith(name + "="))?.split("=")[1];
    }

    /**
     * @summary Sets the value of a cookie or creates a new one
     * @param name The cookie name
     * @param value The cookie value
     * @param maxAge Optional cookie maximum age (in seconds)
     */
    public static setCookie(name: string, value: string, maxAge: number | undefined = undefined) {
        let cookie = name + "=" + value + "; ";
        if (maxAge !== undefined) cookie += "max-age=" + maxAge + "; ";
        
        document.cookie = cookie;
    }

    /**
     * @summary Clears the value of a cookie
     * @param name The name of the cookie to clear
     */
    public static clearCookie(name: string) {
        document.cookie = name + "=;";
    }
}

export default CookieManager;