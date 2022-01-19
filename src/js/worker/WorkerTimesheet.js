
import React, { Component } from 'react';
import { Input } from "reactstrap";
import WorkerService from "../services/worker.service";
import { ScheduleComponent, Day, Week, WorkWeek, Month, Agenda, Inject, Resize, DragAndDrop } from '@syncfusion/ej2-react-schedule';

class WorkerSchedule extends Component {

    constructor(props) {
        super(props);
        this.state = {
            listitems: [],
            workLog: [],
            currentProject: '',
            workHors: 8,
            hasMoreItems: true,
            pageNo: 0
        }
    }
    render() {
        return (
            <div className="col admin-list-page" id="operations-page">
                <ScheduleComponent
                    quickInfoTemplates={{
                        content: this.content.bind(this)
                    }} actionComplete={this.onActionComplete.bind(this)} eventSettings={{ dataSource: this.state.workLog }} >
                    <Inject
                        services={[Day, Week, WorkWeek, Month, Agenda, Resize, DragAndDrop]}
                    />
                </ScheduleComponent>
            </div>
        );
    }
    componentDidMount() {
        this.getAllProjectList();
        this.getLogData();
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
                    if ((response.data.currentPage + 1) == response.data.totalPages) {
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
    getLogData() {
        WorkerService.getLogData().then(
            response => {
                if (response) {
                    console.log(response);
                    /**
                     EndTime: Tue Dec 07 2021 17:00:00 GMT-0800 (Pacific Standard Time) {}
 Id: 1
 IsAllDay: false
 StartTime: Tue Dec 07 2021 09:00:00 GMT-0800 (Pacific Standard Time) {}
 Subject: "project 5"
                     */
                }
            },
            error => {
                console.log("Error");
            }
        );
    }
    handleProjectChange(event) {
        this.setState({
            currentProject: event.target.value
        });

    };
    handleChange(propertyName, event) {
        if (event.target.type === 'number') {
            event.target.value = Math.abs(event.target.value);
        }
        this.setState({
            workHors: event.target.value
        });
    }


    content(props) {
        return (
            <div>
                {props.elementType === "cell" ? (
                    <div className="">
                        <form className="e-schedule-form">

                            <div className="row">
                                <span className="col-4">Select projectname</span>
                                <select defaultValue={this.state.currentProject} className="form-control mb-2 mr-2 col-6 d-inline-block" onChange={this.handleProjectChange.bind(this)}>

                                    <option value="" >Select Project</option>

                                    {this.state.listitems && this.state.listitems.map((item, index) => (
                                        <option value={item.id} >{item.name}</option>
                                    ))}

                                </select>
                            </div>

                            <div className="row">
                                <span className="col-4">Total Hours Spent</span>
                                <Input defaultValue={this.state.workHors} className="col-6" type="number" onChange={this.handleChange.bind(this, 'totalHoursSpent')} />
                            </div>

                        </form>
                    </div>
                ) : (
                    <div className="e-event-content e-template">
                        <div className="e-subject-wrap">
                            {props.Subject !== undefined ? (
                                <div className="subject">{props.Subject}</div>
                            ) : (
                                ""
                            )}
                            {props.Location !== undefined ? (
                                <div className="location">{props.Location}</div>
                            ) : (
                                ""
                            )}
                            {props.Description !== undefined ? (
                                <div className="description">{props.Description}</div>
                            ) : (
                                ""
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    }
    logWork() {
        console.log(this.state.workLog);
        var data = {
            "logDailyWork": [
                {
                    "logDate": new Date(),
                    "tag_workers_project_id": "42d9aab4-d4ff-47e3-9ad4-2ea41c3980c2",
                    "hoursSpent": 5
                }
            ]
        };
        WorkerService.logDailyWork(data).then(
            response => {
                if (response) {
                    console.log(response);
                }
            },
            error => {
                console.log("Error");
            }
        );
    }
    onActionComplete(args) {
        if (args.requestType === 'toolBarItemRendered') {
            // This block is execute after toolbarItem render
        }
        if (args.requestType === 'dateNavigate') {
            // This block is executed after previous and next navigation
        }
        if (args.requestType === 'viewNavigate') {
            // This block is execute after view navigation
        }
        if (args.requestType === 'eventCreated') {
            var workLog = this.state.workLog;
            var obj = this.state.listitems.find(o => o.id == this.state.currentProject);
            if (obj) {
                workLog[workLog.length - 1].Subject = obj.name;
                workLog[workLog.length - 1].StartTime.setHours(9, 0, 0, 0);
                workLog[workLog.length - 1].EndTime.setHours((9 + parseInt(this.state.workHors)), 0, 0, 0);
                workLog[workLog.length - 1].IsAllDay = false;
                this.setState({
                    workLog: workLog
                });
                this.logWork();
            }
        }
        if (args.requestType === 'eventChanged') {
            // This block is execute after an appointment change
        }
        if (args.requestType === 'eventRemoved') {
            // This block is execute after an appointment remove
        }
    }
}
export default WorkerSchedule;