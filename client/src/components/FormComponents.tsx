import {Component, FormEvent} from "react";
import "./FormComponents.css";
import {ISubmittable} from "../models/ISubmittable";

interface IProps {
    name: string;
    target: ISubmittable;
}

class CardForm extends Component<IProps> {
    public constructor(props: IProps) {
        super(props);
        this.submit = this.submit.bind(this);
    }
    
    
    public render() {
        return (
            <div>
                <h3>{this.props.name}</h3>
                <form className={"card-form"} onSubmit={this.submit}>
                    {this.props.children}
                </form>
            </div>
        );
    }
    
    private submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        this.props.target.submit();
    }
}

export {CardForm};