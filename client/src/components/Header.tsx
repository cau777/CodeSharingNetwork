import {Component} from "react";
import {Navbar, Container, Nav} from "react-bootstrap";
import {RouteComponentProps, withRouter} from "react-router-dom";

interface IProps extends RouteComponentProps {

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
                            <Nav className="me-auto" id="header-nav-collapse">
                                <Nav.Link onClick={() => this.props.history.push("/")}>Home</Nav.Link>
                                <Nav.Link onClick={() => this.props.history.push("/post")}>Post snippet</Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </header>
        );
    }
}

export default withRouter(Header);