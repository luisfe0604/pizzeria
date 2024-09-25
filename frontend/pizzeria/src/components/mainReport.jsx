// Orders.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css'; 
import OrderCard from './orderCard'; 

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:3000/order'); 
      const pedidosAbertos = response.data; 
      setOrders(pedidosAbertos);
    } catch (error) {
      setError('Erro ao carregar os pedidos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3000/');

    socket.onmessage = (event) => {
      const newOrder = JSON.parse(event.data);
      if (newOrder.action === 'new_order' || newOrder.action === 'finish_order') {
        fetchOrders(); 
      }
    };

    fetchOrders(); 

    return () => {
      socket.close();
    };
  }, []);

  const handleFinishOrder = (orderId) => {
    setOrders((prevOrders) => prevOrders.filter(order => order.id !== orderId));
  };

  if (loading) {
    return <p>Carregando pedidos...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Pedidos em Andamento</h1>
      {orders.length === 0 ? (
        <p>Nenhum pedido em andamento.</p>
      ) : (
        <div className="orders-container">
          {orders.map(order => (
            <OrderCard key={order.id} order={order} onFinish={handleFinishOrder} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
