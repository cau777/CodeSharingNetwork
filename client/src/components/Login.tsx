import React, {Component} from "react";
import {CardForm} from "./FormComponents";
import {FormData} from "../utils/forms/FormData";
import {AxiosResponse} from "axios";
import {Alert} from "react-bootstrap";
import {AuthService} from "../utils/auth/AuthService";
import {RouteComponentProps, withRouter} from "react-router-dom";

interface State {
    data: FormData<string>;
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
            data: new FormData<string>("auth/login", "post", this.startSending, this.success, this.failed),
            busy: false,
            success: true
        };
    }
    
    public render() {
        let formData = this.state.data;
        return (
            <CardForm name="Login" target={formData}>
                <div className="card">
                    <Alert variant="danger" hidden={this.state.success}>
                        Wrong username or password
                    </Alert>
                    
                    <div className="form-section">
                        <label className="form-label" htmlFor="name">Username</label><br/>
                        <input onInput={formData.inputChange} name="name" type="text" id="name"
                               required={true} maxLength={9999} spellCheck="false"/><br/>
                        
                        <label className="form-label" htmlFor="password">Password</label><br/>
                        <input onInput={formData.inputChange} name="password" type="password" id="password"
                               required={true} maxLength={9999} spellCheck="false"/><br/>
                    </div>
                    
                    <button disabled={this.state.busy} type="submit" className="btn btn-primary">Submit</button>
                    
                    <div>
                        <p className="text-secondary">
                            New here? <a href={"/register"}>Create an account</a>
                        </p>
                    </div>
                </div>
            </CardForm>
        );
    }
    
    private startSending() {
        this.setState({busy: true});
    }
    
    private success(response: AxiosResponse<string>) {
        AuthService.authenticate(response.data).then(() => {
            this.setState({busy: false});
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