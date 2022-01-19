import React, { Component } from 'react';

class BreadCrumb extends Component {
    render() {
        return (
            <React.Fragment>
                <nav aria-label="breadcrumb">
                    <ul class="breadcrumb">
                        <li class="breadcrumb-item" onClick={this.props.handleBreadCrumb}>
                            <span className="mb-1 underline">Manage</span>
                            <span className="mb-1 blue-color pl-2">Inventory</span>
                        </li>
                        <li class="breadcrumb-item active" aria-current="page">
                            <span className="mb-1">Edit</span>
                            <span className="mb-1 blue-color pl-2">Inventory</span>
                        </li>
                    </ul>
                </nav>
            </React.Fragment>
        );
    }
}
export default BreadCrumb;