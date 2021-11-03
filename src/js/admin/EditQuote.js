import React, { Component } from 'react';
import { Table } from 'reactstrap';
import { Accordion, Card } from "react-bootstrap";

import { statusColorClass, headerBtn } from '../common/Utils.js';
import Popup from "../components/Popup";
import TableHeader from "../components/TableHeader";
import TableRow from "../components/TableRow";
import AdminService from "../services/admin.service";
import { validationMessages } from '../common/Constants';

class QuoteReqUpdate extends Component {
  state = {
    selectedItem: {},
    open: false,
    operationsList: [],
    tagoperationList: [],
    inspectionsList: [],
    selectedInspection: '',
    popupConfig: {},
    isPopupOpen: false,
    selectedOperationId: 0,
    configOpId: 0,
    totalCost: 0,
    taxCheckboxChecked: false
  }
  constructor(props) {
    super(props);
    this.getSingleQuote();
    this.getOperations();
    this.getInspections();
  }
  getOperations = () => {
    AdminService.getAllOperations().then(
      response => {
        if (response) {
          this.setState({
            tagoperationList: response.data.rows
          });
        }
      },
      error => {
        console.log("Error");
      }
    );
  };

  getInspections = () => {
    AdminService.getAllInspection().then(
      response => {
        if (response) {
          this.setState({
            inspectionsList: response.data.inspections.rows
          });
        }
      },
      error => {
        console.log("Error");
      }
    );
  };

  getSingleQuote = () => {
    AdminService.getSingleQuote(this.props.selectedQuoteId).then(
      response => {
        if (response) {
          this.setState({
            selectedItem: response.data
          });
        }
      },
      error => {
        console.log("Error");
      }
    );
  };
  resetReq() {

  }
  showAvailableTools(id) {
    this.setState({
      configOpId: id,
      selectedOperationId: id,
      isPopupOpen: true,
      popupConfig: {
        header: "Available Tools",
        body: '',
        type: "toolsList"
      }
    });
  }
  showAvailableWorker(id) {
    this.setState({
      configOpId: id,
      selectedOperationId: id,
      isPopupOpen: true,
      popupConfig: {
        header: "Available Workers",
        body: '',
        type: "workerList"
      }
    });
  }

  saveQuoteUpdate() {


    var tmptoolobj = [];
    this.state.operationsList.QuoteOperationInv && this.state.operationsList.QuoteOperationInv.map((item, i) => {
      var toolobj = {};
      toolobj["invId"] = item.Inventories.id;
      toolobj["reqQty"] = parseInt(item.req_quantity);
      tmptoolobj.push(toolobj);
    });


    var tmpworkerobj = [];
    this.state.operationsList.QuoteOperationWorker && this.state.operationsList.QuoteOperationWorker.map((item, i) => {
      var workerobj = {};
      workerobj["workerId"] = item.Workers.id;
      workerobj["totalHrs"] = parseInt(item.total_hrs_req);
      tmpworkerobj.push(workerobj);
    });


    var data = {
      "quoteId": this.state.selectedItem.id,
      "status": this.state.selectedItem.status,
      "tax": this.state.taxCheckboxChecked ? 1 : 0,
      "operations": [
        {
          "operationId": this.state.configOpId,
          "inspection": this.state.selectedInspection,
          "operation_total_hrs": this.state.operationsList.operation_total_hrs,
          "operation_cost": this.state.operationsList.operation_cost,
          "tools": tmptoolobj,
          "workers": tmpworkerobj
        }
      ]
    };
    debugger;
    AdminService.tagQuote(data).then(
      response => {
        
        if (response)
          this.showPopupMessage(response.data.message);
        else
          this.showPopupMessage("Something went wrong!");
      },
      error => {
        console.log("Error");
      }
    );


  }
  submitQuoteUpdate() {
    var data = {
      "status": "QUOTE_RECEIVED"
    };
    AdminService.changeStatus(this.state.selectedItem.id, data).then(
      response => {
        console.log(response);
        this.showPopupMessage(response.data.message);
      },
      error => {
        console.log("Error");
      }
    );
  }
  rejectQuote() {

    this.setState({
      isPopupOpen: true,
      popupConfig: {
        header: "Reject Quote",
        body: '',
        type: "rejectQuote"
      }
    });
  }
  changeQuoteToProject() {
    var data = {
      "name": this.state.selectedItem.title,
      "desc": this.state.selectedItem.desc,
      "startDate": this.state.selectedItem.endDate,
      "endDate": this.state.selectedItem.startDate
    };
    AdminService.convertToProject(this.state.selectedItem.id, data).then(
      response => {
        if (response.data)
          this.showPopupMessage(response.data.message);
      },
      error => {
        console.log("Error");
      }
    );
  }

  changeQuoteStatus(status, reasonTxt) {
    var data = {
      "status": status
    };
    if (status === "QUOTE_REJECTED") {
      data.reason = reasonTxt
    }
    AdminService.changeStatus(this.state.selectedItem.id, data).then(
      response => {
        if (response.data)
          this.showPopupMessage(response.data.message);
      },
      error => {
        console.log("Error");
      }
    );
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

  handleBreadCrumb() {
    this.props.parentCallback();
  }
  deleteOperation(opId, opName, event) {
    this.setState({
      deleteOpId: opId,
      isPopupOpen: true,
      popupConfig: {
        header: "Confirm to Delete",
        body: validationMessages.DELETE_CONFIRM + opName,
        type: "confirmation"
      }
    });


  }

  removeTool() {
    alert("Do you want to remove tool");
  }
  handleChange = e => {
    console.log(e);
  }

  onDeleteRowClick = event => {
    console.log(event.target.name);
  }




  handleReqAvailChange = event => {
    let { value, min, max } = event.target;
    value = Math.max(Number(min), Math.min(Number(max), Number(value)));
    this.setState({ value });
  }

  handleClose = (list) => {

    if (list && this.state.popupConfig.type === "configureOperation") {
      var obj = this.state.tagoperationList.find(o => o.id == this.state.configOpId);
      if (obj) {
        var QuoteOperation = {
          "Operations": {
            "id": obj.id,
            "name": obj.name,
            "desc": obj.desc
          },
          "QuoteOperationInv": list.tools,
          "QuoteOperationWorker": list.workers,
          "operation_cost": list.totalCost,
          "operation_total_hrs": list.workers.reduce((a, v) => a = parseInt(a) + parseInt(v.total_hrs_req), 0)
        };
        var newQuoteOperation = [...this.state.selectedItem.QuoteOperation, QuoteOperation];

        var selectedItem = this.state.selectedItem;
        selectedItem.QuoteOperation = newQuoteOperation;
        this.setState({
          operationsList: QuoteOperation
        });
        this.setState({
          selectedItem
        });
      }
    }
    else if (list && this.state.popupConfig.type === "toolsList") {
      console.log(this.state);
      debugger;
      var obj = this.state.selectedItem.QuoteOperation.find(o => o.Operations.id == this.state.configOpId);
      if (obj) {
        console.log(obj.QuoteOperationInv);
        var newInventryList = [...obj.QuoteOperationInv, list.tools];
        console.log(newInventryList);
      }
    } else if (list && this.state.popupConfig.type === "operationList") {
      /*var tmp = this.state.operationsList;
      tmp.push(list);
      this.setState({
        operationsList: tmp
      });*/
    }
    this.setState({
      isPopupOpen: false
    });

  };

  handleModalYes = (data) => {

    this.setState({
      isPopupOpen: false
    });


    if (this.state.popupConfig.type === "rejectQuote") {
      this.changeQuoteStatus("QUOTE_ADMIN_REJECTED", data);
    }

    else {
      var tempList = this.state.selectedItem.QuoteOperation.filter(item => item.Operations.id !== this.state.deleteOpId);
      var tmpSelectedItem = this.state.selectedItem;
      tmpSelectedItem.QuoteOperation = tempList;
      this.setState({
        selectedItem: tmpSelectedItem
      });
    }

    /*
    AdminService.deleteQuote(this.state.selectedItem.id).then(
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
    */


  };

  handleInspectionChange(event) {
    this.setState({
      selectedInspection: event.target.value
    });
    var data = {
      "inspectionId": event.target.value
    }
    AdminService.assignQuoteInspection(this.state.selectedItem.id, data).then(
      response => {
        this.showPopupMessage(response.data.message);
      },
      error => {
        console.log("Error");
      }
    );


  };

  handleOperationChange(event) {
    this.setState({
      configOpId: event.target.value
    });

    this.setState({
      isPopupOpen: true,
      popupConfig: {
        header: "Configure Operations",
        body: '',
        type: "configureOperation"
      }
    });

  };




  showOperationTools(inventory) {


    var tableHeader = ["inputCheckbox", "Tool Name", "Available Quantity", "Cost", "Required Quantity"];
    return (
      <Table responsive="sm">
        <tbody>
          <TableHeader
            headerObj={tableHeader}
            onCheckboxChange={this.handleChange}
          />
          {inventory && inventory.map((tool, i) => {
            return (<TableRow
              type="tool"
              listItem={tool.Inventories}
              reqQty={tool.req_quantity}
              deleteBtn={true}
              onDeleteRowClick={this.onDeleteRowClick}
            />);
          })
          }
        </tbody>
      </Table>
    );
  }

  showOperationWorkers(workers) {
    var tableHeader = ["inputCheckbox", "Worker Name", "Available per Day", "Cost per Hour", "Required Hour"];
    return (
      <Table responsive="sm">
        <tbody>
          <TableHeader
            headerObj={tableHeader}
            onCheckboxChange={this.handleChange}
          />
          {workers && workers.map((item, i) => {
            return (<TableRow
              type="worker"
              listItem={item.Workers}
              reqQty={item.total_hrs_req}
              deleteBtn={true}
              onDeleteRowClick={this.onDeleteRowClick}
            />);
          })
          }
        </tbody>
      </Table>
    );

  }
  getCost() {
    if (this.state.selectedItem.QuoteOperation) {
      var totalCost = (this.state.selectedItem.QuoteOperation.reduce((a, v) => a = parseInt(a) + parseInt(v.operation_cost), 0));
      if (this.state.taxCheckboxChecked) {
        totalCost = totalCost + totalCost * (5 / 100);
      }
      return (Number((totalCost).toFixed(2)));
    } else {
      return (0);
    }

  };

  handleTaxChange(evt) {
    this.setState({ taxCheckboxChecked: evt.target.checked });
    // assign tax to quote
  };

  

  renderMeasureTable() {
    var measures = this.state.selectedItem.Measures;
    return (<div className="quote-data-div">
      <span className="underline half blue">Measurements</span>

      <div className="row">
        <div className="col">
          <label>Name</label>
        </div>
        <div className="col">
          <label>Unit</label>
        </div>
        <div className="col">
          <label>Quantity</label>
        </div>
      </div>

      {measures && measures.map((item, index) => {
        return (
          <div className="row pb-2 green-text-color" key={item.id}>
            <div className="col">
              <label>{item.name}</label>
            </div>
            <div className="col">
              <label>{item.unit}</label>
            </div>
            <div className="col">
              <label>{item.qty}</label>
            </div>

          </div>
        )
      })
      }
    </div>);
  }
  removeUploadedImage(file) {

    /*
        const config = {
            bucketName: 'fuentes-fileupload',
            dirName: 'quote-attachments',
            region: 'us-west-1',
            accessKeyId: 'AKIA5ARA5MYMNVC47U6F',
            secretAccessKey: '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'
        }
       
       
        const ReactS3Client = new S3(config);
    
        const filename = file.fileName;
    
        ReactS3Client
            .deleteFile(filename)
            .then(response => console.log(response))
            .catch(err => console.error(err))
    
    
    */

  }
  showUploadImage(filePath) {
    this.setState({
      isPopupOpen: true,
      popupConfig: {
        header: "Uploaded Data",
        body: filePath,
        type: "image"
      }
    });
  }

  render() {

    var userData = {};
    var uploads = [];
    if (this.state.selectedItem) {
      userData = this.state.selectedItem.User;
      uploads = this.state.selectedItem.Uploads;
    }

    return (
      <React.Fragment>
        <Popup popupConfig={this.state.popupConfig} openFlag={this.state.isPopupOpen} parentCloseCallback={this.handleClose} parentConfirmCallback={this.handleModalYes.bind(this)}></Popup>
        <div className="col admin-quote-page">
          <div className="list-group-header section-header row">
            <div className="col-4">

              <nav aria-label="breadcrumb">
                <ul className="breadcrumb">
                  <li key="breadcrumb1" className="breadcrumb-item" onClick={this.handleBreadCrumb.bind(this)}>
                    <span className="mb-1 underline">Quote</span>
                    <span className="mb-1 blue-color pl-2">Requests</span>
                  </li>
                  <li key="breadcrumb2" className="breadcrumb-item active" aria-current="page">
                    <span className="mb-1">Update</span>
                    <span className="mb-1 blue-color pl-2">Quote</span>
                  </li>
                </ul>
              </nav>

            </div>



            {headerBtn(this.state.selectedItem.status) > 4 ? (<div className="col-8 text-right">
              <button type="button" className="btn btn-blue btn-sm pr-4 pl-4" onClick={() => this.rejectQuote()} >Reject</button>
              <button type="button" className="btn btn-green btn-sm ml-2 pr-4 pl-4" onClick={() => this.changeQuoteToProject()}>Accept Purchase Order</button>
            </div>) : (<div className="col-8 text-right">
              <button type="button" className="btn btn-blue btn-sm pr-4 pl-4" onClick={() => this.resetReq()} >Reset</button>
              <button type="button" className="btn btn-info btn-sm ml-2 pr-4 pl-4" onClick={() => this.saveQuoteUpdate()}>Save</button>
              <button type="button" className="btn btn-green btn-sm ml-2 pr-4 pl-4" onClick={() => this.submitQuoteUpdate()}>Submit</button>
            </div>)}


          </div>
          <div>
            <div className="blue-box-div row">
              <div className="col-3 white-border-right">
                <div className="quote-data-div">
                  <span className="underline half blue">Title</span>
                  <span className={"badge p-2 ml-2 float-right " + statusColorClass(this.state.selectedItem.status)}>
                  {this.state.selectedItem.status === "QUOTE_RECEIVED" ? "QUOTE_SUBMITTED" : this.state.selectedItem.status}
                    </span>
                  <p className="green-text-color">{this.state.selectedItem.title}</p>
                </div>

                <div className="quote-data-div">
                  <span className="underline half blue">Description</span>
                  <p className="green-text-color">{this.state.selectedItem.desc}</p>
                </div>

                <div className="quote-data-div">
                  <span className="underline half blue">Submitted By</span>
                  <p className="green-text-color">{userData && userData.name}</p>
                </div>

                <div className="quote-data-div">
                  <span className="underline half blue">Submitted On</span>
                  <p className="green-text-color">{(new Date(this.state.selectedItem.createdAt)).toLocaleDateString()}</p>
                </div>
                <div className="quote-data-div">
                  <span className="underline half blue">Attachments</span>

                  {uploads && uploads.map((item, index) => {
                    return (
                      <div className="">
                        <button className="btn btn-link p-0" onClick={() => this.showUploadImage(item.filePath)}>{item.fileName}</button>

                      </div>
                    )
                  })
                  }

                </div>
                {this.state.selectedItem.Measures &&
                  this.renderMeasureTable()
                }
              </div>


              {this.state.selectedItem.status === "PROJECT_IN_PROGRESS" || this.state.selectedItem.status === "QUOTE_PO_SUBMIT" ?

                <div className="col">
                  <span className="underline blue mb-2">Purchase Order</span>
                  <img src={this.state.selectedItem.submittedPO} className='po-img' alt='...'></img>

                </div>


                :

                (<div className="col quote-measurements">
                  <div className="row">
                    <div className="col-2">
                      <span className="underline blue">Make a Quote</span>
                    </div>
                    <div className="col text-right">


                      <select className="form-control btn-green mb-2 mr-2 col-4 d-inline-block" defaultValue={this.state.selectedItem.InspectionId} onChange={this.handleInspectionChange.bind(this)}>
                        <option>Add Inspection</option>
                        {this.state.inspectionsList && this.state.inspectionsList.map((item, index) => (
                          <option key={item.id} value={item.id}>{item.name}</option>
                        ))}
                      </select>


                      <select className="form-control btn-green mb-2 mr-2 col-4 d-inline-block" onChange={this.handleOperationChange.bind(this)}>
                        <option>Tag Operations</option>
                        {this.state.tagoperationList && this.state.tagoperationList.map((item, index) => (
                          <option key={item.id} value={item.id}>{item.name}</option>
                        ))}
                      </select>

                      Apply Tax <input type="checkbox" onChange={this.handleTaxChange.bind(this)}></input>
                      <span className="blue ml-4">Total Cost</span>
                      <span className="badge btn-blue p-2 ml-2">{this.getCost()}</span>
                    </div>
                  </div>

                  <div className="card-header measurements-header row mt-1 font-weight-bold">
                    <div className="col-sm">
                      <label>Operation</label>
                    </div>
                    <div className="col-sm">
                      <label >Description</label>
                    </div>
                    <div className="col-sm">
                      <label>Hours</label>
                    </div>
                    <div className="col-sm">
                      <label>Workers</label>
                    </div>

                    <div className="col-sm">
                      <label>Cost</label>
                    </div>
                    <div className="col-sm">
                      <label>Tools</label>
                    </div>

                  </div>

                  <Accordion>

                    {this.state.selectedItem.QuoteOperation && this.state.selectedItem.QuoteOperation.map((operation, i) => {
                      return (

                        <Card key={i + "cardKey"}>
                          <Accordion.Toggle as={Card.Header} eventKey={i + ""}>

                            <div className="row mt-1 green-text-color">
                              <div className="col-sm">
                                <label>{operation.Operations.name}</label>
                              </div>
                              <div className="col-sm">
                                <label className="acc-description">{operation.Operations.desc}</label>
                              </div>
                              <div className="col-sm">
                                <label>{operation.operation_total_hrs}</label>
                              </div>
                              <div className="col-sm">
                                <label>{operation.QuoteOperationWorker && operation.QuoteOperationWorker.length}</label>
                              </div>

                              <div className="col-sm">
                                <label>{operation.operation_cost}</label>
                              </div>
                              <div className="col-sm">
                                <label>{operation.QuoteOperationInv && operation.QuoteOperationInv.length}</label>
                                <button onClick={this.deleteOperation.bind(this, operation.Operations.id, operation.Operations.name)} className="btn delete-btn float-right mr-5" ></button>
                              </div>
                            </div>

                          </Accordion.Toggle>
                          <Accordion.Collapse eventKey={i + ""}>
                            <Card.Body>
                              {/* 
  <button type="button" className="btn btn-blue btn-sm ml-2 pr-4 pl-4" onClick={() => this.showAvailableTools(operation.Operations.id)}>Add Tools</button>
    <button type="button" className="btn btn-blue btn-sm ml-2 pr-4 pl-4" onClick={() => this.showAvailableWorker(operation.Operations.id)}>Add Workers</button>
                                                        
*/}
                              {operation.QuoteOperationInv.length > 0 && this.showOperationTools(operation.QuoteOperationInv)}
                              {operation.QuoteOperationWorker.length > 0 && this.showOperationWorkers(operation.QuoteOperationWorker)}
                            </Card.Body>
                          </Accordion.Collapse>
                        </Card>

                      );
                    })}
                  </Accordion>

                </div>)
              }

            </div>

          </div>

        </div>

      </React.Fragment>
    );
  }
}
export default QuoteReqUpdate;