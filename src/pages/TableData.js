import React, { useState, useEffect } from 'react';
import { tableDataService } from '../services/api';
import './TableData.css';

function TableData({ tableId, onNavigate }) {
  const [tableData, setTableData] = useState(null);
  const [rows, setRows] = useState([]);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editingData, setEditingData] = useState({});
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newRowData, setNewRowData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (tableId) {
      loadTableData();
    }
  }, [tableId]);

  const loadTableData = async () => {
    try {
      setLoading(true);
      const response = await tableDataService.getTableData(tableId);
      setTableData(response.data.tableMetadata);
      setRows(response.data.rows);
      setError(null);
    } catch (err) {
      setError('Failed to load table data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadJson = () => {
  const jsonData = JSON.stringify(rows, null, 2);
  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${tableData.tableName}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

  const startAddingRow = () => {
    const emptyRow = {};
    tableData.columns.forEach(col => {
      emptyRow[col.columnName] = col.dataType === 'BOOLEAN' ? false : '';
    });
    setNewRowData(emptyRow);
    setIsAddingNew(true);
  };

  const cancelAddingRow = () => {
    setIsAddingNew(false);
    setNewRowData({});
  };

  const saveNewRow = async () => {
    try {
      await tableDataService.addRow(tableId, newRowData);
      setIsAddingNew(false);
      setNewRowData({});
      loadTableData();
    } catch (err) {
      alert('Failed to add row: ' + (err.response?.data?.message || err.message));
    }
  };

  const startEditingRow = (row) => {
    setEditingRowId(row.id);
    setEditingData({ ...row });
  };

  const cancelEditingRow = () => {
    setEditingRowId(null);
    setEditingData({});
  };

  const saveEditedRow = async () => {
    try {
      await tableDataService.updateRow(tableId, editingRowId, editingData);
      setEditingRowId(null);
      setEditingData({});
      loadTableData();
    } catch (err) {
      alert('Failed to update row: ' + (err.response?.data?.message || err.message));
    }
  };

  const deleteRow = async (rowId) => {
    if (window.confirm('Are you sure you want to delete this row?')) {
      try {
        await tableDataService.deleteRow(tableId, rowId);
        loadTableData();
      } catch (err) {
        alert('Failed to delete row: ' + err.message);
      }
    }
  };

  const updateNewRowData = (columnName, value) => {
    setNewRowData({ ...newRowData, [columnName]: value });
  };

  const updateEditingData = (columnName, value) => {
    setEditingData({ ...editingData, [columnName]: value });
  };

  const renderCellInput = (column, value, onChange) => {
    switch (column.dataType) {
      case 'BOOLEAN':
        return (
          <input
            type="checkbox"
            checked={value === true}
            onChange={(e) => onChange(column.columnName, e.target.checked)}
          />
        );
      case 'DATE':
        return (
          <input
            type="date"
            value={value || ''}
            onChange={(e) => onChange(column.columnName, e.target.value)}
          />
        );
      case 'INTEGER':
        return (
          <input
            type="number"
            step="1"
            value={value || ''}
            onChange={(e) => onChange(column.columnName, e.target.value)}
          />
        );
      case 'DECIMAL':
        return (
          <input
            type="number"
            step="0.01"
            value={value || ''}
            onChange={(e) => onChange(column.columnName, e.target.value)}
          />
        );
      default: // TEXT
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(column.columnName, e.target.value)}
          />
        );
    }
  };

  const renderCellValue = (column, value) => {
    if (column.dataType === 'BOOLEAN') {
      return value ? '✓' : '✗';
    }
    return value !== null && value !== undefined ? value.toString() : '';
  };

  if (loading) return <div className="loading">Loading table data...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!tableData) return <div className="error">Table not found</div>;

  return (
    <div className="table-data">
      <div className="table-header">
        <div>
          <h2>{tableData.tableName}</h2>
          {tableData.description && <p className="table-description">{tableData.description}</p>}
        </div>
        <button className="btn-back" onClick={() => onNavigate('tableList')}>
          ← Back to Tables
        </button>
      </div>

      <div className="table-actions">
        <button className="btn-add-row" onClick={startAddingRow} disabled={isAddingNew}>
          + Add Row
        </button>
        <button className="btn-download" onClick={downloadJson}>
          ↓ Download JSON
        </button>
      </div>

      <div className="table-container">
        <table className="data-grid">
          <thead>
            <tr>
              {tableData.columns.map((col) => (
                <th key={col.id}>
                  {col.columnName}
                  {col.required && <span className="required">*</span>}
                  <div className="column-type">{col.dataType}</div>
                </th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isAddingNew && (
              <tr className="editing-row">
                {tableData.columns.map((col) => (
                  <td key={col.id}>
                    {renderCellInput(col, newRowData[col.columnName], updateNewRowData)}
                  </td>
                ))}
                <td>
                  <button className="btn-save" onClick={saveNewRow}>Save</button>
                  <button className="btn-cancel-edit" onClick={cancelAddingRow}>Cancel</button>
                </td>
              </tr>
            )}

            {rows.map((row) => (
              <tr key={row.id} className={editingRowId === row.id ? 'editing-row' : ''}>
                {tableData.columns.map((col) => (
                  <td key={col.id}>
                    {editingRowId === row.id ? (
                      renderCellInput(col, editingData[col.columnName], updateEditingData)
                    ) : (
                      renderCellValue(col, row[col.columnName])
                    )}
                  </td>
                ))}
                <td>
                  {editingRowId === row.id ? (
                    <>
                      <button className="btn-save" onClick={saveEditedRow}>Save</button>
                      <button className="btn-cancel-edit" onClick={cancelEditingRow}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button className="btn-edit" onClick={() => startEditingRow(row)}>Edit</button>
                      <button className="btn-delete" onClick={() => deleteRow(row.id)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}

            {rows.length === 0 && !isAddingNew && (
              <tr>
                <td colSpan={tableData.columns.length + 1} className="no-data">
                  No data yet. Click "Add Row" to get started!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TableData;