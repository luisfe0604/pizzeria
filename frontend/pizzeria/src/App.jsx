import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/sideBar';
import Login from './components/login'; // Importando o componente de Login
import Orders from './components/mainReport'; // Supondo que você tenha um componente de pedidos
import Menu from './components/menu'; // Supondo que você tenha um componente de pedidos
import MenuTable from './components/menuTable'; // Supondo que você tenha um componente de pedidos
import ReportTimestamp from './components/reportByTimestamp'; // Supondo que você tenha um componente de pedidos

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
