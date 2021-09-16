import {Component} from "react";
import {Navbar, Container, Nav} from "react-bootstrap";

class Header extends Component {
    public render() {
        return (
            <header>
                <Navbar variant="dark" expand="lg" className="mb-3">
                    <Container>
                        <Navbar.Brand className="logo" href="/">CodeSharingNetwork</Navbar.Brand>
                        <Navbar.Toggle aria-controls="header-nav-collapse"/>
                        <Navbar.Collapse>
                            <Nav className="me-auto" id="header-nav-collapse">
                                <Nav.Link href="/">Home</Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </header>
        );
    }
}

export default Header;