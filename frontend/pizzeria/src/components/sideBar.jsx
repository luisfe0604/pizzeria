import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css'; 
import { Button } from '@mui/material';

const Sidebar = () => {
  const removeToken = () => {
    localStorage.removeItem('token');
  };
  return (
    <div className="sidebar">
      <h2>Menu</h2>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/orders">Pedidos</Link>
        </li>
        <li>
          <Link to="/menuTable">Itens</Link>
        </li>
        <li>
          <Link to="/reportTimestamp">Relatório</Link>
        </li>
      </ul>
        <Button variant="contained" onClick={removeToken} className='buttonRemove exit'>
        Sair
      </Button>
    </div>
  );
};

export default Sidebar;
