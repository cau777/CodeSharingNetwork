import {Component} from "react";
import {CardForm} from "./FormComponents";
import {FormData} from "../models/FormData";
import {AxiosResponse} from "axios";

interface Response {

}

interface State {
    data: FormData<Response>;
    busy: boolean;
}

class Login extends Component<any, State> {
    public constructor(props: any) {
        super(props);
        
        this.startSending = this.startSending.bind(this);
        this.finishSending = this.finishSending.bind(this);
        
        this.state = {
            data: new FormData<Response>("auth/login", "post", this.startSending, this.finishSending),
            busy: false
        };
    }
    
    public render() {
        let formData = this.state.data;
        return (
            <CardForm name="Login" target={formData}>
                <div className="card">
                    <div className="form-section">
                        <label className="form-label" htmlFor="username">Username</label><br/>
                        <input onInput={formData.inputChange} name="username" type="text" id="username"
                               required={true}/><br/>
                        
                        <label className="form-label" htmlFor="password">Password</label><br/>
                        <input onInput={formData.inputChange} name="password" type="password" id="password"
                               required={true}/><br/>
                    </div>
                    <div className="form-section">
                        <button disabled={this.state.busy} type="submit" className="btn btn-primary">Submit
                        </button>
                    </div>
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
    
    private finishSending(response: AxiosResponse<Response>) {
        this.setState({busy: false});
        alert(response);
    }
}

export default Login;