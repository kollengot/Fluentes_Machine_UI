import React, { Component } from 'react';
import { Button, Card, CardBody, CardGroup, Form, Input, InputGroup } from "reactstrap";
import { isEmail } from "validator";

import { loginMessages } from '../common/Constants';
import AuthService from "../services/auth.service";

class ForgotPassword extends Component {
    constructor() {
        super();
        this.state = {
            Email: '',
            newData: {
                "code": "",
                "password": "",
                "confirmPassword": ""
            },
            errors: {},
            showCode: false
        }
        this.Email = this.Email.bind(this);
    }
    Email(event) {
        this.setState({ Email: event.target.value })
    }

    validateForm() {
        let errors = {};
        let isValid = true;
        if (!this.state.Email) {
            isValid = false;
            errors["error"] = "Please enter your email Address.";
        }
        if (typeof this.state.Email !== "undefined") {
            var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
            if (!pattern.test(this.state.Email)) {
                isValid = false;
                errors["error"] = "Please enter valid email address.";
            }
        }
        this.setState({
            errors: errors
        });
        return isValid;
    }

    handleChange(propertyName, event) {
        var item = this.state.newData;
        item[propertyName] = event.target.value;
        this.setState({ newData: item });
    }

    verifyCode() {
        console.log(this.state.newData);
        AuthService.verifyReset(this.state.newData).then(
            response => {
                console.log(response);
                var errors = {};
                if(response && response.data) {
                    errors["error"] = response.data.message;
                    this.setState({
                        errors: errors
                    });
                }
            },
            error => {
                console.log(error);
            }
        );

    }
    forgotPassword = () => {
        if (this.validateForm()) {
            var data = JSON.stringify({
                "email": this.state.Email
            });
            var errors = {};

            AuthService.forgotPassword(data).then(
                response => {
                    if (response && response.status === 200) {
                        this.setState({
                            showCode: true
                        });
                    }
                    if (response) {
                        errors["resp"] = response.data.message;
                    } else {
                        errors["resp"] = "Someting went Wrong";
                    }
                    /*this.setState({
                        errors: errors
                    });*/

                },
                error => {
                    errors["resp"] = "Someting went Wrong";
                }
            );

        }
    }
    render() {
        return (
            <React.Fragment>

                {this.state.showCode && <div>


                    <CardGroup>
                    <Card className="p-2 profile-form">
                        <CardBody>
                            <Form>
                                <InputGroup className="mb-3">
                                    <span className="input-group-text">Code</span>
                                    <Input autoComplete="off" type="text" defaultValue={this.state.newData.code} placeholder="Enter Verification code" onChange={this.handleChange.bind(this, 'code')} />
                                </InputGroup>

                                <InputGroup className="mb-3">
                                    <span className="input-group-text">Password</span>
                                    <Input autoComplete="off" type="password" defaultValue={this.state.newData.password} placeholder="Enter Password" onChange={this.handleChange.bind(this, 'password')} />
                                </InputGroup>

                                <InputGroup className="mb-3">
                                    <span className="input-group-text">Confirm Password</span>
                                    <Input type="password" defaultValue={this.state.newData.confirmPassword} placeholder="Confirm Password" onChange={this.handleChange.bind(this, 'confirmPassword')} />
                                </InputGroup>

                                <Button color="success" onClick={this.verifyCode.bind(this)} >Verify</Button>

                            </Form>
                        </CardBody>
                    </Card>
                    </CardGroup>



                    
                </div>
                }
                {!this.state.showCode &&
                    <InputGroup className="mb-3">
                        <Input type="text" onChange={this.Email} placeholder="name@example.com" />
                        <Button color="success ml-2" onClick={this.forgotPassword} >Submit</Button>
                    </InputGroup>
                }
                <div className="text-danger mt-4">{this.state.errors.error}</div>
                <div className="text-success mt-4">{this.state.errors.resp}</div>

            </React.Fragment>
        );
    }
}
export default ForgotPassword;