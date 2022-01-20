import React, { Component } from 'react';
import { Button, Card, CardBody, CardGroup, Form, Input, InputGroup } from "reactstrap";
import userService from "../services/user.service";
import workerService from '../services/worker.service';
import {usersTag}  from "../common/Constants";


class Profile extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            item:{},
            userId: JSON.parse(localStorage.getItem('user')).userId,
            respMsg: ''
        }
    }
    componentDidMount() {
         this.getUserData();
    }
    getUserData() {
        if(this.state.userId === usersTag.USER_TAG) {
            userService.getSingleCustomer().then(
                response => {
                    this.setState({
                        item: response.data
                      });
                },
                error => {
                    console.log("Error");
                }
            );
        } else if(this.state.userId === usersTag.WORKER_TAG) {
            workerService.getWorkerProfile().then(
                response => {
                    this.setState({
                        item: response.data
                      });
                },
                error => {
                    console.log("Error");
                }
            );
        }
    }

    handleChange(propertyName, event) {
        var item = this.state.item;
        item[propertyName] = event.target.value;
        this.setState({ item: item });
    }
    saveProfile() {
        if(this.state.userId === usersTag.USER_TAG) {
            let data = {
                "name": this.state.item.name,
                "email": this.state.item.email,
                "phone": this.state.item.phone,
                "address": this.state.item.address
            };
            userService.updateUserProfile(data).then(
                response => {
                    //localStorage.setItem("user", JSON.stringify(response.data.data));
                    var tmpUser = JSON.parse(localStorage.getItem('user'));
                    tmpUser.userName = response.data.data.name;
                    localStorage.setItem("user", JSON.stringify(tmpUser));
                    
                    this.setState({
                        respMsg: response.data.message
                      });
                },
                error => {
                    this.setState({
                        respMsg: "Something went wrong"
                      });
                }
            );

        } else if(this.state.userId === usersTag.WORKER_TAG) {
            let data = {   
                "name": this.state.item.name,
                "phone": this.state.item.phone,
                "address": this.state.item.address,
                "avail_per_day": this.state.item.avail_per_day,
                "cost_per_hr": this.state.item.cost_per_hr,
                "total_avail_per_week": 11,
                "professionId":this.state.item.professionId
            }
            workerService.updateWorkerProfile(data).then(
                response => {
                    this.setState({
                        respMsg: response.data.message
                      });
                },
                error => {
                    this.setState({
                        respMsg: "Something went wrong"
                      });
                }
            );
        }
    }
    render() {
        return (
            <React.Fragment>

                <CardGroup>
                    <Card className="p-2 profile-form">
                        <CardBody>
                            <Form>
                                <InputGroup className="mb-3">
                                    <span className="input-group-text">Name</span>
                                    <Input type="text" placeholder="Enter Name" defaultValue={this.state.item.name} onChange={this.handleChange.bind(this, 'name')} />
                                </InputGroup>
                                <InputGroup className="mb-3">
                                    <span className="input-group-text">Phone Number</span>
                                    <Input type="text" placeholder="Enter Phone Number" defaultValue={this.state.item.phone} onChange={this.handleChange.bind(this, 'phone')}/>
                                </InputGroup>
                                <InputGroup className="mb-3">
                                    <span className="input-group-text">Address</span>
                                    <Input type="text" placeholder="Enter Address" defaultValue={this.state.item.address} onChange={this.handleChange.bind(this, 'address')}/>
                                </InputGroup>
                                <InputGroup className="mb-3">
                                    <span className="input-group-text">Email</span>
                                    <Input type="text" placeholder="Enter Email" readOnly = {true} defaultValue={this.state.item.email} onChange={this.handleChange.bind(this, 'email')}/>
                                </InputGroup>

{(this.state.userId === usersTag.WORKER_TAG) && <div>
                                <InputGroup className="mb-3">
                                    <span className="input-group-text">Availability per day</span>
                                    <Input type="text" placeholder="Availability per day" defaultValue={this.state.item.avail_per_day} onChange={this.handleChange.bind(this, 'avail_per_day')}/>
                                </InputGroup>
                                <InputGroup className="mb-3">
                                    <span className="input-group-text">Cost per hour</span>
                                    <Input type="text" placeholder="Cost per hour" defaultValue={this.state.item.cost_per_hr} onChange={this.handleChange.bind(this, 'cost_per_hr')}/>
                                </InputGroup>
                                <InputGroup className="mb-3">
                                    <span className="input-group-text">Profession</span>
                                    <Input type="text" placeholder="Profession" defaultValue={this.state.item.ProfessionId} onChange={this.handleChange.bind(this, 'professionId')}/>
                                </InputGroup>
</div>
}
                                


                                <InputGroup className="mb-3 justify-content-center">
                                    <Button color="success"  onClick={() => this.saveProfile()}>Save</Button> 
                                </InputGroup>
                                <div className="text-success">{this.state.respMsg}</div>
                            </Form>
                        </CardBody>
                    </Card>
                </CardGroup>

            </React.Fragment>
        );
    }
}
export default Profile;