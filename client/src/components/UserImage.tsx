import {Component, CSSProperties} from "react";
import api from "../utils/api";
import {ImageModal} from "./ImageModal";

interface IProps {
    focusable?: boolean;
    username?: string;
    width?: string;
    height?: string;
    onclick?: () => void;
}

interface IState {
    show: boolean;
    src: string;
}

export class UserImage extends Component<IProps, IState> {
    private static preloadedImages = new Map<string, string>();
    private componentExists: boolean;
    
    public constructor(props: IProps) {
        super(props);
        
        this.updateImage = this.updateImage.bind(this);
        
        this.state = {
            show: false,
            src: ""
        };
        this.componentExists = true;
    }
    
    
    public render() {
        if (this.props.username === undefined) return;
        
        let style: CSSProperties = {
            width: this.props.width,
            height: this.props.height
        };
        
        let content: JSX.Element | undefined = undefined;
        
        if (this.props.focusable) {
            content =
                <ImageModal image={this.state.src} show={this.state.show} onHide={() => this.setState({show: false})}/>;
            style.cursor = "pointer";
        }
        
        return (
            <span>
                {content}
                <img style={style} src={this.state.src} className="round-img"
                     alt={this.props.username} onClick={() => this.setState({show: true})}/>
            </span>
        );
    }
    
    public componentDidMount() {
        this.updateImage(this.props.username!).then();
    }
    
    public componentWillUnmount() {
        this.componentExists = false;
    }
    
    private async updateImage(username: string) {
        // let target = document.getElementById(this.props.id) as HTMLImageElement;
        let data = UserImage.preloadedImages.get(username);
        
        if (data === undefined) {
            let response = await api.get<string>("/users/" + username + "/image");
            
            if (response.status === 200) {
                data = response.data;
                UserImage.preloadedImages.set(username, data);
            } else {
                console.log(response);
                return;
            }
        }
        
        if (!this.componentExists) return; // Avoids error: Can't perform a React state update on an unmounted component
        this.setState({src: data})
    }
}