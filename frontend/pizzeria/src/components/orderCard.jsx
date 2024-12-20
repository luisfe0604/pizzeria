import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css'; 

const OrderCard = ({ order, onFinish }) => {
  const [menuItems, setMenuItems] = useState([]); 
  const [value, setValue] = useState(order.value || ''); 

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get('https://pizzeria-l6im.onrender.com/menu');
      setMenuItems(response.data);
    } catch (error) {
      console.error('Erro ao buscar itens do cardápio:', error);
    }
  };

  const getOrderedItemsNames = () => {
    return order.items.map((item, index) => `${item} - borda: ${order.borders[index] ? order.borders[index] : 'S/B'}`).join(', ');
  };  

  const getOrderedOtherItemsNames = () => {
    return order.other_items ? order.other_items.map((item) => `${item}`).join(', ') : '';
  };  

  useEffect(() => {
    fetchMenuItems(); 
  }, []);

  const handleFinish = async () => {
    try {
      await axios.put(`https://pizzeria-l6im.onrender.com/order/${order.id}`, { value, status: false }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      });
      onFinish(order.id); 
    } catch (error) {
      console.error('Erro ao finalizar pedido:', error);
    }
  };

  return (
    <div className="order-card">
      <strong>Cliente:</strong> {order.client} <br />
      <strong>Pizzas Pedidas:</strong> {getOrderedItemsNames()} <br />
      <strong>Itens Pedidos:</strong> {getOrderedOtherItemsNames()} <br />
      <strong>Local:</strong> {order.locale} <br />
      <strong>Obs:</strong> {order.observations} <br />
      <strong>Data:</strong> {new Date(order.start_timestamp).toLocaleString()} <br />
      <strong>Valor:</strong>
      <input
        type="number"
        value={Number(value).toFixed(2)}
        onChange={(e) => setValue(e.target.value)} 
        placeholder="Valor do pedido"
        disabled={!order.status}
      />
      {order.status ? (
        <button onClick={handleFinish}>Finalizar Pedido</button>
      ) : (
        <span className="finished-message">Pedido finalizado</span>
      )}
    </div>
  );
};

export default OrderCard;
