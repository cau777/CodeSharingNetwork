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
    private static loadingImages = new Map<string, Promise<string | undefined>>();
    
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
        let promise = UserImage.loadingImages.get(username);
        
        if (promise === undefined) {
            promise = UserImage.fetchImage(username);
            UserImage.loadingImages.set(username, promise);
        }
        
        let data = await promise;
        
        // Avoids error: Can't perform a React state update on an unmounted component
        if (!this.componentExists || data === undefined) return;
        
        this.setState({src: data})
    }
    
    private static async fetchImage(username: string) {
        try {
            let response = await api.get<string>("/users/" + username + "/image");
            
            if (response.status === 200) return response.data;
            console.log(response);
        } catch (e) {
            console.log(e)
        }
    }
}