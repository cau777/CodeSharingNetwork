import React, {Component, FormEvent} from "react";
import {FormController} from "../../utils/forms/FormController";
import {CardForm} from "./CardForm";
import {AxiosResponse} from "axios";
import RequirementItem from "../RequirementItem";
import {Alert, Button} from "react-bootstrap";
import {UsernameValidator} from "./validators/UsernameValidator";
import {PasswordValidator} from "./validators/PasswordValidator";
import Link from "../Link";
import {RouteComponentProps, withRouter} from "react-router-dom";
import AppContext from "../app/AppContext";

interface IProps extends RouteComponentProps {

}

interface IState {
    busy: boolean;
    success: boolean;
}

class Register extends Component<IProps, IState> {
    static contextType = AppContext;
    context!: React.ContextType<typeof AppContext>;

    private passwordInput!: HTMLInputElement;
    private passwordRepeatInput!: HTMLInputElement;

    private readonly form: FormController<string>;
    private readonly passwordValidator: PasswordValidator;
    private readonly usernameValidator: UsernameValidator;

    public constructor(props: IProps) {
        super(props);

        this.startSending = this.startSending.bind(this);
        this.success = this.success.bind(this);
        this.failed = this.failed.bind(this);
        this.validatePassword = this.validatePassword.bind(this);
        this.validateUser = this.validateUser.bind(this);

        this.state = {
            busy: false,
            success: true,
        }

        this.form = new FormController<string>("auth/register", "post", this.startSending, this.success, this.failed);
        this.passwordValidator = new PasswordValidator();
        this.usernameValidator = new UsernameValidator();
    }

    public componentDidMount() {
        this.passwordInput = document.getElementById("password") as HTMLInputElement;
        this.passwordRepeatInput = document.getElementById("password2") as HTMLInputElement;
    }

    public render() {
        let form = this.form;
        let usernameValidator = this.usernameValidator;
        let passwordValidator = this.passwordValidator;

        return (
            <CardForm name="Register" target={form}>
                <Alert variant="danger" hidden={this.state.success}>
                    Invalid request
                </Alert>

                <div className="form-section">
                    <label className="form-label" htmlFor="name">Username</label><br/>
                    <input className="selected-border" onInput={this.validateUser} name="name" type="text" id="name"
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
                    <input className="selected-border" onInput={this.validatePassword} name="password" type="password"
                           id="password"
                           required={true} maxLength={9999} spellCheck="false"/><br/>

                    <label className="form-label" htmlFor="password2">Repeat the password</label><br/>
                    <input className="selected-border" onInput={this.validatePassword} type="password" id="password2"
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
                <div>
                    <Button
                        disabled={this.state.busy || !usernameValidator.isValid() || !passwordValidator.isValid()}
                        type="submit">Submit
                    </Button>
                </div>
                <div>
                    <span className="text-secondary">
                        Already registered? <Link to="/login">Log in</Link>
                    </span>
                </div>
            </CardForm>
        );
    }

    private startSending() {
        this.setState({busy: true});
    }

    private success(response: AxiosResponse<string>) {
        this.context.authService.authenticate(response.data).then(() => {
            this.props.history.push("/");
        });
    }

    private failed() {
        this.setState({busy: false, success: false});

        this.passwordInput.value = "";
        this.passwordRepeatInput.value = "";
    }

    private validatePassword(event: FormEvent<HTMLInputElement>) {
        this.form.inputChange(event);

        this.passwordValidator.validate(this.passwordInput.value, this.passwordRepeatInput.value);
        this.forceUpdate();
    }

    private async validateUser(event: FormEvent<HTMLInputElement>) {
        this.form.inputChange(event);

        let name = (document.getElementById("name") as HTMLInputElement).value;

        await this.usernameValidator.validate(name);
        this.forceUpdate();
    }
}

export default withRouter(Register);