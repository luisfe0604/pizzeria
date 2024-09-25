import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderForm = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [locale, setLocale] = useState('');
  const [client, setClient] = useState('');
  
  // Carregar itens do menu
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get('http://localhost:3000/menu'); // Rota para buscar os itens do menu
        setMenuItems(response.data);
      } catch (error) {
        console.error('Erro ao buscar itens do menu:', error);
      }
    };
    fetchMenuItems();
  }, []);

  // Lidar com a seleção de itens
  const toggleSelectItem = (item) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((i) => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  // Lidar com o envio do pedido
  const handleSubmit = async () => {
    try {
      const orderData = {
        items: selectedItems.map((item) => item.id), // IDs dos itens selecionados
        locale,
        client,
      };
      await axios.post('http://localhost:3000/order', orderData); // Rota para criar um pedido
      alert('Pedido realizado com sucesso!');
    } catch (error) {
      console.error('Erro ao realizar o pedido:', error);
    }
  };

  return (
    <div className="order-form">
      <h2>Realizar Pedido</h2>
      
      {/* Input para Locale */}
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
      
      {/* Input para Client */}
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

      {/* Lista de itens do menu */}
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

      {/* Botão para confirmar o pedido */}
      <button className="confirm-button" onClick={handleSubmit}>
        Confirmar Pedido
      </button>
    </div>
  );
};

export default OrderForm;
