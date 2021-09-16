export class PasswordValidator {
    private static readonly numbersRegex = new RegExp(".*\\d.*");
    private static readonly uppercaseRegex = new RegExp(".*[A-Z].*");
    private static readonly lowercaseRegex = new RegExp(".*[a-z].*");
    
    public readonly isRequiredLength: boolean;
    public readonly hasNumber: boolean;
    public readonly hasUppercaseAndLowercase: boolean;
    
    public constructor(password: string) {
        this.isRequiredLength = password.length >= 8;
        this.hasNumber = PasswordValidator.numbersRegex.test(password)
        this.hasUppercaseAndLowercase = PasswordValidator.uppercaseRegex.test(password) &&
            PasswordValidator.lowercaseRegex.test(password);
    }
}