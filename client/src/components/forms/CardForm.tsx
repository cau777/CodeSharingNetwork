import {Component, FormEvent} from "react";
import "../../css/FormComponents.css";
import {ISubmittable} from "../../utils/forms/ISubmittable";

interface IProps {
    name: string;
    target: ISubmittable;
}

export class CardForm extends Component<IProps> {
    public constructor(props: IProps) {
        super(props);
        this.submit = this.submit.bind(this);
    }
    
    public render() {
        return (
            <div>
                <h3>{this.props.name}</h3>
                <form acceptCharset="utf8" className="card-form" onSubmit={this.submit}>
                    <div className={"card"}>
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