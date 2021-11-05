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

class Header extends Component<IProps> {
    static contextType = AppContext;
    context !: React.ContextType<typeof AppContext>;
    
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
                                               onKeyDown={e => {
                                                   let value = e.currentTarget.value;
                                                   if (e.key === "Enter" && value !== "") {
                                                       this.props.history.push("/search?q=" + value);
                                                       this.props.onSearchChanged(value);
                                                       e.preventDefault();
                                                   }
                                               }}/>
                                        <span className="floating-x"
                                              onClick={() => (document.getElementById("search") as HTMLInputElement).value = ""}><XSymbol/></span>
                                    </span>
                                </Authenticated>
                            </Nav>
                            <Nav className="ms-auto" id="header-nav-collapse">
                                <Authenticated>
                                    <Dropdown>
                                        <Dropdown.Toggle className="simple-dropdown-toggle">
                                            <UserImage username={credentials?.username} width="32px"/>
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
}

export default withRouter(Header);