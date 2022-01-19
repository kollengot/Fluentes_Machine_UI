import React from "react";
const TableHeader = ({ headerObj, onCheckboxChange }) => {
  return (
    <tr className="green-text-color2" key="tableHeade">
      {headerObj && headerObj.map((item, i) => {
          if (item == "inputCheckbox") {
            return (
              <th key="0" >
                <input type="checkbox" name="selectAllTools" />
              </th>
            )
          } else {
            return (
              <th key={item}>{item}</th>
            )
          }
        }
      )}
    </tr>
  );
}
export default TableHeader;