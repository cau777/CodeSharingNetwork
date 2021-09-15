import {Component} from "react";

class Header extends Component {
    public render() {
        return (
            <header>
                <nav className="navbar navbar-expand-sm navbar-toggleable-sm mb-3">
                    <div className="container">
                        <a className="navbar-brand logo" href="/">CodeSharingNetwork</a>
                        <button className="navbar-toggler" type="button" data-toggle="collapse"
                                data-target=".navbar-collapse"
                                aria-controls="navbarSupportedContent"
                                aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"/>
                        </button>
                        <div className="navbar-collapse collapse d-sm-inline-flex justify-content-between">
                            <ul className="navbar-nav flex-grow-1">
                                <li className="nav-item">
                                    <a className="nav-link" href="/">Home</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>
        );
    }
}

export default Header;