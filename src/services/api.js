import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Table endpoints
export const tableService = {
  getAllTables: () => api.get('/tables'),
  getTableById: (id) => api.get(`/tables/${id}`),
  createTable: (data) => api.post('/tables', data),
  deleteTable: (id) => api.delete(`/tables/${id}`),
};

// Table data endpoints
export const tableDataService = {
  getTableData: (tableId) => api.get(`/tables/${tableId}/data`),
  addRow: (tableId, rowData) => api.post(`/tables/${tableId}/data`, rowData),
  updateRow: (tableId, rowId, rowData) => api.put(`/tables/${tableId}/data/${rowId}`, rowData),
  deleteRow: (tableId, rowId) => api.delete(`/tables/${tableId}/data/${rowId}`),
};

export default api;