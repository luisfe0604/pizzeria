import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css';
import OrderCard from './orderCard';
import { TextField, Button } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const OrdersWithTimestamps = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startTimestamp, setStartTimestamp] = useState(null);
  const [endTimestamp, setEndTimestamp] = useState(null);
  const [totalValue, setTotalValue] = useState(0);

  const fetchOrders = async () => {
    try {
      setLoading(true); 

      const response = await axios.post('https://pizzeria-l6im.onrender.com/order/all', {
        startTimestamp: startTimestamp || new Date(new Date().setMinutes(new Date().getMinutes() - 1)),
        endTimestamp: endTimestamp || new Date(),
      });

      const pedidosAbertos = response.data;
      setOrders(pedidosAbertos);
      calculateTotalValue(pedidosAbertos);
    } catch (error) {
      console.log(error);
      setError('Erro ao carregar os pedidos: ' + (error.response?.data?.message || ''));
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalValue = (orders) => {
    const total = orders.reduce((sum, order) => {
      const value = Number(order.value) || 0; 
      return sum + value;
    }, 0);
    setTotalValue(total);
  };

  useEffect(() => {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
    const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();

    setStartTimestamp(startOfDay);
    setEndTimestamp(endOfDay);

    const socket = new WebSocket('ws://pizzeria-l6im.onrender.com/');

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

  const handleSearch = () => {
    if (startTimestamp && endTimestamp) {
      fetchOrders(); 
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
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            className='dateTime'
            label="Data de Início"
            value={startTimestamp}
            onChange={(newValue) => setStartTimestamp(newValue)}
            renderInput={(params) => <TextField {...params} />}
          />
          <DateTimePicker
            className='dateTime'
            label="Data de Fim"
            value={endTimestamp}
            onChange={(newValue) => setEndTimestamp(newValue)}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>

        <Button className='reportButton' variant="contained" onClick={handleSearch} style={{ marginLeft: '10px' }}>
          Buscar Pedidos
        </Button>
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
