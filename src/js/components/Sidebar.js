import React, { Component } from 'react';
class Sidebar extends Component {

    constructor(props) {
        super(props); 
        this.state = {
            activeLink: 1,
            leftMenu: []
        } 
    }
    componentDidMount() {
        this.selectMenu();
    }
    selectMenu() {
        var adminFlag = JSON.parse(localStorage.getItem('user')).admin;
        var menu = [];
        if (adminFlag) {
            menu = [
                {
                    id: 1,
                    name: "Quotes",
                    className: "nav-quote-req" 
                },
                {
                    id: 2,
                    name: "Projects ",
                    className: "nav-projects "
                },
                {
                    id: 3,
                    name: "Operations",
                    className: "nav-operations"
                },
                {
                    id: 4,
                    name: "Inventory",
                    className: "nav-inventory"
                },
                {
                    id: 5,
                    name: "Worker",
                    className: "nav-workers"
                },
                {
                    id: 6,
                    name: "Customer",
                    className: "nav-customer"
                },
                {
                    id: 7,
                    name: "Inspection",
                    className: "nav-inspection"
                }
            ];
           
        } else {
             menu = [
                {
                    id: 1,
                    name: "Projects ",
                    className: "nav-projects "
                },
                {
                    id: 2,
                    name: "Operations",
                    className: "nav-operations"
                },
                {
                    id: 3,
                    name: "Schedule",
                    className: "nav-schedule"
                }
            ];
        }
        this.setState({ leftMenu: menu });
    }
    selectMenuItem(id) {
        this.setState({ activeLink: id });
        this.props.onClick(id);
    }
    render() {
        const { leftMenu, activeLink } = this.state;
        return (
            <React.Fragment>
                    <div className="sidebar-div">
                        <ul className="nav flex-column">
                            {leftMenu && leftMenu.map(item => {
                                return (
                                    <li className={
                                        item.className +
                                        (item.id === activeLink ? " nav-item active_item" : " nav-item")
                                      } key = {item.id}>
                                        <p className="nav-link" data-toggle="tab" onClick={(e) => this.selectMenuItem(item.id)} >
                                            <span>{item.name}</span>
                                        </p>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
            </React.Fragment>
        );
    }
}
export default Sidebar;