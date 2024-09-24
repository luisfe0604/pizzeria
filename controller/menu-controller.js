const express = require('express')
const router = express.Router()
const Menu = require('../model/menu')

router.get('/',
    async (req, res) => {
        try {
            const menuItems = await Menu.getAllMenuItems();
            res.status(200).json(menuItems);
        } catch (err) {
            res.status(500).json({ error: 'Erro ao buscar itens do menu' });
        }
    }
)

router.get('/:id',
    async (req, res) => {
        const id = parseInt(req.params.id);
        try {
            const menuItem = await Menu.getMenuItemById(id);
            if (menuItem) {
                res.status(200).json(menuItem); // Retorna o item encontrado
            } else {
                res.status(404).json({ error: 'Item não encontrado' });
            }
        } catch (err) {
            res.status(500).json({ error: 'Erro ao buscar item do menu' });
        }
    }
)

router.post('/',
    async (req, res) => {
        const { name, ingredients, value } = req.body;
        try {
            const newItem = await Menu.addMenuItem(name, ingredients, value);
            res.status(201).json(newItem);
        } catch (err) {
            res.status(500).json({ error: 'Erro ao adicionar item ao menu' });
        }
    }
)

router.put('/:id',
    async (req, res) => {
        const id = parseInt(req.params.id);
        const { name, ingredients, value, active } = req.body;
        try {
            const updatedItem = await Menu.updateMenuItem(id, name, ingredients, value, active);
            if (updatedItem) {
                res.status(200).json(updatedItem); 
            } else {
                res.status(404).json({ error: 'Item não encontrado' });
            }
        } catch (err) {
            res.status(500).json({ error: 'Erro ao atualizar item do menu' });
        }
    });

module.exports = router