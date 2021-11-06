import "../css/UsersList.css";
import {Component} from "react";
import Loading from "./Loading";
import {UserImage} from "./UserImage";
import SimpleLink from "./SimpleLink";
import api from "../utils/api";

interface IProps {
    query: string;
}

interface IState {
    users?: ISearchResponse[];
}

interface ISearchResponse {
    name: string;
    username: string;
}

export class UsersSearchList extends Component<IProps, IState> {
    private componentExists: boolean;
    
    public constructor(props: IProps) {
        super(props);
        
        this.fetch = this.fetch.bind(this);
        
        this.state = {};
        
        this.componentExists = true;
    }
    
    public render() {
        if (this.state.users === undefined) return <Loading/>;
        
        if (this.state.users.length === 0) return <div/>;
        
        let content: JSX.Element[] = [];
        let index = 0;
        for (let user of this.state.users) {
            content.push(
                <SimpleLink key={index++} to={"/user/" + user.username}>
                    <div className="user-item">
                        <UserImage width="50px" username={user.username}/>
                        <div className="user-info">
                            <h5>{user.name}</h5>
                            <h6>@{user.username}</h6>
                        </div>
                    </div>
                </SimpleLink>
            );
        }
        
        return <div className="user-list">
            {content}
        </div>
    }
    
    public componentDidMount() {
        this.fetch().then();
    }
    
    public componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, snapshot?: any) {
        if (prevProps.query !== this.props.query)
            this.fetch().then();
    }
    
    public componentWillUnmount() {
        this.componentExists = false;
    }
    
    private async fetch() {
        try {
            let response = await api.get<ISearchResponse[]>("/users/search", {params: {q: this.props.query}});
            
            if (response.status !== 200) {
                console.log(response);
                return;
            }
            
            if (!this.componentExists) return;
            this.setState({users: response.data});
        } catch (e) {
            console.log(e);
        }
    }
}