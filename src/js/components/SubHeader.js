import React from "react";

const SubHeader = ({ headerText, onSearchChange }) => (
    <div className="list-group-header section-header row">
        <div className="col-4">
            <span className="mb-1 underline">{headerText[0]}</span>
            <span className="mb-1 blue-color pl-2">{headerText[1]}</span>
        </div>
        <div className="col-8 text-right">
            <div className="has-search">
                <span className="fa fa-search form-control-feedback"></span>
                <input type="text" className="form-control search-box" placeholder="Search here..." onChange={onSearchChange} />
            </div>
        </div>
    </div>
);

export default SubHeader;