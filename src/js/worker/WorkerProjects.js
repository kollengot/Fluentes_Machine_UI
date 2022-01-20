import React, { Component } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { statusColorClass } from '../common/Utils.js';
import SubHeader from '../components/SubHeader.js';
import TableListHeader from '../components/TableListHeader.js';
import WorkerService from "../services/worker.service";

const workerProjectTH = ['Project Name', 'Description', 'Start Date', 'End Date', 'Status'];
const headerText = ['Manage', 'Projects'];

class WorkerProjects extends Component {

    constructor() {
        super();
        this.state = {
            searchValue: "",
            listitems: [],
            selectedItem: [],
            editProjectPage: false,
            hasMoreItems: true,
            pageNo: 0
        }
    }
    render() {
        return (
            <React.Fragment>
               <div className="col admin-list-page" id="projects-page">
                <SubHeader headerText={headerText} onSearchChange={this.handleSearchChange.bind(this)} />
                <div className="quote-req-list">
                    <TableListHeader headerObj={workerProjectTH} />

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
                                            <label className={"badge " + statusColorClass(listitem.status)} >{listitem.status}</label>
                                        </div>
                                    </div>
                                ))}
                        </InfiniteScroll>
                    </div>
                </div>
            </div>
            </React.Fragment>
        );
    }
    getAllProjectList() {
        var tmpListitems = [];
        WorkerService.getAllProjects(this.state.pageNo).then(
            response => {
                if (response) {
                    if (response.data.currentPage !== 0) {
                        tmpListitems = [...this.state.listitems, ...response.data.projects];
                    } else {
                        tmpListitems = response.data.projects;
                    }
                    this.setState({
                        listitems: tmpListitems,
                        pageNo: this.state.pageNo + 1
                    });
                    if ((response.data.currentPage + 1) === response.data.totalPages) {
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
            editProjectPage: false
        });
    }

    
}
export default WorkerProjects;