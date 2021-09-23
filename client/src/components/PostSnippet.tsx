import {Component} from "react";
import {CardForm} from "./FormComponents";
import {FormController} from "../utils/forms/FormController";
import {Button} from "react-bootstrap";
import {CodeEditor} from "./code_editor/CodeEditor";
import {SupportedLanguages} from "./code_editor/SupportedLanguages";
import {RouteComponentProps, withRouter} from "react-router-dom";

interface IState {
    form: FormController<any>;
    busy: boolean;
}

interface IProps extends RouteComponentProps {

}

class PostSnippet extends Component<IProps, IState> {
    public constructor(props: IProps) {
        super(props);
        
        this.success = this.success.bind(this);
        this.failure = this.failure.bind(this);
        this.startSending = this.startSending.bind(this);
        
        this.state = {
            form: new FormController<any>("snippets", "post", this.success, this.failure, this.startSending),
            busy: false
        }
    }
    
    public render() {
        let form = this.state.form;
        return (
            <CardForm name={"Post Snippet"} target={form}>
                <div className="form-section inline-input">
                    <label className="form-label" htmlFor="title">Title:</label>
                    <input onInput={form.inputChange} type="text" name="title" id="title" required={true}
                           maxLength={9999} className="inline selected-border"/>
                </div>
                <div className="form-section">
                    <label className="form-label" htmlFor="description">Description</label><br/>
                    <textarea className="long-text selected-border" onInput={form.inputChange} name="description"
                              id="description" required={false}/>
                </div>
                
                <div className="form-section">
                    <label className="form-label">Code</label><br/>
                    <CodeEditor onInput={form.inputChange} language={SupportedLanguages.Java}/>
                </div>
                
                <div>
                    <Button disabled={this.state.busy} type="submit">Submit</Button>
                </div>
            </CardForm>
        );
    }
    
    private success() {
        this.props.history.push("/");
    }
    
    private failure() {
        this.setState({busy: false});
    }
    
    private startSending() {
        this.setState({busy: true});
    }
}

export default withRouter(PostSnippet);