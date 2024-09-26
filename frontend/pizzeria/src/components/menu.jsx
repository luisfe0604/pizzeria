import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const OrderForm = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [locale, setLocale] = useState('');
  const [client, setClient] = useState('');
  const [observations, setObservations] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get('http://localhost:3000/menu');
        setMenuItems(response.data);
      } catch (error) {
        console.error('Erro ao buscar itens do menu:', error);
      }
    };
    fetchMenuItems();
  }, []);

  const toggleSelectItem = (item) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((i) => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleSubmit = async () => {
    try {
      const orderData = {
        items: selectedItems.map((item) => item.id),
        locale,
        client,
        observations,
      };
      await axios.post('http://localhost:3000/order', orderData);
      setMessage({ text: 'Pedido realizado com sucesso!', type: 'success' });
      clearMessage();
    } catch (error) {
      console.error('Erro ao realizar o pedido:', error);
      setMessage({ text: 'Erro ao realizar o pedido.', type: 'error' });
      clearMessage(); 
    }
  };

  const clearMessage = () => {
    setTimeout(() => {
      setMessage({ text: '', type: '' });
    }, 3000);
  };

  return (
    <div className="order-form">
      <h2>Realizar Pedido</h2>

      <div className="input-group">
        <label htmlFor="locale">Local</label>
        <input
          type="text"
          id="locale"
          value={locale}
          onChange={(e) => setLocale(e.target.value)}
          placeholder="Digite o local"
          required
        />
      </div>

      <div className="input-group">
        <label htmlFor="client">Cliente</label>
        <input
          type="text"
          id="client"
          value={client}
          onChange={(e) => setClient(e.target.value)}
          placeholder="Digite o nome do cliente"
          required
        />
      </div>

      <div className="input-group">
        <label htmlFor="observations">Observações</label>
        <input
          type="text"
          id="observations"
          value={observations}
          onChange={(e) => setObservations(e.target.value)}
          placeholder="Digite suas observações"
        />
      </div>

      <ul className="menu-list">
        {menuItems.map((item) => (
          <li
            key={item.id}
            className={`menu-item ${selectedItems.includes(item) ? 'selected' : ''}`}
            onClick={() => toggleSelectItem(item)}
          >
            {item.name} <span>R${(Number(item.value) || 0).toFixed(2)}</span>
          </li>
        ))}
      </ul>

      <button className="confirm-button" onClick={handleSubmit}>
        Confirmar Pedido
      </button>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
    </div>
  );
};

export default OrderForm;
