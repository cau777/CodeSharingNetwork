import {IAuthServiceContext} from "../../utils/auth/IAuthServiceContext";
import {AuthService} from "../../utils/auth/AuthService";

export interface IAppContext extends IAuthServiceContext {
    authService: AuthService;
}