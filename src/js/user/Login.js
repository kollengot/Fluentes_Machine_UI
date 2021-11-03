import React, { Component } from "react";
import { Button, Card, CardBody, CardGroup, Col, Form, Input, InputGroup, Row } from "reactstrap";
import { isEmail } from "validator";
import {loginMessages} from '../common/Constants';
import MyAlert from "../components/MyAlert";
import Popup from "../components/Popup";
import AuthService from "../services/auth.service";

class Login extends Component {

    constructor() {
        super();
        this.state = {
            Email: '',
            Password: '',
            showAlert: false,
            alertConfig: {
                "variant": "danger"
            },
            popupConfig: {},
            isPopupOpen: false,
            checkboxChecked: false
        }
        this.Password = this.Password.bind(this);
        this.Email = this.Email.bind(this);
        this.loginValidation = this.loginValidation.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    Email(event) {
        this.setState({ Email: event.target.value })
    }
    Password(event) {
        this.setState({ Password: event.target.value })
    }
    showAlertMessage(msg) {
        this.setState(prevState => ({
            alertConfig: { 
                ...prevState.alertConfig,
                message: msg
            },
            showAlert: true 
        }))
    }
    loginValidation(event) {
        if(this.state.Email === '' || this.state.Password === '') {
            this.showAlertMessage(loginMessages.REQUIRED);
        } else if (!isEmail(this.state.Email)) {
            this.showAlertMessage(loginMessages.EMAILERROR);
         } else {
            this.handleLogin(event);
         }
    }
    handleLogin(event) {
        var data = JSON.stringify({
            "email": this.state.Email,
            "password": this.state.Password
        });
        if(this.state.checkboxChecked) {
            AuthService.loginWorker(data).then(
                
                response => {
                    if (response && response.data) {
                        this.props.history.push("/WorkerDashboard");
                    } else {
                        this.showAlertMessage(loginMessages.ERROR);
                    }
                },
                error => {
                    this.showAlertMessage(loginMessages.ERROR);
                }
            );

        } else {
            AuthService.login(data).then(
                response => {
                    if (response && response.data) {

                        if(response.data.admin){
                            this.props.history.push("/AdminDashboard");
                        }  else {
                            this.props.history.push("/Dashboard");
                        }

                        /*if(response.data.userId === usersTag.USER_TAG) {
                            this.props.history.push("/Dashboard");
                        } else if(response.data.admin === usersTag.ADMIN_TAG){
                            this.props.history.push("/AdminDashboard");
                        } */

                    } else {
                        this.showAlertMessage(loginMessages.ERROR);
                    }
                },
                error => {
                    this.showAlertMessage(loginMessages.ERROR);
                }
            );
        }
    }

    forgotPassword  = () =>  {
        this.setState({
            isPopupOpen: true,
            popupConfig : {
                header: "Forgot Password",
                body: "",
                type: "forgotPassword"
            }
        });
    }

    handleClose = () => {
        this.setState({
            isPopupOpen: false
        });
    };

    handleChange(evt) {
        this.setState({ checkboxChecked: evt.target.checked });
    }


    render() {
        return (
           <Row className="justify-content-center login-div">
                <Col md="9" lg="7" xl="6">
                    <CardGroup>
                        <Card className="p-2">
                            <CardBody>
                                <Form>
                                    <InputGroup className="mb-3">
                                        <Input type="text" onChange={this.Email} placeholder="Enter Email" />
                                    </InputGroup>
                                    <InputGroup className="mb-4">
                                        <Input type="password" onChange={this.Password} placeholder="Enter Password" />
                                    </InputGroup>
                                    <input type="checkbox" onChange={this.handleChange.bind(this)}></input> Login as worker
                                    <p className="forgot-password text-right">Forgot <span role="button" className="text-primary" onClick = {this.forgotPassword} >password?</span></p>                                   
                                    <Button color="success" onClick={this.loginValidation} >Login</Button>
                                </Form>
                                {this.state.showAlert && < MyAlert alertConfig = {this.state.alertConfig} /> }
                            </CardBody>
                        </Card>
                    </CardGroup>
                </Col>
                <Popup popupConfig = {this.state.popupConfig} openFlag = {this.state.isPopupOpen} parentCloseCallback={this.handleClose.bind(this)} ></Popup>
            </Row>
            
        );
    }
}
export default Login;