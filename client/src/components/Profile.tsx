import {Component, ContextType} from "react";
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

interface IState {
    info?: IUserInfo;
}

export class Profile extends Component<any, IState> {
    static contextType = AppContext;
    context!: ContextType<typeof AppContext>;
    
    constructor(props: any) {
        super(props);
        
        this.state = {}
    }
    
    
    public render() {
        let credentials = this.context.credentials;
        let info = this.state.info;
        if (credentials === undefined || info === undefined) return <Loading/>;
        
        let username = credentials.username;
        let name = info.name;
        let bio = info.bio;
        
        return (
            <div className="profile">
                <div className="info-col">
                    <div className="m-3">
                        <UserImage width="100%" username={username}/>
                    </div>
                    <h4>{name}</h4>
                    <h5 className="subtitle">@{username}</h5>
                    <p>{bio}</p>
                    <SimpleLink to="/settings">
                        <Button className="btn-icon" variant="secondary">
                            <PencilSquare/>
                        </Button>
                    </SimpleLink>
                </div>
                <div className="vertical-separator"/>
                <div className="snippets-col">
                    <SnippetsFeed snippetsIdGenerator={generateProfileSnippets(username)}/>
                </div>
            </div>
        )
    }
    
    public componentDidMount() {
        api.get<IUserInfo>("/profile/info").then(r => this.setState({info: r.data}));
    }
}