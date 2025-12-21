import React, { useState } from 'react';
import './App.css';
import TableList from './pages/TableList';
import CreateTable from './pages/CreateTable';
import TableData from './pages/TableData';

function App() {
  const [currentPage, setCurrentPage] = useState('tableList');
  const [selectedTableId, setSelectedTableId] = useState(null);

  const navigateTo = (page, tableId = null) => {
    setCurrentPage(page);
    setSelectedTableId(tableId);
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>Verifi Master Data Management</h1>
        <nav>
          <button onClick={() => navigateTo('tableList')}>Table Overview</button>
          <button onClick={() => navigateTo('createTable')}>Create Table</button>
        </nav>
      </header>

      <main className="app-main">
        {currentPage === 'tableList' && <TableList onNavigate={navigateTo} />}
        {currentPage === 'createTable' && <CreateTable onNavigate={navigateTo} />}
        {currentPage === 'tableData' && <TableData tableId={selectedTableId} onNavigate={navigateTo} />}
      </main>
    </div>
  );
}

export default App;