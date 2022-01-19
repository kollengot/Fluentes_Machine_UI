import React, { Component } from 'react';
import SubHeader from '../components/SubHeader.js';
import TableHeader from '../components/TableHeader.js';
import jsonData from "../../data/operationsData.json";
import AdminService from "../services/admin.service";

const workerProjectTH = ['Operation Name', 'Description', 'Start Date', 'End Date', 'Hours Commited', 'Hours Left', 'Status'];
const headerText = ['Manage', 'Operations'];

class WorkerOperations extends Component {
    constructor() {
        super();
        this.state = {
            searchValue: "",
            listitems: [],
            selectedItem: [],
            editOperationPage: false
        }
    }
    render() {
        return (
            <React.Fragment>
                {this.renderOperationsList()}
            </React.Fragment>
        );
    }

    componentDidMount() {
        this.setState({
            listitems: jsonData.operationsList
        });
    }

    getAllOperationList() {
        AdminService.getAllOperations().then(
            response => {
                this.setState({
                    listitems: response.data.operations
                });
            },
            error => {
                console.log("Error");
            }
        );
    }
    handleSearchChange(e) {
        this.setState({
            searchValue: e.target.value.toLowerCase()
        });
    }

    onOperationSelected(selectedItem) {
        this.setState({
            selectedItem: selectedItem
        });
    }
    parentCallback = () => {
        this.setState({
            selectedItem: []
        });
        this.setState({
            editOperationPage: false
        });
    }
    renderOperationsList() {
        return (
            <div className="col admin-list-page" id="operations-page">
               <SubHeader headerText={headerText} onSearchChange={this.handleSearchChange.bind(this)} />
                <div className="quote-req-list">
                    <TableHeader headerObj={workerProjectTH} />
                    <div className="quote-req-table">

                        {this.state.listitems.filter(item =>
                            item.o_name.toLowerCase().includes(this.state.searchValue)).map(listitem => (

                                <div className="row mt-1" key={listitem.id}>
                                    <div className="col-sm" >
                                        <label className="btn btn-default blue projectname-truncate text-truncate">
                                            <input type="radio" className="toggle"
                                                name="operationItem" value={listitem.id}
                                                onChange={() => this.onOperationSelected(listitem)} />
                                            {listitem.o_name}
                                        </label>

                                    </div>
                                    <div className="col-sm" >
                                        <label className="description-truncate text-truncate">{listitem.o_desc}</label>
                                    </div>
                                    <div className="col-sm" >
                                        <label>{listitem.createdAt}</label>
                                    </div>
                                    <div className="col-sm" >
                                        <label>{listitem.updatedAt}</label>
                                    </div>
                                    <div className="col-sm" >
                                        <label>{listitem.hoursCommited}</label>
                                    </div>
                                    <div className="col-sm" >
                                        <label>{listitem.hoursLeft}</label>
                                    </div>
                                    <div className="col-sm" >
                                        <label>{listitem.status}</label>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        );
    }

}
export default WorkerOperations;