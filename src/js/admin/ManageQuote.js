import React, { Component, useEffect} from 'react';
import InfiniteScroll from 'react-infinite-scroller';


import AdminService from "../services/admin.service";
import EditQuote from './EditQuote';

import Popup from "../components/Popup";
import { validationMessages } from '../common/Constants';
import { statusColorClass } from '../common/Utils.js';

class ManageQuote extends Component {

    state = {
        searchValue: "",
        selectedItem: [],
        listitems: [],
        updateQuotePage: false,
        popupConfig: {},
        isPopupOpen: false,
        hasMoreItems: true,
        pageNo: 0
    }
    constructor(props) {
        super(props);
    }


    
      
    render() {
        return (
            <React.Fragment>
                <Popup popupConfig = {this.state.popupConfig} openFlag = {this.state.isPopupOpen} parentCloseCallback={this.handleClose.bind(this)} parentConfirmCallback = {this.handleModalYes}></Popup>
                {this.state.updateQuotePage ? <EditQuote selectedQuoteId= {this.state.selectedItem.id} parentCallback= {this.parentCallback}/> : this.renderQuoteList() }
            </React.Fragment>
        );
    }
    getAllQuotes() {
        AdminService.getAllQuotes(this.state.pageNo).then(
            response => {
                if(response){
                    //var tmpListitems = this.state.listitems.concat(response.data.rows);
                    var tmpListitems = [...this.state.listitems, ...response.data.rows];
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
    onQuotereqSelected(selectedItem) {
        this.setState({
            selectedItem: selectedItem
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
        /*AdminService.deleteQuote(this.state.selectedItem.id).then(
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
          );*/
    };

    showPopup(message) {
        this.setState({
            isPopupOpen: true,
            popupConfig : {
                header: "Message",
                body:message,
                type: "message"
            }
        });
    }
    /*deleteQuote() {
        if (this.state.selectedItem && this.state.selectedItem.length === 0) {
            this.showPopup(validationMessages.NO_ITEM);
        } else {
            this.setState({
                isPopupOpen: true,
                popupConfig : {
                    header: "Confirm to Delete",
                    body:validationMessages.DELETE_CONFIRM+this.state.selectedItem.title,
                    type: "confirmation"
                }
            });
        }
    }*/

    editQuote() {
        if (this.state.selectedItem && this.state.selectedItem.length === 0) {
            this.showPopup(validationMessages.NO_ITEM);
        } else {
            this.setState({
                updateQuotePage: true
            });
        }
    }
    parentCallback = () => {
        this.setState({
            selectedItem: [],
            updateQuotePage: false
        });
    }
    
    renderQuoteList() {
        return (

        
        <div className="col admin-list-page">
            <div className="list-group-header section-header row">
                <div className="col-4">
                    <span className="mb-1 underline">Quote</span>
                    <span className="mb-1 blue-color pl-2">Requests</span>
                </div>
                <div className="col-8 text-right">
                    <div className="has-search">
                        <span className="fa fa-search form-control-feedback"></span>
                        <input type="text" className="form-control search-box" placeholder="Search quote requests..." onChange={this.handleSearchChange.bind(this)} />
                    </div>
                    
                    <button className="btn edit-btn" onClick={() => this.editQuote()}></button>

                </div>
            </div>
            <div className="quote-req-list">
                <div className="row mt-1 quote-req-header">
                    <div className="col-4">
                        <label>Title</label>
                    </div>
                    <div className="col-sm">
                        <label>Submitted by</label>
                    </div>
                    <div className="col-sm">
                        <label>Received On</label>
                    </div>
                    <div className="col-sm">
                        <label>Modified On</label>
                    </div>
                    <div className="col-sm">
                        <label>Status</label>
                    </div>
                    <div className="col-sm text-right">
                        <label>Attachments</label>
                    </div>
                </div>
                <div className="quote-req-table" style={{maxHeight: (window.innerHeight - 200) + 'px'}}>

                <InfiniteScroll
                pageStart={0}
                loadMore={this.getAllQuotes.bind(this)}
                hasMore={this.state.hasMoreItems}
                loader={<div className="loader" key={0}>Loading ...</div>}
                useWindow={false}
            >
               



               {this.state.listitems && this.state.listitems.filter(item =>
                        item.title.toLowerCase().includes(this.state.searchValue)).map(item => (
                            <div className="row mt-1" key={item.id}>
                                <div className="col-4" >
                                    <label className="btn btn-default blue projectname-truncate text-truncate">
                                        <input type="radio" className="toggle"
                                            name="quoteItem" value={item.id}
                                            onChange={() => this.onQuotereqSelected(item)} />
                                        {item.title}
                                    </label>
                                </div>

                                <div className="col-sm">
                                    <label>{item.User.name}</label>
                                </div>
                                <div className="col-sm">
                                    <label>{(new Date(item.createdAt)).toLocaleDateString()}</label>
                                </div>
                                <div className="col-sm">
                                    <label>{(new Date(item.updatedAt)).toLocaleDateString()}</label>
                                </div>
                                <div className="col-sm">
                                    <span className={"badge " + statusColorClass(item.status)} >{item.status}</span>
                                </div>
                                <div className="col-sm text-right">
                                    <span className="badge attachment-badge">{item.Uploads && item.Uploads.length}</span>
                                </div>
                            </div>
                        ))}






            </InfiniteScroll>


                    








                </div>
            </div>
        </div>);
    }
    
}
export default ManageQuote;