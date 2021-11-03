import React, { Component } from 'react';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AdminService from "../services/admin.service";
import Popup from "../components/Popup";

class EditProject extends Component {
    constructor(props) {
        super(props);
        this.getAllWorkers();
        this.getSingleProject();
    }
    state = {
        item: {},
        workerList: [],
        selectedWorker: {},
        popupConfig: {},
        isPopupOpen: false,
        errors: {},
        hasMoreItems: true,
        pageNo: 0
    }
    getSingleProject = () => {
        AdminService.getSingleProject(this.props.selectedId).then(
          response => {
            if (response) {
              this.setState({
                item: response.data
              });
            }
          },
          error => {
            console.log("Error");
          }
        );
      };
    handleChange(propertyName, event) {
        if(event.target.type === 'number') {
            event.target.value = Math.abs(event.target.value);
        }
        var item = this.state.item;
        item[propertyName] = event.target.value;
        this.setState({ item: item });
    }
    handleDateChange(propertyName, event) {
        var item = this.state.item;
        item[propertyName] = new Date(event);
        this.setState({ item: item });
    }
    handleClose = () => {
        this.setState({
            isPopupOpen: false
        });
    }
    showPopupMessage(message) {
        this.setState({
            isPopupOpen: true,
            popupConfig: {
                header: "Message",
                body: message,
                type: "message"
            }
        });
    }
    validateForm() {
        let errors = {};
        let isValid = true;
        
        if (!this.state.item.name) {
            isValid = false;
            errors["name"] = "Please enter project name.";
        }
        this.setState({
            errors: errors
        });
        return isValid;
    }

    saveProject() {
        if(this.validateForm()) {
            var data = {
                "name": this.state.item.name,
                "desc": this.state.item.desc,
                "startDate": this.state.item.start_date,
                "endDate": this.state.item.end_date,
                "workers": this.state.item.workers
            };
            AdminService.editProject(this.state.item.id, data).then(
                response => {
                    // this.showPopupMessage(response.data.message);
                    this.props.parentCallback(response);
                },
                error => {
                    console.log("Error");
                }
            );
        }
    }
    resetReq() {

    }
    handleBreadCrumb() {
        this.props.parentCallback();
    }
    getAllWorkers() {
        AdminService.getAllWorkers(this.state.pageNo).then(
            response => {
                if(response) {
                    var tmpListitems = [];
                    if(response.data.currentPage !== 0 ){
                        tmpListitems = [...this.state.workerList, ...response.data.rows];
                    } else {
                        tmpListitems = response.data.rows;
                    }
                    this.setState({
                        workerList: tmpListitems,
                        pageNo: this.state.pageNo+1
                    });

                    if(this.state.pageNo >= response.data.currentPage) {
                        this.setState({
                            hasMoreItems: false
                        });
                    }
                } 
            },
            error => {
                console.log("Error");
            }
        );
    }


    statusChange(event) {
        var data = {
            "status": "CLOSED"
        };
        AdminService.changeProjectStatus(this.state.item.id, data).then(
            response => {
                this.showPopupMessage(response.data.message);
            },
            error => {
                console.log("Error");
            }
        );
    }
    handleWorkerSelection(event) {
        this.state.selectedWorker = this.state.workerList.find(o => o.id == event.target.value);
    }
    addWorker(event) {
        this.state.selectedWorker['required_hrs'] = this.state.item.workerRequired;
        //this.state.selectedWorker['est_cost'] = parseInt(this.state.item.workerRequired) * parseInt(this.state.selectedWorker.cost_per_hr);
        var selectedProject = this.state.item;
        if (!selectedProject.workers) {
            selectedProject['workers'] = [];
        }
        selectedProject.workers.push(this.state.selectedWorker);
        this.setState({ item: selectedProject });
        console.log(this.state.item);

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
                                        <span className="mb-1 blue-color pl-2">Project</span>
                                    </li>
                                    <li className="breadcrumb-item active" aria-current="page">
                                        <span className="mb-1">{(this.state.item.length !== 0) ? 'Edit' : 'Add'}</span>
                                        <span className="mb-1 blue-color pl-2">Project</span>
                                    </li>
                                </ul>
                            </nav>

                        </div>
                        <div className="col-8 text-right">
                            <button type="button" className="btn btn-blue btn-sm pr-4 pl-4" onClick={() => this.resetReq()} >Reset</button>
                            <button type="button" className="btn btn-green btn-sm ml-2 pr-4 pl-4" onClick={() => this.saveProject()}>Save</button>
                        </div>
                    </div>

                    <div className="blue-box-div row">
                        <div className="col white-border-right">
                            <div>
                                <span>Project Name</span>
                                <input type="text"
                                    className="form-control" defaultValue={this.state.item.name}
                                    onChange={this.handleChange.bind(this, 'name')} />
                                <div className="text-danger">{this.state.errors.name}</div>
                            </div>
                            <div>
                                <span>Description</span>
                                <textarea className="form-control" rows="3"
                                    defaultValue={this.state.item.desc}
                                    onChange={this.handleChange.bind(this, 'desc')}></textarea>
                            </div>
<div>
                                <span>Start Date</span>
                                <DatePicker
                                    selected={this.state.item.start_date && new Date(this.state.item.start_date)}
                                    onChange={this.handleDateChange.bind(this, 'start_date')}
                                    className="form-control"
                                    minDate={new Date()}
                                />
                            </div>
                            <div>
                                <span>End Date</span>
                                <DatePicker
                                    selected={this.state.item.end_date && new Date(this.state.item.end_date)}
                                    onChange={this.handleDateChange.bind(this, 'end_date')}
                                    className="form-control"
                                    minDate={new Date(this.state.item.start_date)}
                                />
                            </div>

                        </div>

                        <div className="col">


                            <div className="row">
                                <div className="col"><span>Worker</span></div>
                                <div className="col"><span>Required Hours</span></div>
                            </div>

                            <div className="row">
                                <div className="col">
                                    <select className="form-control" onChange={this.handleWorkerSelection.bind(this)}>
                                        <option selected>Select Worker</option>
                                        {this.state.workerList.map((item) => (
                                            <option key={item.id} value={item.id}>{item.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col">
                                    <input type="number" className="form-control col-5 d-inline" onChange={this.handleChange.bind(this, 'workerRequired')} />
                                    <button type="button" className="btn btn-green btn-sm ml-2 pr-4 pl-4 d-inline" onClick={this.addWorker.bind(this)}>Add</button>
                                </div>

                            </div>

                            <div className="row mt-1 quote-req-header font-weight-bold">
                                <div className="col-sm">
                                    <label>Name</label>
                                </div>
                                <div className="col-sm">
                                    <label>Profession</label>
                                </div>
                                <div className="col-sm">
                                    <label>Available per day </label>
                                </div>
                                <div className="col-sm">
                                    <label>Required Hours</label>
                                </div>
                                <div className="col-sm">
                                    <label>Cost per hour</label>
                                </div>
                                <div className="col-sm">
                                    <label>Estimated Cost</label>
                                </div>
                            </div>

                            {this.state.item.workers && this.state.item.workers.map(listitem => (

                                <div className="row mt-1" >
                                    <div className="col-sm" >
                                        <label className="description-truncate text-truncate">{listitem.name}</label>
                                    </div>
                                    <div className="col-sm" >
                                        <label>{listitem.name}</label>
                                    </div>
                                    <div className="col-sm" >
                                        <label>{listitem.avail_per_day}</label>
                                    </div>
                                    <div className="col-sm" >
                                        <label>{listitem.required_hrs}</label>
                                    </div>
                                    <div className="col-sm" >
                                        <label>{listitem.cost_per_hr}</label>
                                    </div>
                                    <div className="col-sm" >
                                        <label>{listitem.cost_per_hr * listitem.required_hrs}</label>
                                    </div>
                                </div>
                            ))}

                           





                            <div className="row">
                                <button type="button" className="btn btn-green btn-sm m-4 pr-4 pl-4 d-inline" onClick={this.statusChange.bind(this)}>Project Completed</button>
                            </div>
                        </div>
                    </div>
                </div>

                <Popup popupConfig={this.state.popupConfig} openFlag={this.state.isPopupOpen} parentCloseCallback={this.handleClose} ></Popup>
            </React.Fragment>
        );
    }
}
export default EditProject;