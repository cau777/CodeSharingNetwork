import React, {Component, ContextType,} from "react";
import {SimpleForm} from "../forms/SimpleForm";
import {UserImage} from "../UserImage";
import {Alert, Button, Modal} from "react-bootstrap";
import AppContext from "../app/AppContext";
import {CircleMask, Square} from "../../svg/Icons";
import {clamp} from "../../utils/MathUtils";
import {FormMultipartController} from "../../utils/forms/FormMultipartController";

interface IState {
    selectedFile?: string;
    failedMessage?: string;
}

export class ProfilePictureSettings extends Component<any, IState> {
    private readonly imageFormController: FormMultipartController<any>;
    private fileInput!: HTMLInputElement;
    private loadedImage!: HTMLImageElement;
    
    private prevDragX?: number;
    private prevDragY?: number;
    
    static contextType = AppContext;
    context!: ContextType<typeof AppContext>;
    
    public constructor(props: any) {
        super(props);
        this.fileSelected = this.fileSelected.bind(this);
        this.clearSelected = this.clearSelected.bind(this);
        this.prepareImage = this.prepareImage.bind(this);
        this.zoom = this.zoom.bind(this);
        this.mouseDown = this.mouseDown.bind(this);
        this.dragImage = this.dragImage.bind(this);
        this.moveAndClamp = this.moveAndClamp.bind(this);
        this.finish = this.finish.bind(this);
        this.state = {};
        this.imageFormController = new FormMultipartController<any>("/profile/image", "post", undefined, () => {
            alert("Successfully updated image");
            window.location.reload();
        }, () => {
            this.setState({failedMessage: "Failed to update image"});
        });
    }
    
    public render() {
        return (
            <div className="profile-picture-settings">
                <Alert variant="danger" hidden={this.state.failedMessage === undefined}>
                    {this.state.failedMessage}
                </Alert>
                <SimpleForm name="Image" target={this.imageFormController}>
                    <div className="form-section">
                        <UserImage height="20vmin" width="20vmin" username={this.context.credentials?.username}/>
                    </div>
                    
                    <Modal className="loaded-image-modal" show={this.state.selectedFile !== undefined}
                           onHide={this.clearSelected}>
                        <Modal.Header>
                            <h4>Crop and Resize</h4>
                        </Modal.Header>
                        <Modal.Body>
                            <div id="image-mask" className="image-mask">
                                <span className="square-placeholder">
                                    <Square/>
                                </span>
                                <span className="circle-mask" onMouseDown={this.mouseDown}>
                                    <CircleMask/>
                                </span>
                                <img id="loaded-image" className="loaded-image" src={this.state.selectedFile}
                                     alt="selected file" onLoad={this.prepareImage} style={{top: 0, left: 0}}/>
                            </div>
                            <input type="range" id="image-scale" min={100} max={300} onInput={this.zoom} name="scale"/>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" type="button" onClick={this.finish}>Confirm</Button>
                            <Button variant="primary" type="button" onClick={this.clearSelected}>
                                Cancel
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    
                    <div>
                        <label className="btn btn-primary label-file-input">
                            <input type="file" name="file" accept=".bmp, .png, .jpg, .tiff, .gif"
                                   id="fileInput" onInput={this.fileSelected}/>
                            Choose Image
                        </label>
                    </div>
                </SimpleForm>
                <hr/>
            </div>
        );
    }
    
    public componentDidMount() {
        this.fileInput = document.getElementById("fileInput") as HTMLInputElement;
    }
    
    private fileSelected(e: React.FormEvent<HTMLInputElement>) {
        let target = e.currentTarget;
        let file = target.files?.[0];
        
        if (!file) return;
        if (file.size > 5_000_000) {
            this.setState({failedMessage: "Image can't be larger than 5MB"});
            return;
        }
        
        let path = URL.createObjectURL(file);
        
        this.setState({selectedFile: path})
        this.imageFormController.inputChange({currentTarget: {name: e.currentTarget.name, value: file}});
    }
    
    private clearSelected() {
        this.setState({selectedFile: undefined});
        this.fileInput.value = "";
    }
    
    private prepareImage() {
        this.loadedImage = document.getElementById("loaded-image") as HTMLImageElement;
    }
    
    private zoom(e: React.FormEvent<HTMLInputElement>) {
        this.loadedImage.style.height = e.currentTarget.valueAsNumber + "%";
        this.moveAndClamp(0, 0);
        this.imageFormController.inputChange(e);
    }
    
    private mouseDown(e: React.MouseEvent) {
        document.addEventListener("mousemove", this.dragImage)
        document.addEventListener("mouseup", () => {
            document.removeEventListener("mousemove", this.dragImage);
            this.prevDragX = undefined;
            this.prevDragY = undefined;
        });
    }
    
    private dragImage(e: MouseEvent) {
        if (this.prevDragX !== undefined && this.prevDragY !== undefined) {
            this.moveAndClamp(e.screenX - this.prevDragX, e.screenY - this.prevDragY);
        }
        
        this.prevDragX = e.screenX;
        this.prevDragY = e.screenY;
    }
    
    private moveAndClamp(xMove: number, yMove: number) {
        let mask = document.getElementById("image-mask") as HTMLDivElement;
        
        let prevLeft = Number.parseInt(this.loadedImage.style.left.replaceAll("px", ""));
        let prevTop = Number.parseInt(this.loadedImage.style.top.replaceAll("px", ""));
        
        this.loadedImage.style.left = clamp(prevLeft + xMove, mask.clientWidth - this.loadedImage.clientWidth, 0) + "px";
        this.loadedImage.style.top = clamp(prevTop + yMove, mask.clientHeight - this.loadedImage.clientHeight, 0) + "px";
    }
    
    private finish() {
        let mask = document.getElementById("image-mask") as HTMLDivElement;
        let left = -Number.parseInt(this.loadedImage.style.left.replaceAll("px", ""));
        let top = -Number.parseInt(this.loadedImage.style.top.replaceAll("px", ""));
        
        this.imageFormController.inputChange({currentTarget: document.getElementById("image-scale") as HTMLInputElement});
        this.imageFormController.inputChange({currentTarget: {name: "top", value: top / mask.clientHeight}});
        this.imageFormController.inputChange({currentTarget: {name: "left", value: left / mask.clientHeight}});
        
        this.imageFormController.submit();
        this.clearSelected();
    }
}