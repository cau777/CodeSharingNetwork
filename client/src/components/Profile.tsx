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
}

export class Profile extends Component<IProps, IState> {
    static contextType = AppContext;
    context !: React.ContextType<typeof AppContext>;
    
    constructor(props: any) {
        super(props);
        
        this.state = {}
    }
    
    
    public render() {
        let info = this.state.info;
        if (!this.props.username || !info) return <Loading/>;
        
        let username = this.props.username;
        let name = info.name;
        let bio = info.bio;
        let isOwnProfile = username === this.context.credentials?.username;
        
        let infoColElements: JSX.Element = <span/>;
        
        if (isOwnProfile) {
            infoColElements = (
                <SimpleLink to="/settings">
                    <Button className="btn-icon" variant="secondary">
                        <PencilSquare/>
                    </Button>
                </SimpleLink>
            );
        }
        
        return (
            <div className="profile">
                <div className="info-col">
                    <div className="m-3">
                        <UserImage width="100%" username={username} focusable={true}/>
                    </div>
                    <h4>{name}</h4>
                    <h5 className="subtitle">@{username}</h5>
                    <p>{bio ? bio : "No bio available"}</p>
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
        api.get<IUserInfo>("/users/" + this.props.username + "/info").then(r => this.setState({info: r.data}));
    }
}