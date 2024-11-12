import React from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const AgGridComponent = ({ rowData, columnDefs }) => {
  return (
    <div className="ag-theme-alpine w-full" style={{ height: "500px" }}>
      <AgGridReact rowData={rowData} columnDefs={columnDefs} />
    </div>
  );
};

export default AgGridComponent;
