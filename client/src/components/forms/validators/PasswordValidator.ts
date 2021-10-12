export class PasswordValidator {
    private static readonly numbersRegex = new RegExp(".*\\d.*");
    private static readonly uppercaseRegex = new RegExp(".*[A-Z].*");
    private static readonly lowercaseRegex = new RegExp(".*[a-z].*");
    
    public isRequiredLength: boolean;
    public hasNumber: boolean;
    public hasUppercaseAndLowercase: boolean;
    public passwordsMatch: boolean;
    
    public constructor() {
        this.isValid = this.isValid.bind(this);
        
        this.isRequiredLength = false;
        this.hasNumber = false;
        this.hasUppercaseAndLowercase = false;
        this.passwordsMatch = false;
    }
    
    public validate(password: string, password2: string) {
        this.isRequiredLength = password.length >= 8;
        this.hasNumber = PasswordValidator.numbersRegex.test(password)
        this.hasUppercaseAndLowercase = PasswordValidator.uppercaseRegex.test(password) &&
            PasswordValidator.lowercaseRegex.test(password);
        this.passwordsMatch = password === password2;
    }
    
    public isValid(): boolean {
        return this.isRequiredLength && this.hasNumber && this.hasUppercaseAndLowercase && this.passwordsMatch;
    }
}