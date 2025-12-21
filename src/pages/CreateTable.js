import React, { useState } from 'react';
import { tableService } from '../services/api';
import './CreateTable.css';

function CreateTable({ onNavigate }) {
  const [tableName, setTableName] = useState('');
  const [description, setDescription] = useState('');
  const [columns, setColumns] = useState([
    { columnName: '', dataType: 'TEXT', required: false }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addColumn = () => {
    setColumns([...columns, { columnName: '', dataType: 'TEXT', required: false }]);
  };

  const removeColumn = (index) => {
    const newColumns = columns.filter((_, i) => i !== index);
    setColumns(newColumns);
  };

  const updateColumn = (index, field, value) => {
    const newColumns = [...columns];
    newColumns[index][field] = value;
    setColumns(newColumns);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!tableName.trim()) {
      setError('Table name is required');
      return;
    }

    if (columns.some(col => !col.columnName.trim())) {
      setError('All columns must have a name');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await tableService.createTable({
        tableName: tableName.trim(),
        description: description.trim(),
        columns: columns
      });

      alert('Table created successfully!');
      onNavigate('tableList');
    } catch (err) {
      setError('Failed to create table: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-table">
      <h2>Create New Table</h2>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Table Name *</label>
          <input
            type="text"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            placeholder="e.g. Customers"
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description"
          />
        </div>

        <div className="columns-section">
          <h3>Columns</h3>
          
          {columns.map((column, index) => (
            <div key={index} className="column-row">
              <input
                type="text"
                placeholder="Column name"
                value={column.columnName}
                onChange={(e) => updateColumn(index, 'columnName', e.target.value)}
              />
              
              <select
                value={column.dataType}
                onChange={(e) => updateColumn(index, 'dataType', e.target.value)}
              >
                <option value="TEXT">TEXT</option>
                <option value="INTEGER">INTEGER</option>
                <option value="DECIMAL">DECIMAL</option>
                <option value="DATE">DATE</option>
                <option value="BOOLEAN">BOOLEAN</option>
              </select>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={column.required}
                  onChange={(e) => updateColumn(index, 'required', e.target.checked)}
                />
                Required
              </label>

              {columns.length > 1 && (
                <button
                  type="button"
                  className="btn-remove"
                  onClick={() => removeColumn(index)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}

          <button type="button" className="btn-add-column" onClick={addColumn}>
            + Add Column
          </button>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Table'}
          </button>
          <button type="button" className="btn-cancel" onClick={() => onNavigate('tableList')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateTable;