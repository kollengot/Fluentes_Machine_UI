import React, { Component } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import UserService from "../services/user.service";

class QuoteList extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        //this.getAllQuotes();
    }
    

    state = {
        activeId : 0,
        searchValue: "",
        listitems: [],
        hasMoreItems: true,
        pageNo: 0

    }

    selectQuote(item) {
        this.props.parentCallback(item);
        this.setState({
            activeId:item.id
          });
    }

    getAllQuotes() {
        debugger;
        UserService.getAllQuotes(this.state.pageNo).then(
            response => {
                var tmpListitems = [];
                if(response.data.currentPage !== 0 ){
                    tmpListitems = [...this.state.listitems, ...response.data.rows];
                } else {
                    tmpListitems = response.data.rows;
                }
                
                this.setState({
                    listitems: tmpListitems,
                    pageNo: response.data.currentPage + 1
                });
                
                if(response.data.currentPage >= (response.data.totalPages-1)) {
                    this.setState({
                        hasMoreItems: false
                    });
                }
            },
            error => {
                console.log("Error");
            }
        );
    }


    handleChange(e) {
        this.setState({
            searchValue: e.target.value.toLowerCase()
        });
    }

    render() {
        return (
            <React.Fragment>

                <div className="list-group-header section-header row">
                    <div className="col-4">
                        <span className="mb-1 underline">My Quote</span>
                        <span className="mb-1 blue-color pl-2">Requests</span>
                    </div>
                    <div className="col-8">
                        <div className="has-search">
                            <span className="fa fa-search form-control-feedback"></span>
                            <input type="text" className="form-control search-box" onChange={this.handleChange} placeholder="Search quotes..." />
                        </div>
                    </div>
                </div>

                <div className="list-group" style={{maxHeight: (window.innerHeight - 200) + 'px'}}>



                <InfiniteScroll
                pageStart={0}
                loadMore={this.getAllQuotes.bind(this)}
                hasMore={this.state.hasMoreItems}
                loader={<div className="loader" key={0}>Loading ...</div>}
                useWindow={false}
            >


                    {this.state.listitems && this.state.listitems.filter(item =>
                        item.title.toLowerCase().includes(this.state.searchValue)).map(listitem => (

                            // eslint-disable-next-line jsx-a11y/anchor-is-valid
                            <a className={
                                (listitem.id === this.state.activeId ? " active list-group-item list-group-item-action" : "list-group-item list-group-item-action")
                              }
                            aria-current="true" key={listitem.id} id={listitem.id} onClick={() => this.selectQuote(listitem)} >
                                <div className="d-flex w-100 justify-content-between">
                                    <h5 className="mb-1 underline half">{listitem.title}</h5>

                                </div>
                                <p className="mb-1 ellipses_two">{listitem.desc}</p>
                                <div>
                                    {listitem.tools && listitem.tools.map(tool => (
                                        <span className="badge tool-badge">{tool}</span>
                                    )
                                    )}
                                </div>
                                <div className="row list-item-detail">
                                    <div className="col-2 calender-icon">
                                        <small>{(new Date(listitem.createdAt)).toLocaleDateString()}</small>
                                    </div>
                                    <div className="col-5 flag-icon">
                                        <small>{listitem.status}</small>
                                        <span className="date-badge badge">{(new Date(listitem.updatedAt)).toLocaleDateString()}</span>
                                    </div>

                                    <div className="col-3 attachment-icon">
                                        <small>{listitem.Uploads}</small>
                                        <small> Attachments</small>
                                    </div>
                                    <div className="col-2 rightarrow-icon">
                                        <small>View details</small>
                                    </div>
                                </div>
                            </a>

                        ))}

</InfiniteScroll>

                </div>

            </React.Fragment>
        );
    }
}
export default QuoteList;