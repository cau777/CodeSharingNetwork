import {Component} from "react";
import {CardForm} from "./FormComponents";
import {FormController} from "../utils/forms/FormController";
import {Button} from "react-bootstrap";
import {CodeEditor} from "./CodeEditor/CodeEditor";
import {SupportedLanguages} from "./CodeEditor/SupportedLanguages";

interface IState {
    form: FormController<any>;
    busy: boolean;
}

interface IProps {

}

class PostSnippet extends Component<IProps, IState> {
    public constructor(props: IProps) {
        super(props);
        this.state = {
            form: new FormController<any>("snippets", "post"),
            busy: false
        }
    }
    
    public render() {
        let form = this.state.form;
        return (
            <CardForm name={"Post Snippet"} target={this.state.form}>
                <div className="form-section inline-input">
                    <label className="form-label" htmlFor="title">Title:</label>
                    <input onInput={form.inputChange} type="text" name="title" id="title" required={true}
                           maxLength={9999} className="inline selected-border"/>
                </div>
                <div className="form-section">
                    <label className="form-label" htmlFor="description">Description</label><br/>
                    <textarea className="long-text selected-border" onInput={form.inputChange} name="description" id="description" required={true}/>
                </div>
                
                <div className="form-section">
                    <label className="form-label">Code</label><br/>
                    <CodeEditor language={SupportedLanguages.Java}/>
                </div>
                
                <div>
                    <Button disabled={this.state.busy} type="submit">Submit</Button>
                </div>
            </CardForm>
        );
    }
}

export default PostSnippet;