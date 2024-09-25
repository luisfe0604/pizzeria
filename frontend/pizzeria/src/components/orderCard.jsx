import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css'; // Importar o CSS específico para o card, se necessário

const OrderCard = ({ order, onFinish }) => {
  const [menuItems, setMenuItems] = useState([]); // Armazena os itens do cardápio
  const [value, setValue] = useState(order.value || ''); // Inicializa com o valor atual do pedido

  // Função para buscar todos os itens do cardápio
  const fetchMenuItems = async () => {
    try {
      const response = await axios.get('http://localhost:3000/menu'); 
      
      setMenuItems(response.data); // Armazena os itens no estado
    } catch (error) {
      console.error('Erro ao buscar itens do cardápio:', error);
    }
  };

  // Função para buscar os nomes dos itens baseados nos IDs
  const getOrderedItemsNames = () => {
    const orderedItems = order.items.map(itemId => {
      const menuItem = menuItems.find(item => item.id === itemId);
      return menuItem ? menuItem.name : 'Item não encontrado';
    });
    return orderedItems.join(', '); // Retorna uma string com os nomes separados por vírgula
  };

  useEffect(() => {
    fetchMenuItems(); // Busca os itens do cardápio ao carregar o componente
  }, []);

  const handleFinish = async () => {
    try {
      await axios.put(`http://localhost:3000/order/${order.id}`, { value },{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    }); 
      onFinish(order.id); // Chama a função onFinish para atualizar a lista de pedidos
    } catch (error) {
      console.error('Erro ao finalizar pedido:', error);
    }
  };

  return (
    <div className="order-card">
      <strong>Cliente:</strong> {order.client} <br />
      <strong>Itens Pedidos:</strong> {getOrderedItemsNames()} <br />
      <strong>Data:</strong> {new Date(order.start_timestamp).toLocaleString()} <br />
      <strong>Valor:</strong>
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)} // Atualiza o valor do pedido
        placeholder="Valor do pedido"
      />
      <button onClick={handleFinish}>Finalizar Pedido</button>
    </div>
  );
};

export default OrderCard;
