import {Component} from "react";
import {Modal} from "react-bootstrap";

interface IProps {
    image: string;
    show: boolean;
    onHide: () => void;
}

export class ImageModal extends Component<IProps, any> {
    public render() {
        return (
            <Modal show={this.props.show} size="sm" centered={true} onHide={this.props.onHide}>
                <Modal.Body>
                    <img className="h-100 w-100" src={this.props.image} alt="modal"/>
                </Modal.Body>
            </Modal>
        );
    }
}