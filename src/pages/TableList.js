import React, { useState, useEffect } from 'react';
import { tableService } from '../services/api';
import './TableList.css';

function TableList({ onNavigate }) {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = async () => {
    try {
      setLoading(true);
      const response = await tableService.getAllTables();
      setTables(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load tables: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, tableName) => {
    if (window.confirm(`Are you sure you want to delete table "${tableName}"?`)) {
      try {
        await tableService.deleteTable(id);
        loadTables(); // Reload list after delete
      } catch (err) {
        alert('Failed to delete table: ' + err.message);
      }
    }
  };

  if (loading) return <div className="loading">Loading tables...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="table-list">
      <h2>Tables</h2>
      
      {tables.length === 0 ? (
        <p className="no-tables">No tables created yet. Create your first table!</p>
      ) : (
        <table className="tables-grid">
          <thead>
            <tr>
              <th>Table Name</th>
              <th>Description</th>
              <th>Columns</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tables.map((table) => (
              <tr key={table.id}>
                <td><strong>{table.tableName}</strong></td>
                <td>{table.description || '-'}</td>
                <td>{table.columnCount}</td>
                <td>{new Date(table.createdAt).toLocaleDateString()}</td>
                <td>
                  <button 
                    className="btn-view"
                    onClick={() => onNavigate('tableData', table.id)}
                  >
                    View Data
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDelete(table.id, table.tableName)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TableList;