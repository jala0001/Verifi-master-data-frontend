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

// Auth endpoints
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
};

// User endpoints
export const userService = {
  getAllUsers: () => api.get('/users'),
  createUser: (data) => api.post('/users', data),
  deleteUser: (id) => api.delete(`/users/${id}`),
  updateUserRole: (id, role) => api.put(`/users/${id}/role`, null, { params: { role } }),
};

// Token helpers
export const getToken = () => localStorage.getItem('token');
export const setToken = (token) => localStorage.setItem('token', token);
export const removeToken = () => localStorage.removeItem('token');
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('currentUser');
  return userStr ? JSON.parse(userStr) : null;
};
export const setCurrentUser = (user) => localStorage.setItem('currentUser', JSON.stringify(user));
export const removeCurrentUser = () => localStorage.removeItem('currentUser');
export const isAuthenticated = () => !!getToken();

export default api;