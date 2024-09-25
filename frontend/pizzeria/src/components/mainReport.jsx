import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
      if (newOrder.action === 'new_order') {
        fetchOrders();
      }
      if (newOrder.action === 'finish_order') {
        fetchOrders(); 
      }
    };

    fetchOrders(); 

    return () => {
      socket.close();
    };
  }, []);

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
        <ul>
          {orders.map(order => (
            <li key={order.id}>
              <strong>Cliente:</strong> {order.client} <br />
              <strong>Detalhes:</strong> {order.items} <br />
              <strong>Data:</strong> {new Date(order.start_timestamp).toLocaleString()} <br />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Orders;
