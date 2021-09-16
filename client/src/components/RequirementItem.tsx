import "../css/RequirementItem.css";
import {Component} from "react";
import {CheckCircle, XCircle} from "../svg/Icons";

interface IProps {
    message: string;
    fulfilled: boolean;
}

class RequirementItem extends Component<IProps> {
    public render() {
        if (this.props.fulfilled) {
            return (
                <div className="required-item fulfilled">
                    <CheckCircle/> <span>{this.props.message}</span>
                </div>
            );
        } else {
            return (
                <div className="required-item">
                    <XCircle/> <span>{this.props.message}</span>
                </div>
            )
        }
    }
}

export default RequirementItem;