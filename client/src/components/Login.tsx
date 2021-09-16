import {Component} from "react";
import {CardForm} from "./FormComponents";
import {FormData} from "../models/FormData";
import {AxiosResponse} from "axios";
import {Alert} from "react-bootstrap";

interface Response {

}

interface State {
    data: FormData<Response>;
    busy: boolean;
    success: boolean;
}

class Login extends Component<any, State> {
    public constructor(props: any) {
        super(props);
        
        this.startSending = this.startSending.bind(this);
        this.success = this.success.bind(this);
        this.failed = this.failed.bind(this);
        
        this.state = {
            data: new FormData<Response>("auth/login", "post", this.startSending, this.success, this.failed),
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
                        <label className="form-label" htmlFor="username">Username</label><br/>
                        <input onInput={formData.inputChange} name="username" type="text" id="username"
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
    
    private success(response: AxiosResponse<Response>) {
        this.setState({busy: false});
        alert(response);
    }
    
    private failed() {
        this.setState({busy: false});
        this.setState({success: false});
        let passwordInput = document.getElementById("password") as HTMLInputElement;
        passwordInput.value = "";
    }
}

export default Login;