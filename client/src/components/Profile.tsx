import React, {Component} from "react";
import "../css/Profile.css";
import AppContext from "./app/AppContext";
import SnippetsFeed from "./code_snippets/SnippetsFeed";
import {generateProfileSnippets} from "./code_snippets/SnippetsGenerators";
import {UserImage} from "./UserImage";
import {Button} from "react-bootstrap";
import {PencilSquare} from "../svg/Icons";
import SimpleLink from "./SimpleLink";
import {IUserInfo} from "./IUserInfo";
import Loading from "./Loading";
import api from "../utils/api";

interface IProps {
    username?: string;
}

interface IState {
    info?: IUserInfo;
    isFollowing?: boolean;
}

export class Profile extends Component<IProps, IState> {
    private componentExists: boolean;
    
    static contextType = AppContext;
    context !: React.ContextType<typeof AppContext>;
    
    constructor(props: any) {
        super(props);
        
        this.getData = this.getData.bind(this);
        this.isOwnProfile = this.isOwnProfile.bind(this);
        this.follow = this.follow.bind(this);
        
        this.state = {}
        this.componentExists = true;
    }
    
    
    public render() {
        let info = this.state.info;
        if (!this.props.username || !info) return <Loading/>;
        
        let username = this.props.username;
        let name = info.name;
        let bio = info.bio;
        let isOwnProfile = this.isOwnProfile();
        
        let infoColElements: JSX.Element;
        
        if (isOwnProfile) {
            infoColElements = (
                <SimpleLink to="/settings">
                    <Button className="btn-icon" variant="secondary">
                        <PencilSquare/>
                    </Button>
                </SimpleLink>
            );
        } else {
            infoColElements = (
                <Button variant="secondary" id="follow" onMouseEnter={() => {
                    if (this.state.isFollowing) document.getElementById("follow")!.innerText = "Unfollow";
                }} onMouseLeave={() => {
                    if (this.state.isFollowing) document.getElementById("follow")!.innerText = "Following";
                }} onClick={this.follow}>
                    {this.state.isFollowing ? "Following" : "Follow"}
                </Button>
            )
        }
        
        return (
            <div className="profile">
                <div className="info-col">
                    <div className="m-3">
                        <UserImage width="100%" username={username} focusable={true}/>
                    </div>
                    <h4>{name}</h4>
                    <h5 className="subtitle">@{username}</h5>
                    <p>{bio ? bio : <i>No bio available</i>}</p>
                    {infoColElements}
                </div>
                <div className="vertical-separator"/>
                <div className="snippets-col">
                    <SnippetsFeed snippetsIdGenerator={generateProfileSnippets(username)}/>
                </div>
            </div>
        )
    }
    
    public componentDidMount() {
        this.getData().then();
    }
    
    public componentWillUnmount() {
        this.componentExists = false;
    }
    
    private async getData() {
        try {
            let userInfoResult = await api.get<IUserInfo>("/users/" + this.props.username + "/info");
            
            if (userInfoResult.status !== 200) {
                console.log(userInfoResult);
                return;
            }
            
            if (!this.isOwnProfile()) {
                let isFollowingResult = await api.post<boolean>("/follow/check", this.props.username);
                
                if (isFollowingResult.status !== 200) {
                    console.log(isFollowingResult);
                    return;
                }
                
                if (!this.componentExists) return;
                this.setState({info: userInfoResult.data, isFollowing: isFollowingResult.data})
            } else {
                if (!this.componentExists) return;
                this.setState({info: userInfoResult.data})
            }
            
        } catch (e) {
            console.log(e);
        }
    }
    
    private isOwnProfile() {
        return this.props.username === this.context.credentials?.username;
    }
    
    private async follow() {
        try {
            if (this.state.isFollowing) {
                await api.post("follow/unfollow", this.props.username);
            } else {
                await api.post("follow", this.props.username);
            }
    
            if (!this.componentExists) return;
            this.setState({isFollowing: !this.state.isFollowing});
        } catch (e) {
            console.log(e);
        }
    }
}