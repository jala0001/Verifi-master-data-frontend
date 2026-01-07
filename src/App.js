import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './pages/Login';
import TableList from './pages/TableList';
import CreateTable from './pages/CreateTable';
import TableData from './pages/TableData';
import UserManagement from './pages/UserManagement';
import { getCurrentUser, removeToken, removeCurrentUser } from './services/api';
import logo from './assets/verifi-logo.png'; // Tilføj denne linje

function App() {
  const [currentPage, setCurrentPage] = useState('tableList');
  const [selectedTableId, setSelectedTableId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Tjek om bruger allerede er logget ind
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const navigateTo = (page, tableId = null) => {
    setCurrentPage(page);
    setSelectedTableId(tableId);
  };

  const handleLoginSuccess = (userData) => {
    setCurrentUser({
      username: userData.username,
      role: userData.role
    });
  };

  const handleLogout = () => {
    removeToken();
    removeCurrentUser();
    setCurrentUser(null);
    setCurrentPage('tableList');
  };

  // Hvis ikke logget ind, vis login side
  if (!currentUser) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Tjek om bruger er admin
  const isAdmin = currentUser.role === 'ADMIN';

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <img src={logo} alt="Verifi Logo" className="header-logo" />
          
          <div className="header-center">
            <div className="header-left">
              <h1>Verifi Master Data Management</h1>
              <span className="user-info">
                Logged in as: <strong>{currentUser.username}</strong> ({currentUser.role})
              </span>
            </div>
            
            <nav>
              <button onClick={() => navigateTo('tableList')}>Table Overview</button>
              {isAdmin && <button onClick={() => navigateTo('createTable')}>Create Table</button>}
              {isAdmin && <button onClick={() => navigateTo('userManagement')}>Users</button>}
              <button className="btn-logout" onClick={handleLogout}>Logout</button>
            </nav>
          </div>
        </div>
      </header>

      <main className="app-main">
        {currentPage === 'tableList' && <TableList onNavigate={navigateTo} isAdmin={isAdmin} />}
        {currentPage === 'createTable' && <CreateTable onNavigate={navigateTo} />}
        {currentPage === 'tableData' && <TableData tableId={selectedTableId} onNavigate={navigateTo} />}
        {currentPage === 'userManagement' && <UserManagement onNavigate={navigateTo} />}
      </main>
    </div>
  );
}

export default App;