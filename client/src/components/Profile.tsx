import {Component, ContextType} from "react";
import "../css/Profile.css";
import AppContext from "./app/AppContext";
import SnippetsFeed from "./code_snippets/SnippetsFeed";
import {generateProfileSnippets} from "./code_snippets/SnippetsGenerators";
import {UserImage} from "./UserImage";
import {Button} from "react-bootstrap";
import {PencilSquare} from "../svg/Icons";
import SimpleLink from "./SimpleLink";

export class Profile extends Component<any, any> {
    static contextType = AppContext;
    context!: ContextType<typeof AppContext>;
    
    public render() {
        let userInfo = this.context.userInfo;
        if (userInfo === undefined) return <div/>;
        
        let username = userInfo.username;
        let bio = userInfo.bio;
        
        return (
            <div className="profile">
                <div className="info-col">
                    <div className="m-3">
                        <UserImage width="100%" username={username}/>
                    </div>
                    <h4>{username}</h4>
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
}