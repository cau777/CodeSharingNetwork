import {Component, FormEvent} from "react";
import {CardForm} from "./CardForm";
import {FormBodyController} from "../../utils/forms/FormBodyController";
import {Button} from "react-bootstrap";
import {CodeEditor} from "../code_editor/CodeEditor";
import {RouteComponentProps, withRouter} from "react-router-dom";
import {Languages} from "../code_editor/languages/Languages";

interface IState {
    busy: boolean;
    language: string;
}

interface IProps extends RouteComponentProps {

}

class PostSnippet extends Component<IProps, IState> {
    private readonly form: FormBodyController<any>;
    
    public constructor(props: IProps) {
        super(props);
        
        this.success = this.success.bind(this);
        this.failure = this.failure.bind(this);
        this.startSending = this.startSending.bind(this);
        this.changeLanguage = this.changeLanguage.bind(this);
        
        this.form = new FormBodyController<any>("snippets", "post", this.success, this.failure, this.startSending);
        this.state = {
            busy: false,
            language: "None"
        }
    }
    
    public render() {
        let form = this.form;
        return (
            <div className="fill-area-form">
                <CardForm name={"Post Snippet"} target={form}>
                    <div className="form-section inline-input">
                        <label className="form-label" htmlFor="title">Title</label>
                        <input onInput={form.inputChange} type="text" name="title" id="title" required={true}
                               maxLength={100} className="inline selected-border"/>
                    </div>
                    <div className="form-section">
                        <label className="form-label" htmlFor="description">Description</label><br/>
                        <textarea className="long-text selected-border" onInput={form.inputChange} name="description"
                                  id="description" required={false} maxLength={400}/>
                    </div>
                    
                    <div className="form-section inline-input">
                        <label className="form-label" htmlFor="language">Language</label>
                        <select className={"selected-border"} id="language" name="language" onInput={this.changeLanguage}>
                            {Languages.languageNames.map(o => <option value={o} key={o}>{o}</option>)}
                        </select>
                    </div>
                    
                    <div className="form-section">
                        <label className="form-label">Code</label><br/>
                        <CodeEditor onInput={form.inputChange} language={Languages.findLanguage(this.state.language)}/>
                    </div>
                    
                    <div>
                        <Button disabled={this.state.busy} type="submit">Submit</Button>
                    </div>
                </CardForm>
            </div>
        );
    }
    
    public componentDidMount() {
        this.form.inputChange({currentTarget: document.getElementById("language") as HTMLSelectElement});
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
    
    private changeLanguage(e: FormEvent<HTMLSelectElement>) {
        this.setState({language: e.currentTarget.value});
        this.form.inputChange(e);
    }
}

export default withRouter(PostSnippet);