import React, { Component } from 'react';
import S3 from 'react-aws-s3';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import UserService from "../services/user.service";
import Popup from "../components/Popup";

const today = new Date();
today.setDate(today.getDate() + 1);
class UserQuote extends Component {

    constructor(props) {
        super(props);
        this.state = {
            item: {},
            errors: {},
            measuresObjId: 1,
            reloadKey: 1,
            popupConfig: {},
            isPopupOpen: false
        }
        this.state.item['measures'] = [
            {
                "id": this.state.measuresObjId,
                "name": "",
                "unit": "",
                "qty": ""
            }
        ];
    }

    resetQuote() {
        var tmpObj = this.state.item;
        tmpObj.title = "";
        tmpObj.desc = "";
        tmpObj.startDate = "";
        tmpObj.endDate = "";
        tmpObj.measures = [
            {
                "id": this.state.measuresObjId,
                "name": "",
                "unit": "",
                "qty": ""
            }
        ];
        this.setState({ item: tmpObj,measuresObjId: 1,reloadKey:this.state.reloadKey+1 }); 
    }


    formValidation() {
        
        let errors = {};
        let isValid = true;
        
        if (!this.state.item.title) {
            isValid = false;
            errors["title"] = "Please enter Title";
        }
        if(!this.state.item.desc) {
            isValid = false;
            errors["desc"] = "Please enter Description";
        }
        if(!this.state.item.startDate) {
            isValid = false;
            errors["date"] = "Please enter start Date";
        }
        if(!this.state.item.endDate) {
            isValid = false;
            errors["date"] = "Please enter End Date";
        }
        this.setState({
            errors: errors
        });
        return isValid;

    }


    sendQuoteReq() {

        if(this.formValidation()) {
            
        let newMeasuresArray = this.state.item.measures.map(function (item) {
            delete item.id;
            return item;
        });

        var data = {
            "title": this.state.item.title,
            "desc": this.state.item.desc,
            "status": "NEW",
            "startDate": this.state.item.startDate,
            "endDate": this.state.item.endDate,
            "Measures": newMeasuresArray,
            "Uploads": this.state.item.uploads
        };
        UserService.createQuote(data).then(
            response => {
                this.props.parentCreateCallBack(response.data);
            },
            error => {
                console.log("Error");
            }
        );
        }

    }

    handleFileInput(e) {

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
                    var obj = this.state.item;

                    if (obj.uploads) {
                        obj['uploads'].push(newUploads);
                    } else {
                        obj['uploads'] = [];
                        obj['uploads'].push(newUploads);
                    }
                    this.setState({ item: obj });

                })
                .catch(err => console.error(err))

        }
    }

    handleFormChange(propertyName, event) {
        var item = this.state.item;
        item[propertyName] = event.target.value;
        this.setState({ item: item });
    }
    handleDateChange(propertyName, event) {
        var item = this.state.item;
        item[propertyName] = new Date(event);
        this.setState({ item: item });
    }
    handleMeasureChange(id, propertyName, event) {
        if(event.target.type === 'number') {
            event.target.value = Math.abs(event.target.value);
        }
        var tmpObj = this.state.item;
        tmpObj.measures.find(o => o.id === id)[propertyName] = event.target.value;
        this.setState({ item: tmpObj });
    }
    addMeasuresClick() {
        let tmpObj = this.state.item;
        let tmpId = this.state.measuresObjId + 1;
        this.setState({ measuresObjId: tmpId });

        let measuresObj = {
            "id": tmpId,
            "name": "",
            "unit": "",
            "qty": ""
        };
        tmpObj.measures = [...tmpObj.measures, measuresObj];
        this.setState({ item: tmpObj });
    }
    handleRemoveClick(id, event) {
        var tmpObj = this.state.item;
        tmpObj.measures = this.state.item.measures.filter(o => o.id !== id);
        this.setState({ item: tmpObj });
    }
    handleClose = () => {
        this.setState({
            isPopupOpen: false
        });
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
        return (
            <div className="app flex-row align-items-center">
                <div className="list-group-header section-header row">
                    <div className="col">
                        <span className="mb-1 underline">Send New </span>
                        <span className="mb-1 blue-color pl-2">Quote Request</span>
                    </div>
                    <div className="col text-right">
                        <button type="button" className="btn btn-blue btn-sm pr-4 pl-4" onClick={() => this.resetQuote()} >Reset</button>
                        <button type="button" className="btn btn-green btn-sm ml-2 pr-4 pl-4" onClick={() => this.sendQuoteReq()}>Send</button>
                    </div>
                </div>
                <div className="blue-box-div" id="create-quote-form" key={this.state.reloadKey}>

                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input type="text" className="form-control" id="title"
                            name="title"
                            defaultValue={this.state.item.title}
                            onChange={this.handleFormChange.bind(this, 'title')}
                        />
                        <div className="text-danger">{this.state.errors.title}</div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea className="form-control" id="description" rows="3"

                            defaultValue={this.state.item.desc}
                            onChange={this.handleFormChange.bind(this, 'desc')}

                        ></textarea>
                        <div className="text-danger">{this.state.errors.desc}</div>
                    </div>

                    <div className="form-group row">
                        <div className="col">
                            <label >Start Date</label>
                            <DatePicker
                                selected={this.state.item.startDate && this.state.item.startDate}
                                onChange={this.handleDateChange.bind(this, 'startDate')}
                                className="form-control"
                                minDate={today}
                            />
                        </div>
                        <div className="col">
                            <label >End Date</label>
                            <DatePicker
                                selected={this.state.item.endDate && this.state.item.endDate}
                                onChange={this.handleDateChange.bind(this, 'endDate')}
                                className="form-control"
                                minDate={this.state.item.startDate}
                            />
                        </div>
                        
                    </div>
                    <div className="text-danger">{this.state.errors.date}</div>

                    <div className="form-group">
                        <label>Measurements</label>
                        <button className="btn add-btn" onClick={() => this.addMeasuresClick()}></button>

                        {this.state.item.measures && this.state.item.measures.length > 0 &&
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

                        {this.state.item.measures && this.state.item.measures.map((item) => {
                            return (
                                <div className="row pb-2" key={item.id}>
                                    <div className="col">
                                        <input type="text" className="form-control" 
                                            defaultValue={item.name}
                                            onChange={this.handleMeasureChange.bind(this, item.id, 'name')}
                                        />
                                    </div>
                                    <div className="col">

                                        <input type="text" className="form-control" autoComplete={'' + Math.random()}
                                            defaultValue={item.unit}
                                            onChange={this.handleMeasureChange.bind(this, item.id, 'unit')}
                                        />
                                    </div>
                                    <div className="col-2">

                                        <input type="number" className="form-control"
                                            defaultValue={item.qty} min="1" 
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
                    </div>

                    <div>
                        <label>Attachments</label>
                        <label className="btn btn-blue btn-sm pr-4 pl-4 ml-2">
                            Browse <input type="file" hidden onChange={this.handleFileInput.bind(this)} />
                        </label>
                    </div>

                    {this.state.item.uploads && this.state.item.uploads.map((item, index) => {
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
                <Popup popupConfig={this.state.popupConfig} openFlag={this.state.isPopupOpen} parentCloseCallback={this.handleClose} ></Popup>
            </div>
            
        );
    }
}
export default UserQuote;
