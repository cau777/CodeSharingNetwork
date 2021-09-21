import React, {Component} from "react";
import {CardForm} from "./FormComponents";
import {FormController} from "../utils/forms/FormController";
import {AxiosResponse} from "axios";
import {Alert, Button} from "react-bootstrap";
import {AuthService} from "../utils/auth/AuthService";
import {RouteComponentProps, withRouter} from "react-router-dom";
import Link from "./Link";

interface State {
    form: FormController<string>;
    busy: boolean;
    success: boolean;
}

interface IProps extends RouteComponentProps {
}

class Login extends Component<IProps, State> {
    public constructor(props: IProps, context: any) {
        super(props, context);
        
        this.startSending = this.startSending.bind(this);
        this.success = this.success.bind(this);
        this.failed = this.failed.bind(this);
        this.state = {
            form: new FormController<string>("auth/login", "post", this.startSending, this.success, this.failed),
            busy: false,
            success: true
        };
    }
    
    public render() {
        let form = this.state.form;
        return (
            <CardForm name="Login" target={form}>
                <Alert variant="danger" hidden={this.state.success}>
                    Wrong username or password
                </Alert>
                
                <div className="form-section">
                    <label className="form-label" htmlFor="name">Username</label><br/>
                    <input className="selected-border" onInput={form.inputChange} name="name" type="text" id="name"
                           required={true} maxLength={9999} spellCheck="false"/><br/>
                    
                    <label className="form-label" htmlFor="password">Password</label><br/>
                    <input className="selected-border" onInput={form.inputChange} name="password" type="password" id="password"
                           required={true} maxLength={9999} spellCheck="false"/><br/>
                </div>
                
                <div>
                    <Button disabled={this.state.busy} type="submit">Submit</Button>
                </div>
                
                <div>
                    <span className="text-secondary">
                        New here? <Link to="/register">Create an account</Link>
                    </span>
                </div>
            </CardForm>
        );
    }
    
    private startSending() {
        this.setState({busy: true});
    }
    
    private success(response: AxiosResponse<string>) {
        AuthService.authenticate(response.data).then(() => {
            this.props.history.push("/");
        });
    }
    
    private failed() {
        this.setState({busy: false});
        this.setState({success: false});
        let passwordInput = document.getElementById("password") as HTMLInputElement;
        passwordInput.value = "";
    }
}

export default withRouter(Login);