import "../css/Header.css";
import React, {Component} from "react";
import {Navbar, Container, Nav, Dropdown} from "react-bootstrap";
import SimpleLink from "./SimpleLink";
import {Authenticated} from "./auth/Authenticated";
import {NotAuthenticated} from "./auth/NotAuthenticated";
import AppContext from "./app/AppContext";
import {UserImage} from "./UserImage";
import {XSymbol} from "../svg/Icons";
import {RouteComponentProps, withRouter} from "react-router-dom";
import Logo from "../img/logo_border.png"

interface IProps extends RouteComponentProps {
    onSearchChanged: (s: string) => void;
}

interface IState {
    query?: string;
}

class Header extends Component<IProps, IState> {
    static contextType = AppContext;
    context !: React.ContextType<typeof AppContext>;
    
    constructor(props: IProps) {
        super(props);
        
        this.searchInput = this.searchInput.bind(this);
        this.searchKeyDown = this.searchKeyDown.bind(this);
        this.clearSearch = this.clearSearch.bind(this);
        
        this.state = {};
    }
    
    
    public render() {
        let credentials = this.context.credentials;
        
        return (
            <header>
                <Navbar variant="dark" expand="lg" className="mb-3">
                    <Container>
                        <SimpleLink to="/">
                            <img className="logo" src={Logo} alt="logo"/>
                        </SimpleLink>
                        <Navbar.Toggle aria-controls="header-nav-collapse"/>
                        <Navbar.Collapse>
                            <Nav id="header-nav-collapse">
                                <SimpleLink to="/"><Nav.Link>Home</Nav.Link></SimpleLink>
                                    <SimpleLink to="/post"><Nav.Link>Post Snippet</Nav.Link></SimpleLink>
                                <Authenticated>
                                    <span className="search-wrapper flex-center">
                                        <input className="my-auto" type="text" placeholder="Search" id="search"
                                               onKeyDown={this.searchKeyDown} onInput={this.searchInput}/>
                                        
                                        <span className="floating-x" hidden={!this.state.query}
                                              onClick={this.clearSearch}>
                                            <XSymbol/>
                                        </span>
                                    </span>
                                </Authenticated>
                            </Nav>
                            <Nav className="ms-auto" id="header-nav-collapse">
                                <Authenticated>
                                    <Dropdown className="mt-2">
                                        <Dropdown.Toggle className="simple-dropdown-toggle">
                                            <UserImage username={credentials?.username} width="40px"/>
                                        </Dropdown.Toggle>
                                        
                                        <Dropdown.Menu variant="dark">
                                            <Dropdown.ItemText>
                                                {credentials?.username}
                                            </Dropdown.ItemText>
                                            
                                            <Dropdown.Divider/>
                                            
                                            <SimpleLink to="/profile">
                                                <Dropdown.Item>
                                                    Profile
                                                </Dropdown.Item>
                                            </SimpleLink>
                                            
                                            <SimpleLink to="/settings">
                                                <Dropdown.Item>
                                                    Settings
                                                </Dropdown.Item>
                                            </SimpleLink>
                                            
                                            <SimpleLink to="/logout">
                                                <Dropdown.Item>
                                                    Log out
                                                </Dropdown.Item>
                                            </SimpleLink>
                                        </Dropdown.Menu>
                                    
                                    </Dropdown>
                                </Authenticated>
                                <NotAuthenticated>
                                    <SimpleLink to="/login"><Nav.Link>Log in</Nav.Link></SimpleLink>
                                    <SimpleLink to="/register"><Nav.Link>Register</Nav.Link></SimpleLink>
                                </NotAuthenticated>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </header>
        );
    }
    
    private searchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        let value = e.currentTarget.value;
        this.setState({query: value});
        
        if (e.key === "Enter" && value !== "") {
            this.props.history.push("/search?q=" + value);
            this.props.onSearchChanged(value);
            e.preventDefault();
        }
    }
    
    private searchInput(e: React.FormEvent<HTMLInputElement>) {
        this.setState({query: e.currentTarget.value});
    }
    
    private clearSearch() {
        (document.getElementById("search") as HTMLInputElement).value = "";
        this.setState({query: ""});
    }
}

export default withRouter(Header);