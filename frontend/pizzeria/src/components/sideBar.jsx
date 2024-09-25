import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css'; 

const Sidebar = () => {
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
    </div>
  );
};

export default Sidebar;
