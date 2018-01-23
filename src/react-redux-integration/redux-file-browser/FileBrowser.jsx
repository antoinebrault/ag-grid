import React, {Component} from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import {AgGridReact} from "ag-grid-react";
import {actions} from './actions/fileActions.jsx'

import "ag-grid-enterprise";

import FileCellRenderer from './FileCellRenderer.jsx';

class FileBrowser extends Component {

  colDefs = [{field: "dateModified"}, {field: "size"}];

  autoGroupColumnDef = {
    headerName: "Files",
    rowDrag: true,
    sort: 'asc',
    width: 250,
    cellRendererParams: {
      suppressCount: true,
      innerRenderer: "fileCellRenderer"
    }
  };

  frameworkComponents = {
    fileCellRenderer: FileCellRenderer
  };

  render() {
    return (
      <div>
        <div style={{height: 500}} className="ag-theme-fresh">
          <AgGridReact
            columnDefs={this.colDefs}
            rowData={this.props.files}
            treeData={true}
            groupDefaultExpanded={-1}
            getDataPath={data => data.filePath}
            autoGroupColumnDef={this.autoGroupColumnDef}
            onGridReady={params => params.api.sizeColumnsToFit()}
            getContextMenuItems={this.getContextMenuItems}
            deltaRowDataMode={true}
            getRowNodeId={data => data.id}
            onRowDragEnd={this.onRowDragEnd}
            frameworkComponents={this.frameworkComponents}>
          </AgGridReact>
        </div>
      </div>
    )
  }

  onRowDragEnd = (event) => {
    if(event.overNode.data.file) return;

    let movingFilePath = event.node.data.filePath;
    let targetPath = event.overNode.data.filePath;

    this.props.actions.moveFiles(movingFilePath, targetPath);
  };

  getContextMenuItems = (params) => {
    if (!params.node) return [];
    let filePath = params.node.data ? params.node.data.filePath : [];

    let deleteItem = {
      name: "Delete",
      action: () => this.props.actions.deleteFiles(filePath)
    };

    let newItem = {
      name: "New",
      action: () => this.props.actions.newFile(filePath)
    };

    return params.node.data.file ? [deleteItem] : [newItem, deleteItem];
  };
}

const mapStateToProps = (state) => ({files: state.files});
const mapDispatchToProps = (dispatch) => ({actions: bindActionCreators(actions, dispatch)});

export default connect(mapStateToProps, mapDispatchToProps)(FileBrowser);