import "../css/Header.css";
import {Component} from "react";
import {Navbar, Container, Nav, Dropdown, Button} from "react-bootstrap";
import default_user from "../img/default_user.png";
import Link from "./Link";
import SimpleLink from "./SimpleLink";
import {Authenticated} from "./auth/Authenticated";
import {NotAuthenticated} from "./auth/NotAuthenticated";

interface IProps {

}

class Header extends Component<IProps> {
    public render() {
        return (
            <header>
                <Navbar variant="dark" expand="lg" className="mb-3">
                    <Container>
                        <Navbar.Brand className="logo" href="/">CodeSharingNetwork</Navbar.Brand>
                        <Navbar.Toggle aria-controls="header-nav-collapse"/>
                        <Navbar.Collapse>
                            <Nav id="header-nav-collapse">
                                <SimpleLink to="/"><Nav.Link>Home</Nav.Link></SimpleLink>
                                <SimpleLink to="/post"><Nav.Link>Post Snippet</Nav.Link></SimpleLink>
                            </Nav>
                            <Nav className="ms-auto" id="header-nav-collapse">
                                <Authenticated>
                                    <Dropdown>
                                        <Dropdown.Toggle className="simple-dropdown-toggle">
                                            <img id="user-img" src={default_user} alt="user"/>
                                        </Dropdown.Toggle>
                                        
                                        <Dropdown.Menu variant="dark">
                                            <SimpleLink to="/profile">
                                                <Dropdown.Item>
                                                    Profile
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
                                    <SimpleLink to={"/login"}><Nav.Link>Log in</Nav.Link></SimpleLink>
                                    <SimpleLink to={"/register"}><Nav.Link>Register</Nav.Link></SimpleLink>
                                </NotAuthenticated>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </header>
        );
    }
}

export default Header;