import React, { Component } from 'react';
import S3 from 'react-aws-s3';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import UserService from "../services/user.service";

import Popup from "../components/Popup";

const today = new Date();
class QuoteDetail extends Component {
    state = {
        formInputList: this.props.dataFromParent.Measures,
        selectedItem: this.props.dataFromParent,
        measuresObjId: this.props.dataFromParent.Measures && this.props.dataFromParent.Measures.length,
        popupConfig: {},
        isPopupOpen: false
    }
    constructor(props) {
        super(props);
        let newMeasuresArray = this.state.selectedItem.Measures && this.state.selectedItem.Measures.map(function (item, index) {
            item.id = index + 1;
            return item;
        });
        let newObj = this.state.selectedItem;
        newObj.Measures = newMeasuresArray;
        this.setState({
            selectedItem: newObj
        })
    }
    handleFormChange(propertyName, event) {
        var item = this.state.selectedItem;
        item[propertyName] = event.target.value;
        this.setState({ selectedItem: item });
    }

    handleDateChange(propertyName, event) {
        var item = this.state.selectedItem;
        item[propertyName] = new Date(event);
        this.setState({ selectedItem: item });
    }

    handleMeasureChange(id, propertyName, event) {
        if(event.target.type === 'number') {
            event.target.value = Math.abs(event.target.value);
        }
        var tmpObj = this.state.selectedItem;
        tmpObj.Measures.find(o => o.id === id)[propertyName] = event.target.value;
        this.setState({ selectedItem: tmpObj });
    }

    newQuote() {
        this.props.parentCallback();
    }
    editQuote() {
        this.props.parentEditButtonCallBack();
    }
    deleteQuote() {
        UserService.deleteQuote(this.props.dataFromParent.id).then(
            response => {
                //this.props.parentEditCallBack(response.data);
                console.log(response);  
            },
            error => {
                console.log("Error");
            }
        );
    }
    saveQuote() {

        let newMeasuresArray = this.state.selectedItem.Measures.map(function(item) { 
            delete item.id; 
            return item; 
        });

        var data = {
            "title": this.state.selectedItem.title,
            "desc": this.state.selectedItem.desc,
            "Measures": newMeasuresArray,
            "startDate": this.state.selectedItem.startDate,
            "endDate": this.state.selectedItem.endDate,
            "Uploads": this.state.selectedItem.uploads
        };
        UserService.editQuote(this.props.dataFromParent.id, data).then(
            response => {
                this.props.parentEditCallBack(response.data);
                //console.log(response.data);
                
            },
            error => {
                console.log("Error");
            }
        );
    }
    handleBrowseFileInput(e) {
        const file = e.target.files[0];
        if (file) {
            const config = {
                bucketName: 'fuentes-fileupload',
                dirName: 'quote-attachments',
                region: 'us-west-1',
                accessKeyId: 'AKIA5ARA5MYMNVC47U6F',
                secretAccessKey: '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'
            }
            const ReactS3Client = new S3(config);
            const newFileName = file.name;

            ReactS3Client
                .uploadFile(file, newFileName)
                .then(data => {
                    var newUploads = {
                        "fileName": newFileName,
                        "filePath": data.location
                    };
                    var obj = this.state.selectedItem;

                    if (obj.uploads) {
                        obj['uploads'].push(newUploads);
                    } else {
                        obj['uploads'] = [];
                        obj['uploads'].push(newUploads);
                    }
                    this.setState({ selectedItem: obj });

                })
                .catch(err => console.error(err))

        }
    }

    addMeasuresClick() {
        let tmpObj = this.state.selectedItem;
        let tmpId = this.state.measuresObjId + 1;
        this.setState({ measuresObjId: tmpId });

        let measuresObj = {
            "id": tmpId,
            "name": "",
            "unit": "",
            "qty": ""
        };
        tmpObj.Measures = [...tmpObj.Measures, measuresObj];
        this.setState({ selectedItem: tmpObj });
    }

    handleRemoveClick(id, event) {
        
        var tmpObj = this.state.selectedItem;
        tmpObj.Measures = this.state.selectedItem.Measures.filter(o => o.id !== id);
        this.setState({ selectedItem: tmpObj }); 
    }
    handleClose = () => {
        this.setState({
            isPopupOpen: false
        });
    }
    removeUploadedImage(file) {


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
    renderUploadsSection(uploads) {
        if(uploads && uploads.length > 0){
        return (
           
                <div className="form-group">
                <span className="underline blue">Uploads</span>
                {uploads.map((item, index) => {
                    return (
                        <div className="row pb-2" >
                            <div className="col pl-0">
                                <button className="btn btn-link" onClick={() => this.showUploadImage(item.filePath)}>{item.fileName}</button>
                            </div>
                        </div>
                    )
                })
    
                }
            </div>
            
           
        
        
        
        );
            }
    }
    renderMeasurementsDetailSection(measures) {

        return (<div className="form-group">
            <span className="underline blue">Measurements</span>
            {measures &&
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
            }

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
            }
            )

            }
        </div>);
    }
    renderMeasurementsSection(measures) {

        return (<div className="form-group">
            <label>Measurements</label>
            <button className="btn add-btn" onClick={() => this.addMeasuresClick()}></button>

            {measures.length > 0 &&
                <div className="row">
                    <div className="col">
                        <label>Name</label>
                    </div>
                    <div className="col">
                        <label>Unit</label>
                    </div>
                    <div className="col-2">
                        <label>Quantity</label>
                    </div>
                    <div className="col-1">
                        <label></label>
                    </div>
                </div>
            }

            {measures && measures.map((item, index) => {
                return (
                    <div className="row pb-2" key={item.id}>
                        <div className="col">
                            <input type="text" className="form-control"
                                defaultValue={item.name}
                                onChange={this.handleMeasureChange.bind(this, item.id, 'name')}
                            />
                        </div>
                        <div className="col">

                            <input type="text" className="form-control"
                                defaultValue={item.unit}
                                autoComplete={'' + Math.random()}
                                onChange={this.handleMeasureChange.bind(this, item.id, 'unit')}
                            />
                        </div>
                        <div className="col-2">

                            <input type="number" className="form-control"
                                defaultValue={item.qty}
                                min="1" 
                                onChange={this.handleMeasureChange.bind(this, item.id, 'qty')}
                            />
                        </div>
                        <div className="col-1">
                            <button
                                className="btn measure-delete-btn "
                                onClick={this.handleRemoveClick.bind(this, item.id)}></button>
                        </div>
                    </div>
                )

            })

            }
        </div>);
    }

    renderEditQuote() {
        var selectedQuote = this.props.dataFromParent;
        if (selectedQuote) {
            return (
                <div className="blue-box-div">

                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input type="text" className="form-control" id="title"
                            defaultValue={selectedQuote.title}
                            onChange={this.handleFormChange.bind(this, 'title')}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea className="form-control" id="description" rows="3"
                            defaultValue={selectedQuote.desc}
                            onChange={this.handleFormChange.bind(this, 'desc')}
                        ></textarea>
                    </div>

                    <div className="form-group row">
                        <div className="col">
                            <label >Start Date</label>
                            <DatePicker
                                selected={new Date(selectedQuote.startDate)}
                                onChange={this.handleDateChange.bind(this, 'startDate')}
                                className="form-control"
                                minDate={today}
                            />
                        </div>
                        <div className="col">
                            <label >End Date</label>
                            <DatePicker
                                selected={new Date(selectedQuote.endDate)}
                                onChange={this.handleDateChange.bind(this, 'endDate')}
                                className="form-control"
                                minDate={new Date(selectedQuote.startDate)}
                            />
                        </div>
                    </div>

                    {this.renderMeasurementsSection(selectedQuote.Measures)}

                    <div className="form-group">
                        <label>Attachments</label>
                        <label className="btn btn-blue btn-sm pr-4 pl-4 ml-2">
                        Browse <input type="file" hidden onChange={this.handleBrowseFileInput.bind(this)} />
                        </label>

                        <div className="col-3 attachment-icon">
                            <small>{selectedQuote.Uploads && selectedQuote.Uploads.length}</small>
                            <small>Attachments</small>
                        </div>
                        <div className="row pb-2" >
                            {selectedQuote.Uploads && selectedQuote.Uploads.map((item, index) => {
                                return (
                                    <div className="">
                                        <button className="btn btn-link" onClick={() => this.showUploadImage(item.filePath)}>{item.fileName}</button>
                                        <button className="btn remove-btn" onClick={() => this.removeUploadedImage(item)}></button>
                                    </div>
                                )
                            })
                            }
                        </div>

                    </div>
                </div>
            )
        }
    }
    
    linkPOUrl(file){
        var data = {
            "submit_PO": file.location
        };
        UserService.savePOUrl(this.state.selectedItem.id, data).then(
            response => {
                
                this.setState({
                    isPopupOpen: true,
                    popupConfig: {
                        header: "Message",
                        body: response.data.message,
                        type: "message"
                    }
                });



            },
            error => {
                console.log("Error");
            }
        );
    }

    handleFileInput(e) {
        const file = e.target.files[0];
        if (file) {
            const config = {
                bucketName: 'fuentes-fileupload',
                dirName: 'purchase-order',
                region: 'us-west-1',
                accessKeyId: 'AKIA5ARA5MYMNVC47U6F',
                secretAccessKey: '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'
            }
            const ReactS3Client = new S3(config);
            const newFileName = 'test-file';

            ReactS3Client
                .uploadFile(file, newFileName)
                .then(data => {
                    this.linkPOUrl(data);
                    //TODO: Change status QUOTE_PO_SUBMIT
                    // Save var newfilePath = data.location;
                    
                })
                .catch(err => console.error(err))
        }
    }


    renderQuoteDetails() {
        if (this.props.dataFromParent) {
            return (
                <div className="blue-box-div">
                    <div>
                        <span className="underline blue">Title</span>
                        <p>{this.props.dataFromParent.title}</p>
                    </div>
                    <div>
                        <span className="underline blue">Description</span>
                        <p>{this.props.dataFromParent.desc}</p>
                    </div>

                    <div className="row">
                        
                        <div className="col">
                            <span className="underline blue mb-2">Submitted On</span>
                            <p>{(new Date(this.props.dataFromParent.createdAt)).toLocaleDateString()}</p>
                        </div>
                        <div className="col">
                            <span className="underline blue">Tentitive Start Date</span>
                            <p>{(new Date(this.props.dataFromParent.startDate)).toLocaleDateString()}</p>
                        </div>
                        <div className="col">
                            <span className="underline blue">Tentitive End Date</span>
                            <p>{(new Date(this.props.dataFromParent.endDate)).toLocaleDateString()}</p>
                        </div>
                    </div>
                    {this.renderUploadsSection(this.props.dataFromParent.Uploads)}

                    {this.props.dataFromParent.status === "QUOTE_RECEIVED" &&
                    <div className="purchase-order d-inline-block form-group">
                        <span className="underline blue mb-2">Order details</span>
                        <div className="row ml-2">
                            <div className="col-md-8">Operation Cost</div>
                            <div className="col-md-2">{this.props.dataFromParent.operationCostTotal}</div>
                            <div className="col-md-8">Inspection Amount</div>
                            <div className="col-md-2">{this.props.dataFromParent.inspectionTotal}</div>
                            <div className="col-md-8">Tax</div>
                            <div className="col-md-2">5%</div>
                            <div className="col-md-8">Sub Total</div>
                            <div className="col-md-2">{this.props.dataFromParent.total}</div>
                        </div>
                    </div>
                    
                }
                   

                   

                    <div className="d-inline-block">
                        
                        <div className="col pl-0">
                            <span className="underline blue mb-2">Status</span>
                            <p> {this.props.dataFromParent.status}

                                {this.props.dataFromParent.status === "QUOTE_RECEIVED" &&
                                    <label className="btn btn-green btn-sm pr-4 pl-4 ml-2">
                                        Submit P O <input type="file" hidden onChange={this.handleFileInput.bind(this)} />
                                    </label>
                                }

                            </p>
                        </div>
                    </div>


                    {this.renderMeasurementsDetailSection(this.props.dataFromParent.Measures)}
                </div>
                /*<div className="blue-box-div">
                    <div>
                        <span className="underline blue">Title</span>
                        <p>{this.props.dataFromParent.title}</p>
                    </div>
                    <div>
                        <span className="underline blue">Description</span>
                        <p>{this.props.dataFromParent.desc}</p>
                    </div>
                    <div className="row">
                        <div className="col-sm-4">
                            <span className="underline blue">Submitted On</span>
                            <p>{(new Date(this.props.dataFromParent.createdAt)).toLocaleDateString()}</p>
                        </div>
                        <div className="col-sm">
                            <span className="underline blue">Status</span>
                            <p> {this.props.dataFromParent.status}
                                <button type="button" className="btn btn-blue btn-sm pr-2 pl-2 mr-2 ml-2" >View</button>
                                <button type="button" className="btn btn-green btn-sm pr-2 pl-2" >Submit PO</button>
                            </p>
                        </div>

                    </div>
                    <div>
                        <span className="underline blue" >Measurements</span>
                    </div>

                    {this.renderMeasurementHeader()}
                    {this.props.dataFromParent.Measures && this.props.dataFromParent.Measures.map((x, i) => {
                        return (this.renderMeasurements(x, i));
                    })}

                    <div>
                        <span className="underline blue" >Attachments</span>

                        <div className="row mt-1">
                            {this.props.dataFromParent.Uploads && this.props.dataFromParent.Uploads.map((item) => {
                                return (
                                    <div className="col-sm">
                                        <span >{item['fileName']}</span>
                                    </div>
                                )
                            })}
                        </div>

                    </div>
                </div>*/

            );
        }
    }
    render() {
        return (
            <React.Fragment>
                <Popup popupConfig={this.state.popupConfig} openFlag={this.state.isPopupOpen} parentCloseCallback={this.handleClose} ></Popup>

                <div className="app flex-row align-items-center" >

                    <div className="list-group-header section-header row">
                        <div className="col">
                            <span className="mb-1 underline">Quote </span>
                            <span className="mb-1 blue-color pl-2"> Detail</span>
                        </div>
                        <div className="col text-right">
                            <button type="button" className="btn btn-blue btn-sm pr-4 pl-4" onClick={() => this.newQuote()}>New</button>


                            {this.props.isQuoteEditActive
                                ? <button type="button" className="btn btn-green btn-sm pr-4 pl-4 ml-2" onClick={() => this.saveQuote()}>Save</button>
                                : <div className="d-inline"><button type="button" className="btn btn-green btn-sm pr-4 pl-4 ml-2" onClick={() => this.editQuote()}>Edit</button>
                                <button type="button" className="btn btn-delete btn-sm pr-4 pl-4 ml-2" onClick={() => this.deleteQuote()} >Delete</button></div>
                            }

                        </div>
                    </div>

                    {this.props.isQuoteEditActive
                        ? this.renderEditQuote()
                        : this.renderQuoteDetails()
                    }

                </div>
            </React.Fragment>
        );
    }
}
export default QuoteDetail;




