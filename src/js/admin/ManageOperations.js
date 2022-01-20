import React, { Component } from 'react';
import Popup from "../components/Popup";
import { validationMessages } from '../common/Constants';
import EditOperations from './EditOperations';
import AdminService from "../services/admin.service";

class ManageOperations extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            searchValue: "",
            listitems: [],
            selectedItem: [],
            editOperationPage: false,
            popupConfig: {},
            isPopupOpen: false
        };
        
    }
    componentDidMount() {
        this.getAllOperationList();
    }
    getAllOperationList() {
        AdminService.getAllOperations().then(
            response => {
                this.setState({
                    listitems: response.data.rows
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
    handleClose = () => {
        this.setState({
            isPopupOpen: false
        });
    };

    handleModalYes = () => {
        this.setState({
            isPopupOpen: false
        });
        AdminService.deleteOperation(this.state.selectedItem.id).then(
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
    editOperations() {
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
                editOperationPage: true
            });
        }
    }
    deleteOperations() {
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
    addOperations() {
        this.setState({
            selectedItem: []
        });
        this.setState({
            editOperationPage: true
        });
    }
    onOperationSelected(selectedItem) {
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
        if(response && response.data.message){
            this.showPopup(response.data.message);
            this.getAllOperationList();
        } 
        this.setState({
            editOperationPage: false,
            selectedItem: []
        });

    }
    renderOperationsList() {
        return(
            <div className="col admin-list-page" id="operations-page">
                    <div className="list-group-header section-header row">

                        <div className="col-4">
                            <span className="mb-1 underline">Manage</span>
                            <span className="mb-1 blue-color pl-2">Operations</span>
                        </div>

                        <div className="col-8 text-right">
                            <div className="has-search">
                                <span className="fa fa-search form-control-feedback"></span>
                                <input type="text" className="form-control search-box" placeholder="Search operations..." onChange={this.handleSearchChange.bind(this)} />
                            </div>
                            <button className="btn delete-btn" onClick={() => this.deleteOperations()}></button>
                            <button className="btn edit-btn" onClick={() => this.editOperations()}></button>
                            <button className="btn add-btn" onClick={() => this.addOperations()}></button>
                        </div>
                    </div>
                    <div className="quote-req-list">
                        <div className="row mt-1 quote-req-header">
                            <div className="col-2">
                                <label>Operation Name</label>
                            </div>
                            <div className="col-3">
                                <label>Description</label>
                            </div>
                            <div className="col-3">
                                <label>Tools & Materials Required </label>
                            </div>
                            <div className="col-sm">
                                <label>Created On</label>
                            </div>
                            <div className="col-sm">
                                <label>Modified On</label>
                            </div>
                            
                        </div>
                        <div className="quote-req-table">

                           {this.state.listitems && this.state.listitems.filter(item =>
                                item.name.toLowerCase().includes(this.state.searchValue)).map(listitem => (

                                    <div className="row mt-1" key={listitem.id}>
                                        <div className="col-2" >
                                            <label className="btn btn-default blue projectname-truncate text-truncate">
                                                <input type="radio" className="toggle"
                                                    name="operationItem" value={listitem.id}
                                                    onChange={() => this.onOperationSelected(listitem)} />
                                                {listitem.name}
                                            </label>
                                            
                                        </div>
                                        <div className="col-3" >
                                            <label className="description-truncate text-truncate">{listitem.desc}</label>
                                        </div>
                                        <div className="col-3" >
                                        
                                            
                                            <label className="description-truncate text-truncate">
                                            <span className="badge date-badge mr-2">{listitem.toolsRequired.length}</span>
                                                {listitem.toolsRequired.toString()}
                                            </label>
                                            
                                        </div>
                                        <div className="col-sm" >
                                            <label>{(new Date(listitem.createdAt)).toLocaleDateString()}</label>
                                        </div>
                                        <div className="col-sm" >
                                            <label>{(new Date(listitem.updatedAt)).toLocaleDateString()}</label>
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
                {this.state.editOperationPage ? <EditOperations selectedId={this.state.selectedItem.id} parentCallback= {this.parentCallback}/> : this.renderOperationsList()}
            </React.Fragment>
        );
    }
}
export default ManageOperations;