import api from "../../utils/api";

export class UsernameValidator {
    private static readonly charactersRegex = new RegExp("^[a-zA-Z0-9_]+$");
    
    public isAvailable: boolean;
    public readonly isRequiredLength: boolean;
    public readonly allowedChars: boolean;
    
    private readonly username: string;
    
    constructor(username: string) {
        this.isRequiredLength = username.length >= 4;
        this.allowedChars = UsernameValidator.charactersRegex.test(username);
        this.isAvailable = false;
        this.username = username;
        
        this.checkAvailability = this.checkAvailability.bind(this);
    }
    
    public async checkAvailability() {
        if (this.isRequiredLength && this.allowedChars) {
            let response = await api.post<boolean>("/users/isAvailable", this.username);
            this.isAvailable = response.data;
        }
    }
}