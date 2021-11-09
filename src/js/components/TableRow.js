import React from "react";

const TableRow = ({ type, listItem, reqQty,deleteBtn, isSelected, onreqQntyChange, onCheckboxChange, onDeleteRowClick, handleTableRowChange }) => {

  switch (type) {
    case 'tool':
      return (<tr key="inveRow">
        <td key="0">
          <input
            type="checkbox"
            name={listItem.id}
            checked={isSelected}
            onChange={onCheckboxChange}
          />
        </td>
        <td key="1" >{listItem.itemName}</td>
        <td key="2">{listItem.availability}</td>
        <td key="3">
        <input
            type="number" 
            defaultValue={listItem.cost}
            onChange={handleTableRowChange} 
            name="cost"
            id={listItem.id+"cost"}
          />
          </td>
       
        <td key="4" >
          <input
            type="number"
            name={listItem.id}
            defaultValue={reqQty}
            onChange={onreqQntyChange}
          />
        </td>

        

        {deleteBtn && <td key="5"><button name={listItem.id} className="btn delete-btn float-right mr-5" onClick={onDeleteRowClick}></button></td>}

      </tr>);
    case 'worker':
      return (<tr key="workerRow">
        <td key="6">
          <input
            type="checkbox"
            name={listItem.id}
            checked={isSelected}
            onChange={onCheckboxChange}
          />
        </td>
        <td key="7">{listItem.name}</td>
        <td key="8">{listItem.avail_per_day}</td>
        <td key="9">
        <input
            type="number" 
            defaultValue={listItem.cost_per_hr}
            onChange={handleTableRowChange} 
            name="cost_per_hr"
            id={listItem.id+"cost_per_hr"}
          />
          </td>
        <td key="10" >
          <input
            type="number"
            name={listItem.id}
            defaultValue={reqQty}
            onChange={onreqQntyChange}
          />
        </td>
        {deleteBtn &&  <td key="11"><button className="btn delete-btn float-right mr-5" onClick={onDeleteRowClick} ></button></td>}
      </tr>);
    default:
      return;
  }
}

export default TableRow;