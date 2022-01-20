import React, { Component } from 'react';
import { Table } from 'reactstrap';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import InfiniteScroll from 'react-infinite-scroller';
import TableRow from "../components/TableRow";
import TableHeader from "../components/TableHeader";
import AdminService from "../services/admin.service";
import MyAlert from "../components/MyAlert";

class ConfigureOperation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            listitems: [],
            toolList: [],
            workerList: [],
            selectedToolList: [],
            selectedWorkerList: [],
            showAlert: false,
            alertConfig: {
                "variant": "danger"
            },
            totalCost: 0,
            tabActiveKey: "tools",
            workerSearchValue: "",
            toolSearchValue: "",
            hasMoreTools: true,
            toolPageNo: 0,
            hasMoreWorkers: true,
            workerPageNo: 0
        }
        // this.getData();
        
    }
    componentDidMount() {
        this.getAllTools();
    }

    getData() {
        if (this.props.showTools) {
            this.getAllTools();
        }
        if (this.props.showWorkers) {
            this.getAllWorkers();
        }
    }

    getAllTools() {
        AdminService.getAllInventory(this.state.toolPageNo).then(
            response => {
                var tmpListitems = [...this.state.toolList, ...response.data.rows];
                this.setState({
                    toolList: tmpListitems,
                    toolPageNo: this.state.toolPageNo + 1
                });

                if (this.state.toolPageNo >= response.data.currentPage) {
                    this.setState({
                        hasMoreTools: false
                    });
                }
            },
            error => {
                console.log("Error");
            }
        );
    }

    getAllWorkers() {
        AdminService.getAllWorkers(this.state.workerPageNo).then(
            response => {
                var tmpListitems = [...this.state.workerList, ...response.data.rows];
                this.setState({
                    workerList: tmpListitems,
                    workerPageNo: this.state.workerPageNo + 1
                });

                if (this.state.workerPageNo >= response.data.currentPage) {
                    this.setState({
                        hasMoreWorkers: false
                    });
                }
            },
            error => {
                console.log("Error");
            }
        );
    }

    showAlertMessage(msg) {
        this.setState(prevState => ({
            alertConfig: {
                ...prevState.alertConfig,
                message: msg
            },
            showAlert: true
        }))
    }

    handleCheckboxChange = changeEvent => {
        const { name } = changeEvent.target;
        let obj = []; obj["Inventories"] = this.state.toolList.find(o => o.id == name);
        obj["req_quantity"] = this.state.toolList.find(o => o.id == name).req_quantity;

        if (!this.state.toolList.find(o => o.id == name).req_quantity) {
            this.showAlertMessage("Please add required quantity");
            changeEvent.target.checked = false;
        }
        else {

            this.setState({
                showAlert: false
            });
            if (changeEvent.target.checked) {
                this.state.selectedToolList.push(obj);
                var tmpCost = 0;
                if(obj.Inventories.editedCost) {
                    tmpCost = this.state.totalCost + (parseInt(obj.Inventories.editedCost) * parseInt(obj.Inventories.req_quantity));
                } else {
                    tmpCost = this.state.totalCost + (parseInt(obj.Inventories.cost) * parseInt(obj.Inventories.req_quantity));
                }
                 
                this.setState({
                    totalCost: tmpCost
                });
            } else {
                let tmpObj = this.state.selectedToolList.filter(item => item.id !== name);
                this.state.selectedToolList = tmpObj;


                var tmpCost = 0;
                if(obj.Inventories.editedCost) {
                    tmpCost = this.state.totalCost - (parseInt(obj.Inventories.editedCost) * parseInt(obj.Inventories.req_quantity));
                } else {
                    tmpCost = this.state.totalCost - (parseInt(obj.Inventories.cost) * parseInt(obj.Inventories.req_quantity));
                }
                this.setState({
                    totalCost: tmpCost
                });
            }
        }
    };

    handleWorkerCheckboxChange = changeEvent => {
        const { name } = changeEvent.target;
        let obj = []; obj["Workers"] = this.state.workerList.find(item => item.id == name);
        obj["total_hrs_req"] = this.state.workerList.find(item => item.id == name).total_hrs_req;

        if (!this.state.workerList.find(o => o.id == name).total_hrs_req) {
            this.showAlertMessage("Please add required hours");
            changeEvent.target.checked = false;
        }
        else {
            this.setState({
                showAlert: false
            });
            if (changeEvent.target.checked) {
                this.state.selectedWorkerList.push(obj)

                //var tmpCost = this.state.totalCost + (obj.Workers.cost_per_hr * obj.Workers.total_hrs_req);

                var tmpCost = 0;
                if(obj.Workers.editedCost) {
                    tmpCost = this.state.totalCost + (parseInt(obj.Workers.editedCost) * parseInt(obj.Workers.total_hrs_req));
                } else {
                    tmpCost = this.state.totalCost + (parseInt(obj.Workers.cost_per_hr) * parseInt(obj.Workers.total_hrs_req));
                }


                this.setState({
                    totalCost: tmpCost
                });

            } else {
                let tmpObj = this.state.selectedWorkerList.filter(item => item.id != name);
                this.state.selectedWorkerList = tmpObj;

                var tmpCost = 0;
                if(obj.Workers.editedCost) {
                    tmpCost = this.state.totalCost - (parseInt(obj.Workers.editedCost) * parseInt(obj.Workers.total_hrs_req));
                } else {
                    tmpCost = this.state.totalCost - (parseInt(obj.Workers.cost_per_hr) * parseInt(obj.Workers.total_hrs_req));
                }


                //var tmpCost = this.state.totalCost - (obj.Workers.cost_per_hr * obj.Workers.total_hrs_req);
                this.setState({
                    totalCost: tmpCost
                });
            }
        }
    };
    handleTableRowChange(event) {
        if (event.target.type === 'number') {
            event.target.value = Math.abs(event.target.value);
        }

        if(event.target.name === "cost") {
            var toolId = parseInt((event.target.id).replace((event.target.name),''));
            let obj = []; obj = this.state.toolList;
            if (obj.find(o => o.id == toolId)) {
                obj.find(o => o.id == toolId)['editedCost'] = event.target.value;
            }
            this.setState({
                toolList: obj
            });
        } 
        if(event.target.name === "cost_per_hr") {
            var workerId = parseInt((event.target.id).replace((event.target.name),''));
            let obj = []; obj = this.state.workerList;
            if (obj.find(o => o.id == workerId)) {
                obj.find(o => o.id == workerId)['editedCost'] = event.target.value;
            }
            this.setState({
                workerList: obj
            });
        }
        
    }

    reqQntyChange = changeEvent => {
        if (changeEvent.target.type === 'number') {
            changeEvent.target.value = Math.abs(changeEvent.target.value);
        }
        const { name } = changeEvent.target;
        let obj = []; obj = this.state.toolList;
        let sObj = []; sObj = this.state.selectedToolList;
        if (obj.find(o => o.id == name)) {
            obj.find(o => o.id == name)['req_quantity'] = changeEvent.target.value;
        }
        if (sObj.find(o => o.Inventories.id == name)) {
            sObj.find(o => o.Inventories.id == name)['req_quantity'] = changeEvent.target.value;
        }
        this.setState({
            toolList: obj,
            selectedToolList: sObj
        });
    };
    reqHourChange = changeEvent => {
        if (changeEvent.target.type === 'number') {
            changeEvent.target.value = Math.abs(changeEvent.target.value);
        }
        const { name } = changeEvent.target;
        let obj = []; obj = this.state.workerList;
        let sObj = []; sObj = this.state.selectedWorkerList;
        if (obj.find(o => o.id == name)) {
            obj.find(o => o.id == name)['total_hrs_req'] = changeEvent.target.value;
        }
        if (sObj.find(o => o.Workers.id == name)) {
            sObj.find(o => o.Workers.id == name)['total_hrs_req'] = changeEvent.target.value;
        }
        this.setState({
            workerList: obj,
            selectedWorkerList: sObj
        });
    };

    createToolRow = option => (
        <TableRow
            type="tool"
            listItem={option}
            onCheckboxChange={this.handleCheckboxChange}
            onreqQntyChange={this.reqQntyChange}
            handleTableRowChange={this.handleTableRowChange.bind(this)}
        />
    );

    createWorkerCheckbox = option => (
        <TableRow
            type="worker"
            listItem={option}
            onCheckboxChange={this.handleWorkerCheckboxChange}
            onreqQntyChange={this.reqHourChange}
            handleTableRowChange={this.handleTableRowChange.bind(this)}
        />
    );
    createTableHeader = (type) => {
        var tableHeader = [];
        if (type === "tool") {
            tableHeader = ["inputCheckbox", "Tool Name", "Available Quantity", "Cost", "Required Quantity"];
            return (
                <TableHeader
                    headerObj={tableHeader}
                    onCheckboxChange={this.handleCheckboxChange}
                />
            );
        } else if ("worker") {
            tableHeader = ["inputCheckbox", "Worker Name", "Available per Day", "Cost per Hour", "Required Hours"];
            return (
                <TableHeader
                    headerObj={tableHeader}
                    onCheckboxChange={this.handleWorkerCheckboxChange}
                />
            );
        }
    };
    createToolList = () => (
        this.state.toolList.filter(item => item.itemName.toLowerCase().includes(this.state.toolSearchValue)).map(this.createToolRow)
    );
    createWorkerList = () => (
        this.state.workerList.filter(item => item.name.toLowerCase().includes(this.state.workerSearchValue)).map(this.createWorkerCheckbox)
    );
    saveConfigOperation(e) {
        var selectedObj = {};
        selectedObj['tools'] = this.state.selectedToolList;
        selectedObj['workers'] = this.state.selectedWorkerList;
        selectedObj['totalCost'] = this.state.totalCost;
        this.props.popupClose(selectedObj);
    };
    selectTab(key) {
        this.setState({
            tabActiveKey: key
        });
    };
    handleToolSearchChange(e) {
        this.setState({
            toolSearchValue: e.target.value.toLowerCase()
        });
    }
    handleWorkerSearchChange(e) {
        this.setState({
            workerSearchValue: e.target.value.toLowerCase()
        });
    }
    render() {
        return (
            <React.Fragment>


                <Tabs id="controlled-tab-example" activeKey={this.state.tabActiveKey} onSelect={this.selectTab.bind(this)} >
                    <Tab eventKey="tools" title="Tools">
                        {this.props.showTools && <div>
                            <span className="underline blue">Add Tools</span>
                            <div className="has-search mt-2">
                                <span className="fa fa-search form-control-feedback"></span>
                                <input type="text" className="form-control search-box" placeholder="Search Tools..." onChange={this.handleToolSearchChange.bind(this)} />
                            </div>

                            <Table responsive="sm" className="conf-table">
                                <tbody>
                                    <InfiniteScroll
                                        pageStart={0}
                                        loadMore={this.getAllTools.bind(this)}
                                        hasMore={this.state.hasMoreTools}
                                        loader={<div className="loader" key={0}>Loading ...</div>}
                                        useWindow={false}
                                    >
                                        {this.createTableHeader("tool")}
                                        {this.createToolList()}
                                    </InfiniteScroll>
                                </tbody>
                            </Table>
                        </div>
                        }
                    </Tab>
                    <Tab eventKey="workers" title="Workers">
                        {this.props.showWorkers &&
                            <div>
                                <span className="underline blue">Add Worker</span>
                                <div className="has-search mt-2">
                                    <span className="fa fa-search form-control-feedback"></span>
                                    <input type="text" className="form-control search-box" placeholder="Search Workers..." onChange={this.handleWorkerSearchChange.bind(this)} />
                                </div>
                                <Table responsive="sm" className="conf-table">
                                    <tbody>

                                        <InfiniteScroll
                                            pageStart={0}
                                            loadMore={this.getAllWorkers.bind(this)}
                                            hasMore={this.state.hasMoreWorkers}
                                            loader={<div className="loader" key={0}>Loading ...</div>}
                                            useWindow={false}
                                        >


                                            {this.createTableHeader("worker")}
                                            {this.createWorkerList()}


                                        </InfiniteScroll>


                                    </tbody>
                                </Table>

                            </div>
                        }

                    </Tab>

                </Tabs>







                <button onClick={this.saveConfigOperation.bind(this)} className="btn btn-success btn-sm" > Save </button>






                {this.state.showAlert && < MyAlert alertConfig={this.state.alertConfig} showAlert={this.state.showAlert} />}

            </React.Fragment>
        );

    }
}
export default ConfigureOperation;