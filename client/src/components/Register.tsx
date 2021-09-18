import {Component, FormEvent} from "react";
import {FormData} from "../utils/forms/FormData";
import {CardForm} from "./FormComponents";
import {AxiosResponse} from "axios";
import RequirementItem from "./RequirementItem";
import {Alert} from "react-bootstrap";
import {UsernameValidator} from "./Validators/UsernameValidator";
import {PasswordValidator} from "./Validators/PasswordValidator";

interface Response {

}

interface State {
    data: FormData<Response>;
    busy: boolean;
    success: boolean;
    usernameValidator: UsernameValidator;
    passwordValidator: PasswordValidator;
}

class Register extends Component<any, State> {
    public constructor(props: any) {
        super(props);
        
        this.startSending = this.startSending.bind(this);
        this.success = this.success.bind(this);
        this.failed = this.failed.bind(this);
        this.validatePassword = this.validatePassword.bind(this);
        this.validateUser = this.validateUser.bind(this);
        
        this.state = {
            data: new FormData<Response>("auth/register", "post", this.startSending, this.success, this.failed),
            busy: false,
            success: true,
            passwordValidator: new PasswordValidator(),
            usernameValidator: new UsernameValidator()
        }
    }
    
    public render() {
        let formData = this.state.data;
        let usernameValidator = this.state.usernameValidator;
        let passwordValidator = this.state.passwordValidator;
        
        return (
            <CardForm name="Register" target={formData}>
                <div className="card">
                    <Alert variant={"danger"} hidden={this.state.success}>
                        Invalid request
                    </Alert>
                    
                    <div className="form-section">
                        <label className="form-label" htmlFor="name">Username</label><br/>
                        <input onInput={this.validateUser} name="name" type="text" id="name"
                               required={true} maxLength={9999} spellCheck={"false"}/>
                        <div>
                            <RequirementItem message="At least 4 characters long"
                                             fulfilled={usernameValidator.isRequiredLength}/>
                            <RequirementItem message="Only contains letters and underscores"
                                             fulfilled={usernameValidator.allowedChars}/>
                            <RequirementItem message={"Is available"} fulfilled={usernameValidator.isAvailable}/>
                        </div>
                    </div>
                    <div className="form-section">
                        <label className="form-label" htmlFor="password">Password</label><br/>
                        <input onInput={this.validatePassword} name="password" type="password" id="password"
                               required={true} maxLength={9999} spellCheck="false"/><br/>
                        
                        <label className="form-label" htmlFor="password2">Repeat the password</label><br/>
                        <input onInput={this.validatePassword} type="password" id="password2"
                               required={true} maxLength={9999} spellCheck="false"/>
                        
                        <div>
                            <RequirementItem message="At least 8 characters long"
                                             fulfilled={passwordValidator.isRequiredLength}/>
                            <RequirementItem message="Contains a number" fulfilled={passwordValidator.hasNumber}/>
                            <RequirementItem message="Contains uppercase and lowercase letters"
                                             fulfilled={passwordValidator.hasUppercaseAndLowercase}/>
                            <RequirementItem message="Passwords are equal"
                                             fulfilled={passwordValidator.passwordsMatch}/>
                        </div>
                    </div>
                    <div className="form-section">
                        <button
                            disabled={this.state.busy || !this.state.usernameValidator.isValid() || !this.state.passwordValidator.isValid()}
                            type="submit" className="btn btn-primary">Submit
                        </button>
                    </div>
                </div>
            </CardForm>
        );
    }
    
    private startSending() {
        this.setState({busy: true});
    }
    
    private success(response: AxiosResponse<Response>) {
        this.setState({busy: false});
        alert(response);
    }
    
    private failed() {
        this.setState({busy: false});
        this.setState({success: false});
        
        let password = document.getElementById("password") as HTMLInputElement;
        let password2 = document.getElementById("password2") as HTMLInputElement;
    
        password.value = "";
        password2.value = "";
    }
    
    private validatePassword(event: FormEvent<HTMLInputElement>) {
        this.state.data.inputChange(event);
        
        let password = (document.getElementById("password") as HTMLInputElement).value;
        let password2 = (document.getElementById("password2") as HTMLInputElement).value;
        
        this.state.passwordValidator.validate(password, password2);
        this.setState({passwordValidator: this.state.passwordValidator});
    }
    
    private async validateUser(event: FormEvent<HTMLInputElement>) {
        this.state.data.inputChange(event);
        
        let name = (document.getElementById("name") as HTMLInputElement).value;
        
        await this.state.usernameValidator.validate(name);
        this.setState({usernameValidator: this.state.usernameValidator});
    }
}

export default Register;