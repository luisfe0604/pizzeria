const express = require('express')
const router = express.Router()
const Order = require('../model/order')
const totalValue = require('../util/getValue')

router.get('/',
    async (req, res) => {
        try {
            const orders = await Order.getAllOpenOrders();
            res.status(200).json(orders);
        } catch (err) {
            res.status(500).json({ error: 'Erro ao buscar pedidos' });
        }
    }
)

router.get('/:id',
    async (req, res) => {
        const id = parseInt(req.params.id);
        try {
            const order = await Order.getOrderById(id);
            if (order) {
                res.status(200).json(order);
            } else {
                res.status(404).json({ error: 'Pedido não encontrado' });
            }
        } catch (err) {
            res.status(500).json({ error: 'Erro ao buscar pedido' });
        }
    }
)

router.post('/',
    async (req, res) => {
        const { items, locale, client } = req.body;
        const total = await totalValue.getTotalValue(items)
        try {
            const newOrder = await Order.addOrder(items, locale, client, total);
            res.status(201).json(newOrder);
        } catch (err) {
            res.status(500).json({ error: 'Erro ao adicionar item ao menu'});
        }
    }
)

router.put('/:id',
    async (req, res) => {
        const id = parseInt(req.params.id);
        const { value } = req.body;
        try {
            const finishOrder = await Order.finishOrder(id, value);
            if (finishOrder) {
                res.status(200).json(finishOrder);
            } else {
                res.status(404).json({ error: 'Pedido não encontrado' });
            }
        } catch (err) {
            res.status(500).json({ error: 'Erro ao finalizar pedido' });
        }
    });

module.exports = router