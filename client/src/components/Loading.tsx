import {Component} from "react";
import {LoadingIcon} from "../svg/AnimatedIcons";

class Loading extends Component {
    public render() {
        return (
            <div className="d-flex justify-content-center">
                <LoadingIcon/>
            </div>
        );
    }
}

export default Loading;