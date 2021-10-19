import React, { Component } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import Popup from "../components/Popup";
import { validationMessages } from '../common/Constants';
import EditWorker from './EditWorker';
import AdminService from "../services/admin.service";

class ManageWorker extends Component {
    state = {
        searchValue: "",
        listitems: [],
        selectedItem: [],
        editWorkerPage: false,
        popupConfig: {},
        isPopupOpen: false,
        hasMoreItems: true,
        pageNo: 0
    }
    getAllWorkerList() {
        AdminService.getAllWorkers(this.state.pageNo).then(
            response => {
                if(response) {
                    var tmpListitems = [];
                    if(response.data.currentPage !== 0 ){
                        tmpListitems = [...this.state.listitems, ...response.data.rows];
                    } else {
                        tmpListitems = response.data.rows;
                    }
                    this.setState({
                        listitems: tmpListitems,
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
    handleSearchChange(e) {
        this.setState({
            searchValue: e.target.value.toLowerCase()
        });
    }
    editWorker() {
        if (this.state.selectedItem && this.state.selectedItem.length === 0) {
            this.showPopup(validationMessages.NO_ITEM);
        } else {
            this.setState({
                editWorkerPage: true
            });
        }
    }
    addWorker() {
        this.setState({
            selectedItem: []
        });
        this.setState({
            editWorkerPage: true
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
        AdminService.deleteWorker(this.state.selectedItem.id).then(
            response => {
                var tempList = this.state.listitems.filter(item => item.id !== this.state.selectedItem.id);
                this.setState({
                    listitems: tempList,
                    selectedItem: []
                });
                this.showPopup(response.data.message);
            },
            error => {
              console.log("Error");
            }
          );
    };

    deleteWorker() {
        if (this.state.selectedItem && this.state.selectedItem.length === 0) {
            this.showPopup(validationMessages.NO_ITEM);
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
    onWorkerSelected(selectedItem) {
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
            editWorkerPage: false,
            selectedItem: [],
            hasMoreItems: true,
            pageNo: 0
        });
        if(response && response.data.message){
            this.showPopup(response.data.message);
            this.getAllWorkerList();
        } 
        
    }
    renderWorkerList() {
        return (<div className="col admin-list-page">
            <div className="list-group-header section-header row">
                <div className="col-4">
                    <span className="mb-1 underline">Manage</span>
                    <span className="mb-1 blue-color pl-2">Worker</span>
                </div>
                <div className="col-8 text-right">
                    <div className="has-search">
                        <span className="fa fa-search form-control-feedback"></span>
                        <input type="text" className="form-control search-box" placeholder="Search worker..." onChange={this.handleSearchChange.bind(this)} />
                    </div>
                    <button className="btn delete-btn" onClick={() => this.deleteWorker()}></button>
                    <button className="btn edit-btn" onClick={() => this.editWorker()}></button>
                    <button className="btn add-btn" onClick={() => this.addWorker()}></button>
                </div>
            </div>
            <div className="quote-req-list">
                <div className="row mt-1 quote-req-header">
                    <div className="col-sm">
                        <label>Worker Name</label>
                    </div>
                    <div className="col-sm">
                        <label>Phone</label>
                    </div>
                    <div className="col-3">
                        <label>Address</label>
                    </div>
                    <div className="col-sm">
                        <label>Email</label>
                    </div>
                    <div className="col-1">
                        <label>Cost per Hour</label>
                    </div>
                    <div className="col-1">
                        <label>Availability per Week</label>
                    </div>
                    <div className="col-sm">
                        <label>Created On</label>
                    </div>
                </div>
                <div className="quote-req-table" style={{maxHeight: (window.innerHeight - 200) + 'px'}}>

                <InfiniteScroll
                pageStart={0}
                loadMore={this.getAllWorkerList.bind(this)}
                hasMore={this.state.hasMoreItems}
                loader={<div className="loader" key={0}>Loading ...</div>}
                useWindow={false} >

                    {this.state.listitems.filter(item =>
                        item.name && item.name.toLowerCase().includes(this.state.searchValue)).map(listitem => (


                            <div className="row mt-1" key={listitem.email}>


                                <div className="col-sm" >
                                    <label className="btn btn-default blue projectname-truncate text-truncate">
                                        <input type="radio" className="toggle"
                                            name="quoteItem" value={listitem.email}
                                            onChange={() => this.onWorkerSelected(listitem)} />
                                        {listitem.name}
                                    </label>

                                </div>

                                <div className="col-sm" >
                                    <label className="description-truncate text-truncate">{listitem.phone}</label>
                                </div>

                                <div className="col-3" >
                                    <label className="description-truncate text-truncate" >{listitem.address}</label>
                                </div>

                                <div className="col-sm" >
                                    <label>{listitem.email}</label>
                                </div>

                                <div className="col-1" >
                                    <label>{listitem.cost_per_hr}</label>
                                </div>

                                <div className="operation-div col-1" >

                                    <label>{listitem.total_avail_per_week}</label>
                                </div>

                                <div className="col-sm" >
                                    <label>{(new Date(listitem.createdAt)).toLocaleDateString()}</label>
                                </div>

                            </div>
                        ))}
                         </InfiniteScroll>
                </div>
            </div>
        </div>);
    }
    render() {
        return (
            <React.Fragment>
                <Popup popupConfig = {this.state.popupConfig} openFlag = {this.state.isPopupOpen} parentCloseCallback={this.handleClose.bind(this)} parentConfirmCallback = {this.handleModalYes.bind(this)}></Popup>
                {this.state.editWorkerPage ? <EditWorker selectedItem={this.state.selectedItem} parentCallback={this.parentCallback} /> : this.renderWorkerList()}
            </React.Fragment>
        );
    }
}
export default ManageWorker;