import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css'; 
import OrderCard from './orderCard'; 

const OrdersWithTimestamps = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startTimestamp, setStartTimestamp] = useState('');
  const [endTimestamp, setEndTimestamp] = useState('');
  const [totalValue, setTotalValue] = useState(0);

  // Função para buscar pedidos da API
  const fetchOrders = async () => {
    try {
      setLoading(true); // Inicia o loading antes da chamada
      
      const response = await axios.post('http://localhost:3000/order/all', {
        startTimestamp: startTimestamp || new Date(new Date().setMinutes(new Date().getMinutes() - 1)), 
        endTimestamp: endTimestamp || new Date(),
      });

      const pedidosAbertos = response.data; 
      setOrders(pedidosAbertos);
      calculateTotalValue(pedidosAbertos); // Chama a função para calcular o total
    } catch (error) {
      console.log(error);
      setError('Erro ao carregar os pedidos: ' + (error.response?.data?.message || ''));
    } finally {
      setLoading(false);
    }
  };

  // Função para calcular o valor total dos pedidos
  const calculateTotalValue = (orders) => {
    const total = orders.reduce((sum, order) => {
      const value = Number(order.value) || 0; // Converte para número
      return sum + value;
    }, 0);
    setTotalValue(total);
  };

  // Efeito para gerenciar WebSocket e buscar pedidos inicialmente
  useEffect(() => {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
    const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();

    setStartTimestamp(startOfDay);
    setEndTimestamp(endOfDay);

    const socket = new WebSocket('ws://localhost:3000/');

    socket.onmessage = (event) => {
      const newOrder = JSON.parse(event.data);
      if (newOrder.action === 'new_order' || newOrder.action === 'finish_order') {
        fetchOrders(); 
      }
    };

    // Busca pedidos inicialmente
    fetchOrders(); 

    return () => {
      socket.close();
    };
  }, []); // Sem dependências para que não busque repetidamente

  // Função para finalizar um pedido
  const handleFinishOrder = (orderId) => {
    setOrders((prevOrders) => prevOrders.filter(order => order.id !== orderId));
  };

  // Função para realizar a busca com os timestamps
  const handleSearch = () => {
    if (startTimestamp && endTimestamp) {
      fetchOrders(); // Chama a função de busca com os novos timestamps
    } else {
      setError('Por favor, preencha ambos os campos de data.');
    }
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

      <div>
        <label>
          Data de Início:
          <input
            type="datetime-local"
            value={startTimestamp}
            onChange={(e) => setStartTimestamp(e.target.value)}
          />
        </label>

        <label>
          Data de Fim:
          <input
            type="datetime-local"
            value={endTimestamp}
            onChange={(e) => setEndTimestamp(e.target.value)}
          />
        </label>

        <button onClick={handleSearch}>Buscar Pedidos</button>
      </div>

      <h2>Valor Total: R$ {totalValue.toFixed(2)}</h2>

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

export default OrdersWithTimestamps;
