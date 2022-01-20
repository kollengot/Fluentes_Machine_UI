import React from 'react';

import Header from '../components/Header';
import Footer from '../components/Footer';
import Slidebar from '../components/Sidebar';

import WorkerOperations from './WorkerOperations';
import WorkerProjects from './WorkerProjects';
import WorkerSchedule from './WorkerTimesheet';

class WorkerDashboard extends React.Component {
    state = {
        pageName: 1
    }
    switchPage(pageId) {
        this.setState({
            pageName: pageId
        });
    }

    render() {
        return (
            <React.Fragment>
                <Header />
                <div className="page-body row">
                    <Slidebar onClick={this.switchPage.bind(this)}></Slidebar>
                    {(() => {
                        switch (this.state.pageName) {
                            case 1:
                                return (
                                    <WorkerProjects></WorkerProjects>    
                                )
                            case 2:
                                return (
                                    <WorkerOperations></WorkerOperations>
                                )
                            case 3:
                                return(
                                    <WorkerSchedule></WorkerSchedule>    
                                )
                            default:
                                return (
                                    <WorkerSchedule></WorkerSchedule>
                                )
                        }

                    })()}

                </div>
                <Footer></Footer>
            </React.Fragment>
        )
    }
}

export default WorkerDashboard;