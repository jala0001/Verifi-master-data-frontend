import React, { useState, useEffect } from 'react';
import { userService, getCurrentUser } from '../services/api';
import './UserManagement.css';

function UserManagement({ onNavigate }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    role: 'USER'
  });

  const currentUser = getCurrentUser();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers();
      setUsers(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load users: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    
    try {
      await userService.createUser(newUser);
      setShowCreateForm(false);
      setNewUser({ username: '', password: '', role: 'USER' });
      loadUsers();
    } catch (err) {
      alert('Failed to create user: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteUser = async (id, username) => {
    if (username === currentUser.username) {
      alert('You cannot delete yourself!');
      return;
    }

    if (window.confirm(`Are you sure you want to delete user "${username}"?`)) {
      try {
        await userService.deleteUser(id);
        loadUsers();
      } catch (err) {
        alert('Failed to delete user: ' + err.message);
      }
    }
  };

  const handleRoleChange = async (id, currentRole, username) => {
    if (username === currentUser.username) {
      alert('You cannot change your own role!');
      return;
    }

    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    
    try {
      await userService.updateUserRole(id, newRole);
      loadUsers();
    } catch (err) {
      alert('Failed to update role: ' + err.message);
    }
  };

  if (loading) return <div className="loading">Loading users...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="user-management">
      <div className="user-header">
        <h2>User Management</h2>
        <button className="btn-create-user" onClick={() => setShowCreateForm(!showCreateForm)}>
          {showCreateForm ? 'Cancel' : '+ Create User'}
        </button>
      </div>

      {showCreateForm && (
        <div className="create-user-form">
          <h3>Create New User</h3>
          <form onSubmit={handleCreateUser}>
            <div className="form-row">
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  required
                  minLength={3}
                />
              </div>
              
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  required
                  minLength={4}
                />
              </div>
              
              <div className="form-group">
                <label>Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
              
              <button type="submit" className="btn-submit-user">Create</button>
            </div>
          </form>
        </div>
      )}

      <table className="users-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Role</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <strong>{user.username}</strong>
                {user.username === currentUser.username && <span className="you-badge">You</span>}
              </td>
              <td>
                <span className={`role-badge ${user.role.toLowerCase()}`}>
                  {user.role}
                </span>
              </td>
              <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              <td>
                <button
                  className="btn-toggle-role"
                  onClick={() => handleRoleChange(user.id, user.role, user.username)}
                  disabled={user.username === currentUser.username}
                >
                  {user.role === 'ADMIN' ? 'Make User' : 'Make Admin'}
                </button>
                <button
                  className="btn-delete-user"
                  onClick={() => handleDeleteUser(user.id, user.username)}
                  disabled={user.username === currentUser.username}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserManagement;