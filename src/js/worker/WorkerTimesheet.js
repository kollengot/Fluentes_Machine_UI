
import React, { Component } from 'react';

import { Button, Card, CardBody, CardGroup, Form, Input, InputGroup } from "reactstrap";
import WorkerService from "../services/worker.service";
import jsonData from "../../data/projectData.json";

import { ScheduleComponent, Day, Week, WorkWeek, Month, Agenda, Inject, Resize, DragAndDrop } from '@syncfusion/ej2-react-schedule';

class WorkerSchedule extends Component {
    state = {
        listitems: jsonData.projects,
        workLog: [{
            Id: 1,
            Subject: 'Meeting - 1',
            StartTime: new Date(2021, 6, 15, 10, 0),
            EndTime: new Date(2021, 6, 16, 12, 30),
            IsAllDay: false
        }, {
            Id: 2,
            Subject: 'Meeting - 2',
            StartTime: new Date(2021, 8, 15, 10, 0),
            EndTime: new Date(2021, 8, 16, 12, 30),
            IsAllDay: false
        }],
        currentProject: jsonData.projects[0].p_name,
        workHors: 8
    }
    constructor(props) {
        super(props);
        // this.getAllProjectList();
    }
    getAllProjectList() {
        WorkerService.getAllProjects().then(
            response => {
                this.setState({
                    listitems: response.data.projects
                });
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
                                    {this.state.listitems && this.state.listitems.map((item, index) => (
                                        <option value={item.p_name}>{item.p_name}</option>
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
    onActionComplete(args) {
        console.log(args);
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
            workLog[workLog.length - 1].Subject = this.state.currentProject;
            workLog[workLog.length - 1].StartTime.setHours(9, 0, 0, 0);
            workLog[workLog.length - 1].EndTime.setHours((9 + parseInt(this.state.workHors)), 0, 0, 0);
            workLog[workLog.length - 1].IsAllDay = false;
            this.setState({
                workLog: workLog
            });
        }
        if (args.requestType === 'eventChanged') {
            // This block is execute after an appointment change
        }
        if (args.requestType === 'eventRemoved') {
            // This block is execute after an appointment remove
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
}
export default WorkerSchedule;