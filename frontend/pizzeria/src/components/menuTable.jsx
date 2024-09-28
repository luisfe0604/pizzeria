import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Button } from '@mui/material';
import '../App.css';

const MenuTable = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [newItem, setNewItem] = useState({ name: '', ingredients: '', value: '', active: true });
    const [editingItemId, setEditingItemId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchMenuItems();
    }, []);

    const fetchMenuItems = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:3000/menu/all', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setMenuItems(response.data.sort((a, b) => a.name.localeCompare(b.name))); 
        } catch (err) {
            console.error('Erro ao buscar itens do menu:', err);
            setError('Erro ao buscar itens do menu');
        } finally {
            setLoading(false);
        }
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/menu', newItem, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setNewItem({ name: '', ingredients: '', value: '', active: true }); 
            fetchMenuItems();
        } catch (err) {
            console.error('Erro ao adicionar item:', err);
            setError('Erro ao adicionar item');
        }
    };

    const handleEditClick = (item) => {
        setEditingItemId(item.id);
        setNewItem({ name: item.name, ingredients: item.ingredients, value: item.value, active: item.active });
    };

    const handleUpdateItem = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3000/menu/${editingItemId}`, newItem, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setEditingItemId(null);
            setNewItem({ name: '', ingredients: '', value: '', active: true });
            fetchMenuItems();
        } catch (err) {
            console.error('Erro ao atualizar item:', err);
            setError('Erro ao atualizar item');
        }
    };

    const handleToggleActive = async (item) => {
        const updatedItem = { ...item, active: !item.active }; 
        await axios.put(`http://localhost:3000/menu/${item.id}`, updatedItem, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        fetchMenuItems();
    };

    return (
        <div className="menu-table">
            <h2>Gerenciar Itens do Menu</h2>

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
                    label="Ingredientes"
                    variant="outlined"
                    value={newItem.ingredients}
                    onChange={(e) => setNewItem({ ...newItem, ingredients: e.target.value })}
                    required
                />
                <TextField
                    className="input-field"
                    label="Preço"
                    variant="outlined"
                    type="number"
                    value={newItem.value}
                    onChange={(e) => setNewItem({ ...newItem, value: e.target.value })}
                    required
                />
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
                                <TableCell>Ingredientes</TableCell>
                                <TableCell>Preço</TableCell>
                                <TableCell>Ativo</TableCell> {/* Nova coluna Ativo */}
                                <TableCell>Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {menuItems.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.ingredients}</TableCell>
                                    <TableCell>{item.value}</TableCell>
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

export default MenuTable;
