import React from "react";

const TableListHeader = ({ headerObj }) => {
  return (
    <div className="row mt-1 quote-req-header">
      {headerObj && headerObj.map((item, i) => {
        return (
          <div key={i} className="col-sm">
            <label>{item}</label>
          </div>
        )
      }
      )}
    </div>
  );
}
export default TableListHeader;