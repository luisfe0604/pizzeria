import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/sideBar';
import Login from './components/login'; 
import Orders from './components/mainReport'; 
import Menu from './components/menu'; 
import MenuTable from './components/menuTable'; 
import ReportTimestamp from './components/reportByTimestamp'; 

const App = () => {
  return (
    <Router>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ marginLeft: '250px', padding: '20px', width: '100%' }}>
          <Routes>
            <Route path="/" element={<Menu />} />
            <Route path="/login" element={<Login />} />
            <Route path="/orders" element={<Orders />} /> 
            <Route path="/menuTable" element={<MenuTable />} /> 
            <Route path="/reportTimestamp" element={<ReportTimestamp />} /> 
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
