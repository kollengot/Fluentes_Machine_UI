import React, { Component } from 'react';
import Popup from "../components/Popup";
import { validationMessages } from '../common/Constants';
import {statusColorClass} from '../common/Utils.js';
import EditProject from './EditProject';

import AdminService from "../services/admin.service";

class ManageProjects extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            searchValue: "",
            listitems: [],
            selectedItem: [],
            editProjectPage: false,
            popupConfig: {},
            isPopupOpen: false
        };
    }
    componentDidMount() {
        this.getAllProjectList();
    }
    getAllProjectList() {
        AdminService.getAllProjects().then(
            response => {
                if(response){
                    this.setState({
                        listitems: response.data.projects
                    });
                }
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
    handleClose = () => {
        this.setState({
            isPopupOpen: false
        });
    };

    handleModalYes = () => {
        this.setState({
            isPopupOpen: false
        });
        AdminService.deleteProject(this.state.selectedItem.id).then(
            response => {
                var tempList = this.state.listitems.filter(item => item.id !== this.state.selectedItem.id);
                this.setState({
                    listitems: tempList,
                    selectedItem: []
                });
            },
            error => {
              console.log("Error");
            }
          );
    };
    editProjects() {
        if (this.state.selectedItem && this.state.selectedItem.length === 0) {
            this.setState({
                isPopupOpen: true,
                popupConfig : {
                    header: "Message",
                    body:validationMessages.NO_ITEM,
                    type: "message"
                }
            });
        } else {
            this.setState({
                editProjectPage: true
            });
        }
    }
    deleteProjects() {
        /*var tempList = this.state.listitems.filter(item => item.id !== this.state.selectedItem.id);
        this.setState({
            listitems: tempList
        });
        */
        if (this.state.selectedItem && this.state.selectedItem.length === 0) {
            this.setState({
                isPopupOpen: true,
                popupConfig : {
                    header: "Message",
                    body:validationMessages.NO_ITEM,
                    type: "message"
                }
            });
        } else {
            this.setState({
                isPopupOpen: true,
                popupConfig : {
                    header: "Confirm to Delete",
                    body:"Are you sure you want to delete "+this.state.selectedItem.name,
                    type: "confirmation"
                }
            });
        }
    }
    onProjectSelected(selectedItem) {
        this.setState({
            selectedItem: selectedItem
        });
    }
    showPopup(message){
        this.setState({
            isPopupOpen: true,
            popupConfig : {
                header: "Message",
                body:message,
                type: "message"
            }
        });
    }
    parentCallback = (response) => {
        this.setState({
            editProjectPage: false,
            selectedItem: []
        });
        if(response && response.data.message){
            this.showPopup(response.data.message);
            this.getAllProjectList();
        } 
    }
    getNumberOfDays(start, end) {
        const date1 = new Date(start);
        const date2 = new Date(end);
        const oneDay = 1000 * 60 * 60 * 24;
        const diffInTime = date2.getTime() - date1.getTime();
        const diffInDays = Math.round(diffInTime / oneDay);
        return diffInDays;
    }

    renderProjectList() {
        return(
            <div className="col admin-list-page" id="projects-page">
                    <div className="list-group-header section-header row">

                        <div className="col-4">
                            <span className="mb-1 underline">Manage</span>
                            <span className="mb-1 blue-color pl-2">Projects</span>
                        </div>

                        <div className="col-8 text-right">
                            <div className="has-search">
                                <span className="fa fa-search form-control-feedback"></span>
                                <input type="text" className="form-control search-box" placeholder="Search quote requests..." onChange={this.handleSearchChange.bind(this)} />
                            </div>
                            <button className="btn delete-btn" onClick={() => this.deleteProjects()}></button>
                            <button className="btn edit-btn" onClick={() => this.editProjects()}></button>
                        </div>
                    </div>
                    <div className="quote-req-list">
                        <div className="row mt-1 quote-req-header">
                            <div className="col-2">
                                <label>Project Name</label>
                            </div>
                            <div className="col-3">
                                <label>Description</label>
                            </div>
                            <div className="col-1">
                                <label>Days Commited</label>
                            </div>
                            <div className="col-1">
                                <label>Days Left</label>
                            </div>

                            <div className="col-sm">
                                <label>Start Date</label>
                            </div>
                            <div className="col-sm">
                                <label>End Date</label>
                            </div>
                            
                            
                            <div className="col-sm">
                                <label>Status</label>
                            </div>
                        </div>
                        <div className="quote-req-table">

                            {this.state.listitems.filter(item =>
                                item.name.toLowerCase().includes(this.state.searchValue)).map(listitem => (

                                    <div className="row mt-1" key={listitem.id}>
                                        <div className="col-2" >
                                            <label className="btn btn-default blue projectname-truncate text-truncate">
                                                <input type="radio" className="toggle"
                                                    name="projectItem" value={listitem.id}
                                                    onChange={() => this.onProjectSelected(listitem)} />
                                                {listitem.name}
                                            </label>
                                            
                                        </div>
                                        <div className="col-3" >
                                            <label className="description-truncate text-truncate">{listitem.desc}</label>
                                        </div>
                                        <div className="col-1" >
                                            <label>{this.getNumberOfDays(listitem.start_date,listitem.end_date)}</label>
                                        </div>
                                        <div className="col-1" >
                                            {(new Date(listitem.start_date) < new Date()) ? (<label>{this.getNumberOfDays(new Date(),listitem.end_date)}</label>) : <label>{this.getNumberOfDays(listitem.start_date,listitem.end_date)}</label>}
                                            
                                        </div>
                                        <div className="col-sm" >
                                            <label>{(new Date(listitem.start_date)).toLocaleDateString() }</label>
                                        </div>
                                        <div className="col-sm" >
                                            <label>{(new Date(listitem.end_date)).toLocaleDateString() }</label>
                                        </div>
                                        <div className="col-sm" >
                                            <label className = {"badge description-truncate text-truncate " + statusColorClass(listitem.status)} >{listitem.status}</label>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
        );
    }
    render() {
        return (
            <React.Fragment>
                <Popup popupConfig = {this.state.popupConfig} openFlag = {this.state.isPopupOpen} parentCloseCallback={this.handleClose.bind(this)} parentConfirmCallback = {this.handleModalYes.bind(this)}></Popup>
                {this.state.editProjectPage ? <EditProject selectedId={this.state.selectedItem.id} parentCallback= {this.parentCallback}/> : this.renderProjectList()}
            </React.Fragment>
        );
    }
}
export default ManageProjects;