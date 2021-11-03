import React, { Component } from 'react';
import { isEmail } from "validator";
import AdminService from "../services/admin.service";

class EditInventory extends Component {
    state = {
        item: this.props.selectedItem,
        editInventoryPage: this.props.editInventoryPage,
        errors: {}
    }
    handleChange(propertyName, event) {
        if(event.target.type === 'number') {
            event.target.value = Math.abs(event.target.value);
        }
        var item = this.state.item;
        item[propertyName] = event.target.value;
        this.setState({ item: item });
    }
    emailValidation() {
        if (this.state.item.supplierInfo && isEmail(this.state.item.supplierInfo)) {
            return "";
        } else {
            return "disabled";
         }
    }
    sendEmail() {
        var emailId = this.state.item.supplierInfo;
        if (this.state.item.supplierInfo && isEmail(this.state.item.supplierInfo)) {
            //Linking.openURL('mailto:fasfd@fdsf.com');
        }
        
    }
    saveInventory() {
        if(this.validateForm()) {
            if (this.state.item.id !== undefined) {
                this.updateInventory();
            } else {
                this.createInventory();
            }
        }
    }
    validateForm() {
        let errors = {};
        let isValid = true;
        if (!this.state.item.itemName) {
            isValid = false;
            errors["itemName"] = "Please enter inventory name.";
        }
        if (!this.state.item.availability) {
            isValid = false;
            errors["availability"] = "Please enter availability.";
        }
        if (!this.state.item.cost) {
            isValid = false;
            errors["cost"] = "Please enter cost.";
        }
        if (typeof this.state.item.supplierInfo !== "undefined") {
            var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
            if (!pattern.test(this.state.item.supplierInfo)) {
                isValid = false;
                errors["supplierInfo"] = "Please enter valid email address.";
            }
        }
        this.setState({
            errors: errors
        });
        return isValid;
    }

    updateInventory() {
        var data = {
            "itemName": this.state.item.itemName,
            "itemDesc": this.state.item.itemDesc,
            "availability": this.state.item.availability,
            "cost": this.state.item.cost,
            "supplier_email": this.state.item.supplierInfo,
            "operations": []
        };

        AdminService.editInventory(this.state.item.id, data).then(
            response => {
                this.props.parentCallback(response);
            },
            error => {
                console.log("Error");
            }
        );
    }
    createInventory() {
        var data = {
            "itemName": this.state.item.itemName,
            "itemDesc": this.state.item.itemDesc,
            "availability": this.state.item.availability,
            "cost": this.state.item.cost,
            "supplier_email": this.state.item.supplierInfo,
            "operations": []
        };

        AdminService.createInventory(data).then(
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
                <div className="col edit-inventory">
                    <div className="list-group-header section-header row">
                        <div className="col-4">

                            <nav aria-label="breadcrumb">
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item" onClick={this.handleBreadCrumb.bind(this)}>
                                        <span className="mb-1 underline">Manage</span>
                                        <span className="mb-1 blue-color pl-2">Inventory</span>
                                    </li>
                                    <li className="breadcrumb-item active" aria-current="page">
                                        <span className="mb-1">{(this.state.item.length !== 0) ? 'Edit' : 'Add'}</span>
                                        <span className="mb-1 blue-color pl-2">Inventory</span>
                                    </li>
                                </ul>
                            </nav>

                        </div>
                        <div className="col-8 text-right">
                            <button type="button" className="btn btn-blue btn-sm pr-4 pl-4" onClick={() => this.resetReq()} >Reset</button>
                            <button type="button" className="btn btn-green btn-sm ml-2 pr-4 pl-4" onClick={() => this.saveInventory()}>Save</button>
                        </div>
                    </div>

                    <div className="blue-box-div row">
                        <div className="col white-border-right">
                            <div>
                                <span>Item Name</span>
                                <input type="text"
                                    className="form-control" defaultValue={this.state.item.itemName}
                                    onChange={this.handleChange.bind(this, 'itemName')} />
                                <div className="text-danger">{this.state.errors.itemName}</div>
                            </div>
                            <div>
                                <span>Description</span>
                                <textarea className="form-control" rows="3"
                                    defaultValue={this.state.item.itemDesc}
                                    onChange={this.handleChange.bind(this, 'itemDesc')}></textarea>
                            </div>



                            <div className="col row">
                                <div className="col-xs-2">
                                    <span>Availability</span>
                                    <input type="number"
                                        className="form-control" defaultValue={this.state.item.availability}
                                        onChange={this.handleChange.bind(this, 'availability')} />
                                </div>
                                <div className="col-xs-3 ml-4">
                                    <span>Supplier Email</span>
                                    <input type="text"
                                        className="form-control d-inline" defaultValue={this.state.item.supplierInfo}
                                        onChange={this.handleChange.bind(this, 'supplierInfo')} />
                                </div>
                                <div className="col-xs-4">
                                    <button className={"btn btn-sm btn-blue m-4 p-2 " + this.emailValidation()}
                                    onClick={this.sendEmail(this)} >Contact Supplier</button>
                                </div>
                                <div className="text-danger">{this.state.errors.availability}</div>
                                <div className="text-danger">{this.state.errors.supplierInfo}</div>
                            </div>

                            <div>
                                <span>Cost</span>
                                <input type="number"
                                    className="form-control" defaultValue={this.state.item.cost}
                                    onChange={this.handleChange.bind(this, 'cost')} />
                                <div className="text-danger">{this.state.errors.cost}</div>
                            </div>

                        </div>
                        <div className="col">
                            <span> {this.state.item.operations_tagged ? 'Operatios Tagged' : 'No Operatios Tagged'}</span>

                            <div>
                                {this.state.item.operations_tagged && this.state.item.operations_tagged.map((operation, index) => (
                                    <span className="badge tool-badge">Operation {index + 1} - {operation}</span>
                                )
                                )}
                            </div>
                        </div>

                    </div>



                </div>


            </React.Fragment>
        );
    }
}
export default EditInventory;