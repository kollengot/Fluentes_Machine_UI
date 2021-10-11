import React, { Component } from 'react';

import Dropdown from 'react-bootstrap/Dropdown';
import { Button, ButtonGroup } from 'reactstrap';
import LogoImage from '../../images/Logo.png';
import Popup from "../components/Popup";
import {usersTag}  from "../common/Constants";

class Header extends Component {
    state = {
        popupConfig: {},
        isPopupOpen: false,
        user: JSON.parse(localStorage.getItem('user'))   
    }
    handleClose = (list) => {
        this.setState({
            isPopupOpen: false,
            user: JSON.parse(localStorage.getItem('user'))
        });
    }
    logOut() {
        localStorage.removeItem("user");
    }
    showProfile() {
        this.setState({
            isPopupOpen: true,
            popupConfig: {
                header: "Manage Profile",
                body: "",
                type: "profile"
            }
        });
    }
    render() {
        return (
            <React.Fragment>
                <div className="page-header sticky-top">
                    <img className="logo-header" alt="Logo" src={LogoImage} />
                    <div className="float-right">

                        <Dropdown as={ButtonGroup}>
                            <Button >{this.state.user.userName}</Button>
                            <Dropdown.Toggle split variant="info" id="dropdown-split-basic"/>
                            <Dropdown.Menu>
                            {this.state.user.userId === usersTag.WORKER_TAG && <Dropdown.Item onClick={() => this.showProfile()}>Profile</Dropdown.Item>}
                            {this.state.user.userId === usersTag.USER_TAG && <Dropdown.Item onClick={() => this.showProfile()}>Profile</Dropdown.Item>}   
                                <Dropdown.Item href="/" onClick={() => this.logOut()}>Logout</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>
                <Popup popupConfig={this.state.popupConfig} openFlag={this.state.isPopupOpen} parentCloseCallback={this.handleClose}></Popup>
            </React.Fragment>
        );
    }
}
export default Header;