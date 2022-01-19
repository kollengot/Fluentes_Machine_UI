import React from 'react';

import Header from '../components/Header';
import Footer from '../components/Footer';
import Slidebar from '../components/Sidebar';

import ManageQuote from './ManageQuote';
import ManageInventory from './ManageInventory';
import ManageOperations from './ManageOperations';
import ManageWorker from './ManageWorker';
import ManageProjects from './ManageProjects';
import ManageCustomer from './ManageCustomer';
import ManageInspections from './ManageInspections';

class AdminDashboard extends React.Component {
    constructor() {
        super();
        this.state = {
            pageName: 1
        }
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
                                    <ManageQuote></ManageQuote> 
                                )
                            case 2:
                                return (
                                    <ManageProjects></ManageProjects>
                                )
                            case 3:
                                return (
                                    <ManageOperations></ManageOperations>  
                                )
                            case 4:
                                return (
                                    <ManageInventory></ManageInventory>    
                                )
                            case 5:
                                return (
                                    <ManageWorker></ManageWorker>
                                )
                            case 6:
                                return (
                                    <ManageCustomer></ManageCustomer>
                                )
                            case 7:
                                return (
                                    <ManageInspections></ManageInspections>
                                )
                            default:
                                return (
                                    <ManageQuote></ManageQuote>
                                )
                        }

                    })()}

                </div>
                <Footer></Footer>
            </React.Fragment>
        )
    }
}

export default AdminDashboard;