import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Select, MenuItem, Button } from '@mui/material';
import '../App.css';

const itemsTable = () => {
    const [temsItems, setTemsItems] = useState([]);
    const [newItem, setNewItem] = useState({ name: '', value: '', type: '', active: true });
    const [editingItemId, setEditingItemId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTemsItems();
    }, []);

    const fetchTemsItems = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://pizzeria-l6im.onrender.com/items/all', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setTemsItems(response.data.sort((a, b) => a.name.localeCompare(b.name)));
        } catch (err) {
            console.error('Erro ao buscar itens:', err);
            setError('Erro ao buscar itens');
        } finally {
            setLoading(false);
        }
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://pizzeria-l6im.onrender.com/items', newItem, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setNewItem({ name: '', value: '', type: '', active: true });
            fetchTemsItems();
        } catch (err) {
            console.error('Erro ao adicionar item:', err);
            setError('Erro ao adicionar item');
        }
    };

    const handleEditClick = (item) => {
        setEditingItemId(item.id);
        setNewItem({ name: item.name, value: item.value, type: item.type, active: item.active });

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const handleUpdateItem = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`https://pizzeria-l6im.onrender.com/items/${editingItemId}`, newItem, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setEditingItemId(null);
            setNewItem({ name: '', value: '', type: '', active: true });
            fetchTemsItems();
        } catch (err) {
            console.error('Erro ao atualizar item:', err);
            setError('Erro ao atualizar item');
        }
    };

    const handleToggleActive = async (item) => {
        const updatedItem = { name: item.name, value: item.value, type: item.type, active: !item.active };
        await axios.put(`https://pizzeria-l6im.onrender.com/items/${item.id}`, updatedItem, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        fetchTemsItems();
    };

    return (
        <div className="menu-table">
            <h2>Gerenciar Itens </h2>

            <form className="menu-form" onSubmit={editingItemId ? handleUpdateItem : handleAddItem}>
                <TextField
                    className="input-field"
                    label="Nome"
                    variant="outlined"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    required
                />
                <TextField
                    className="input-field"
                    label="Valor"
                    variant="outlined"
                    type="number"
                    value={newItem.value}
                    onChange={(e) => setNewItem({ ...newItem, value: e.target.value })}
                    required
                />
                <Select
                    value={newItem.type}
                    className='pizza-selection'
                    onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
                  >
                    <MenuItem value="portion">Porção</MenuItem>
                    <MenuItem value="drink">Bebida</MenuItem>
                    <MenuItem value="allCanYouEat">Rodízio</MenuItem>
                  </Select>
                <Button className="submit-button" type="submit">
                    {editingItemId ? 'Atualizar Item' : 'Adicionar Item'}
                </Button>
            </form>

            {loading ? (
                <p>Carregando...</p>
            ) : (
                <TableContainer>
                    <Table className="order-table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Nome</TableCell>
                                <TableCell>Valor</TableCell>
                                <TableCell>Tipo</TableCell>
                                <TableCell>Ativo</TableCell>
                                <TableCell>Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {temsItems.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.value}</TableCell>
                                    <TableCell>{item.type}</TableCell>
                                    <TableCell>
                                        <Button onClick={() => handleToggleActive(item)}>
                                            {item.active ? 'Desativar' : 'Ativar'}
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <Button onClick={() => handleEditClick(item)}>Editar</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default itemsTable;
