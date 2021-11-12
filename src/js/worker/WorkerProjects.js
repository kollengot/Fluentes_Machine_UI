import React, { Component } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import {statusColorClass} from '../common/Utils.js';

import WorkerService from "../services/worker.service";

class WorkerProjects extends Component {
    state = {
        searchValue: "",
        listitems: [],
        selectedItem: [],
        editProjectPage: false,
        hasMoreItems: true,
        pageNo: 0
    }
    
    getAllProjectList() {
        var tmpListitems = [];
        WorkerService.getAllProjects(this.state.pageNo).then(
            response => {
                if(response){
                    if(response.data.currentPage !== 0 ){
                        tmpListitems = [...this.state.listitems, ...response.data.projects];
                    } else {
                        tmpListitems = response.data.projects;
                    }
                    this.setState({
                        listitems: tmpListitems,
                        pageNo: this.state.pageNo+1
                    });
                    if((response.data.currentPage+1) == response.data.totalPages) {
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
    
    onProjectSelected(selectedItem) {
        this.setState({
            selectedItem: selectedItem
        });
    }
    parentCallback = () => {
        this.setState({
            selectedItem: []
        });
        this.setState({
            editProjectPage:false
          });
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
                                <input type="text" className="form-control search-box" placeholder="Search projects..." onChange={this.handleSearchChange.bind(this)} />
                            </div>
                        </div>
                    </div>
                    <div className="quote-req-list">
                        <div className="row mt-1 quote-req-header">
                            <div className="col-sm">
                                <label>Project Name</label>
                            </div>
                            <div className="col-sm">
                                <label>Description</label>
                            </div>
                            <div className="col-sm">
                                <label>Hours Commited</label>
                            </div>
                            <div className="col-sm">
                                <label>Hours Left</label>
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
                        

                        <InfiniteScroll
                pageStart={0}
                loadMore={this.getAllProjectList.bind(this)}
                hasMore={this.state.hasMoreItems}
                loader={<div className="loader" key={0}>Loading ...</div>}
                useWindow={false} >


                            {this.state.listitems && this.state.listitems.filter(item =>
                                item.name.toLowerCase().includes(this.state.searchValue)).map(listitem => (

                                    <div className="row mt-1" key={listitem.id}>
                                        <div className="col-sm" >
                                            <label className="btn btn-default blue projectname-truncate text-truncate">
                                                <input type="radio" className="toggle"
                                                    name="projectItem" value={listitem.id}
                                                    onChange={() => this.onProjectSelected(listitem)} />
                                                {listitem.name}
                                            </label>
                                            
                                        </div>
                                        <div className="col-sm" >
                                            <label className="description-truncate text-truncate">{listitem.desc}</label>
                                        </div>
                                        <div className="col-sm" >
                                            <label>{(new Date(listitem.start_date)).toLocaleDateString()}</label>
                                        </div>
                                        <div className="col-sm" >
                                            <label>{(new Date(listitem.end_date)).toLocaleDateString()}</label>
                                        </div>
                                        <div className="col-sm" >
                                            <label className = {"badge " + statusColorClass(listitem.status)} >{listitem.status}</label>
                                        </div>
                                    </div>
                                ))}




</InfiniteScroll>

                        </div>
                    </div>
                </div>
        );
    }
    render() {
        return (
            <React.Fragment>
                {this.renderProjectList()}
            </React.Fragment>
        );
    }
}
export default WorkerProjects;