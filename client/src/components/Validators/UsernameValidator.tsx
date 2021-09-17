import api from "../../utils/api";
import {IValidator} from "./IValidator";

export class UsernameValidator implements IValidator {
    private static readonly charactersRegex = new RegExp("^\\w+$");
    
    public isRequiredLength: boolean;
    public allowedChars: boolean;
    public isAvailable: boolean;
    
    constructor() {
        this.validate = this.validate.bind(this);
        this.isValid = this.isValid.bind(this);
        
        this.isRequiredLength = false;
        this.allowedChars = false;
        this.isAvailable = false;
    }
    
    public async validate(username: string) {
        this.isRequiredLength = username.length >= 4;
        this.allowedChars = UsernameValidator.charactersRegex.test(username);
        
        if (this.isRequiredLength && this.allowedChars) {
            let response = await api.post<boolean>("/users/isAvailable", username);
            this.isAvailable = response.data;
        }
    }
    
    public isValid(): boolean {
        return this.isRequiredLength && this.allowedChars && this.isAvailable;
    }
}