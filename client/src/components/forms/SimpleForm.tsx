import {Component, FormEvent} from "react";
import "../../css/FormComponents.css";
import {ISubmittable} from "../../utils/forms/ISubmittable";

interface IProps {
    name: string;
    target: ISubmittable;
}

export class SimpleForm extends Component<IProps> {
    public constructor(props: IProps) {
        super(props);
        this.submit = this.submit.bind(this);
    }
    
    public render() {
        return (
            <div className="simple-form">
                <h3>{this.props.name}</h3>
                <form acceptCharset="utf8" onSubmit={this.submit}>
                    <div className="wrapper">
                        {this.props.children}
                    </div>
                </form>
            </div>
        );
    }
    
    private submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        this.props.target.submit();
    }
}