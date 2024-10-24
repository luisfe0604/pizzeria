import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Button } from '@mui/material';
import '../App.css';

const MenuTable = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [newItem, setNewItem] = useState({ name: '', ingredients: '', P: '', M: '', G: '', B: '', active: true });
    const [editingItemId, setEditingItemId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchMenuItems();
    }, []);

    const fetchMenuItems = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://pizzeria-l6im.onrender.com/menu/all', {
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
            await axios.post('https://pizzeria-l6im.onrender.com/menu', newItem, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setNewItem({ name: '', ingredients: '', P: '', M: '', G: '', B: '', active: true });
            fetchMenuItems();
        } catch (err) {
            console.error('Erro ao adicionar item:', err);
            setError('Erro ao adicionar item');
        }
    };

    const handleEditClick = (item) => {
        setEditingItemId(item.id);
        setNewItem({ name: item.name, ingredients: item.ingredients, P: item.p, M: item.m, G: item.g, B: item.b, active: item.active });

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const handleUpdateItem = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`https://pizzeria-l6im.onrender.com/menu/${editingItemId}`, newItem, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setEditingItemId(null);
            setNewItem({ name: '', ingredients: '', P: '', M: '', G: '', B: '', active: true });
            fetchMenuItems();
        } catch (err) {
            console.error('Erro ao atualizar item:', err);
            setError('Erro ao atualizar item');
        }
    };

    const handleToggleActive = async (item) => {
        const updatedItem = { name: item.name, ingredients: item.ingredients, P: item.p, M: item.m, G: item.g, B: item.b, active: !item.active };
        await axios.put(`https://pizzeria-l6im.onrender.com/menu/${item.id}`, updatedItem, {
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
                        label="P"
                        variant="outlined"
                        type="number"
                        value={newItem.P}
                        onChange={(e) => setNewItem({ ...newItem, P: e.target.value })}
                        required
                    />
                    <TextField
                        className="input-field"
                        label="M"
                        variant="outlined"
                        type="number"
                        value={newItem.M}
                        onChange={(e) => setNewItem({ ...newItem, M: e.target.value })}
                        required
                    />
                    <TextField
                        className="input-field"
                        label="G"
                        variant="outlined"
                        type="number"
                        value={newItem.G}
                        onChange={(e) => setNewItem({ ...newItem, G: e.target.value })}
                        required
                    />
                    <TextField
                        className="input-field"
                        label="B"
                        variant="outlined"
                        type="number"
                        value={newItem.B}
                        onChange={(e) => setNewItem({ ...newItem, B: e.target.value })}
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
                                <TableCell>P</TableCell>
                                <TableCell>M</TableCell>
                                <TableCell>G</TableCell>
                                <TableCell>B</TableCell>
                                <TableCell>Ativo</TableCell>
                                <TableCell>Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {menuItems.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.ingredients}</TableCell>
                                    <TableCell>{item.p}</TableCell>
                                    <TableCell>{item.m}</TableCell>
                                    <TableCell>{item.g}</TableCell>
                                    <TableCell>{item.b}</TableCell>
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
