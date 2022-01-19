import React, { Component } from 'react';

import AdminService from "../services/admin.service";

import Checkbox from "../components/Checkbox";

class OperationList extends Component {

    constructor() {
        super();
        this.state = {
            listitems: [],
            searchValue: ""
        }
        this.getAllOperationList();
    }

    getAllOperationList() {
        AdminService.getAllOperations().then(
            response => {
                console.log(response);
                debugger;
                this.setState({
                    listitems: response.data.rows
                });
            },
            error => {
                console.log("Error");
            }
        );
    }
    onTagOperationSelectedSave() {
        this.props.popupClose(this.state.selectedItem);
    }

    onOperationSelected(selectedItem) {
        this.setState({
            selectedItem: selectedItem
        });
    }
    render() {
        return (
            <React.Fragment>
                <div className="admin-list-page">
                    <div className="quote-req-list">
                        <div className="row mt-1 quote-req-header">
                            <div className="col-sm">
                                <label>Operation Name</label>
                            </div>
                            <div className="col-sm">
                                <label>Description</label>
                            </div>

                        </div>

                        <div className="quote-req-table">
                            {this.state.listitems && this.state.listitems.filter(item =>
                                item.name.toLowerCase().includes(this.state.searchValue)).map(listitem => (

                                    <div className="row mt-1" key={listitem.id}>
                                        <div className="col-sm" >
                                            <label className="btn btn-default blue projectname-truncate text-truncate">
                                                <input type="radio" className="toggle"
                                                    name="operationItem" value={listitem.id}
                                                    onChange={() => this.onOperationSelected(listitem)} />
                                                {listitem.name}
                                            </label>

                                        </div>
                                        <div className="col-sm" >
                                            <label className="description-truncate text-truncate">{listitem.desc}</label>
                                        </div>
                                    </div>
                                ))}
                        </div>
                        <button onClick={() => this.onTagOperationSelectedSave()} className="btn btn-success btn-sm" >Save</button>
                    </div>
                </div>
            </React.Fragment>
        );

    }
}
export default OperationList;