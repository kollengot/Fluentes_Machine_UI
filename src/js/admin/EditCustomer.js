import React, { Component } from 'react';
import AdminService from "../services/admin.service";
import AuthService from "../services/auth.service";

class EditCustomer extends Component {
    state = {
        item: this.props.selectedItem,
        editCustomerPage: this.props.editCustomerPage,
        errors: {}
    }
    handleChange(propertyName, event) {
        var item = this.state.item;
        item[propertyName] = event.target.value;
        this.setState({ item: item });
    }
    saveCustomer() {
        if(this.validateForm()) {
            if(this.state.item.id) {
                this.editCustomer();
            } else {
                this.createNewCustomer();
            }
            
        }
    }
    validateForm() {
        let errors = {};
        let isValid = true;
        
        if (!this.state.item.name) {
            isValid = false;
            errors["name"] = "Please enter customer name.";
        }
        if (!this.state.item.email) {
            isValid = false;
            errors["email"] = "Please enter your email Address.";
        }
        if (typeof this.state.item.email !== "undefined") {
            let pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
            if (!pattern.test(this.state.item.email)) {
                isValid = false;
                errors["email"] = "Please enter valid email address.";
            }
        }
        if (!this.state.item.phone) {
            isValid = false;
            errors["phone"] = "Please enter your phone number.";
        }
        if (typeof this.state.item.phone !== "undefined") {
            let pattern = new RegExp(/^[0-9\b]+$/);
            if (!pattern.test(this.state.item.phone)) {
                isValid = false;
                errors["phone"] = "Please enter only number.";
            } else if (this.state.item.phone.length !== 10) {
                isValid = false;
                errors["phone"] = "Please enter valid phone number.";
            }
        }
        this.setState({
            errors: errors
        });
        return isValid;
    }
    editCustomer() {
        var data = {
            "name": this.state.item.name,
            "email": this.state.item.email,
            "phone": this.state.item.phone,
            "address" : this.state.item.address
        };

        AdminService.editCustomer(this.state.item.id, data).then(
            response => {
                this.props.parentCallback(response);
            },
            error => {
                console.log("Error");
            }
        ); 
    }
    createNewCustomer() {
        var data = {
            "name": this.state.item.name,
            "email": this.state.item.email,
            "phone": this.state.item.phone,
            "address" : this.state.item.address
        };

        AuthService.createCustomer(data).then(
            response => {
                this.props.parentCallback(response);
            },
            error => {
                console.log("Error");
            }
        );
    }

    resetReq() {

    }
    handleBreadCrumb() {
        this.props.parentCallback();
    }
    render() {
        return (
            <React.Fragment>

                <div className="col edit-customer">
                    <div className="list-group-header section-header row">
                        <div className="col-4">

                            <nav aria-label="breadcrumb">
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item" onClick={this.handleBreadCrumb.bind(this)}>
                                        <span className="mb-1 underline">Manage</span>
                                        <span className="mb-1 blue-color pl-2">Customer</span>
                                    </li>
                                    <li className="breadcrumb-item active" aria-current="page">
                                        <span className="mb-1">{(this.state.item.length !== 0) ? 'Edit' : 'Add'}</span>
                                        <span className="mb-1 blue-color pl-2">Customer</span>
                                    </li>
                                </ul>
                            </nav>

                        </div>
                        <div className="col-8 text-right">
                            <button type="button" className="btn btn-blue btn-sm pr-4 pl-4" onClick={() => this.resetReq()} >Reset</button>
                            <button type="button" className="btn btn-green btn-sm ml-2 pr-4 pl-4" onClick={() => this.saveCustomer()}>Save</button>
                        </div>
                    </div>

                    <div className="blue-box-div row">
                        <div className="col">
                            <div>
                                <span>Customer Name</span>
                                <input type="text"
                                    className="form-control" defaultValue={this.state.item.name}
                                    onChange={this.handleChange.bind(this, 'name')} />
                                <div className="text-danger">{this.state.errors.name}</div>
                            </div>
                            <div>
                                <span>Phone</span>
                                <input type="text"
                                    className="form-control" defaultValue={this.state.item.phone}
                                    onChange={this.handleChange.bind(this, 'phone')} />
                                <div className="text-danger">{this.state.errors.phone}</div>
                            </div>
                            <div>
                                <span>Address</span>
                                <textarea className="form-control" rows="3"
                                    defaultValue={this.state.item.address}
                                    onChange={this.handleChange.bind(this, 'address')}></textarea>
                            
                            </div>
                            <div>
                                <span>Email</span>
                                <input type="text" readOnly = {this.state.item.id ? true : false }
                                    className="form-control" defaultValue={this.state.item.email}
                                    onChange={this.handleChange.bind(this, 'email')} />
                                <div className="text-danger">{this.state.errors.email}</div>
                            </div>
                            
                            
                        </div>
                       

                    </div>



                </div>


            </React.Fragment>
        );
    }
}
export default EditCustomer;