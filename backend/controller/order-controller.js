const express = require('express');
const router = express.Router();
const Order = require('../model/order');
const totalValue = require('../util/getValue');
const authenticateToken = require('../helper/auth');
const { timestampSchema, idSchema, createOrderSchema, finishOrderSchema } = require('../validation/orderValidation');

module.exports = (broadcastData) => {
    router.get('/', async (req, res) => {

        try {
            const orders = await Order.getAllOpenOrders();
            res.status(200).json(orders);
        } catch (err) {
            res.status(500).json({ error: 'Erro ao buscar pedidos' });
        }

    });

    router.post('/all', async (req, res) => {
        const { error } = timestampSchema.validate(req.body);
        if (error) {
            console.log(error)
            return res.status(400).json({ error: error.details[0].message });
        }
        try {
            const { startTimestamp, endTimestamp } = req.body;
            Order.cleanOldOrders()
            const orders = await Order.getOrderByTimestamp(startTimestamp, endTimestamp);
            res.status(200).json(orders);
        } catch (err) {
            res.status(500).json({ error: 'Erro ao buscar pedidos' });
        }
    });

    router.get('/:id', async (req, res) => {
        const { error } = idSchema.validate({ id: req.params.id });
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
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
    });

    router.post('/', async (req, res) => {
        const { error } = createOrderSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const { items, locale, client, observations } = req.body;
        const total = await totalValue.getTotalValue(items);
        try {
            const newOrder = await Order.addOrder(items, locale, client, total, observations);
            broadcastData({ action: 'new_order', data: newOrder });

            res.status(201).json(newOrder);
        } catch (err) {
            res.status(500).json({ error: 'Erro ao adicionar item ao menu' });
        }
    });

    router.put('/:id', authenticateToken, async (req, res) => {
        const { error: idError } = idSchema.validate({ id: req.params.id });
        if (idError) {
            return res.status(400).json({ error: idError.details[0].message });
        }

        const { error: bodyError } = finishOrderSchema.validate(req.body);
        if (bodyError) {
            return res.status(400).json({ error: bodyError.details[0].message });
        }
        const id = parseInt(req.params.id);
        const { value } = req.body;
        try {
            const finishOrder = await Order.finishOrder(id, value);
            if (finishOrder) {
                broadcastData({ action: 'finish_order', data: finishOrder });
                res.status(200).json(finishOrder);
            } else {
                res.status(404).json({ error: 'Pedido não encontrado' });
            }
        } catch (err) {
            res.status(500).json({ error: 'Erro ao finalizar pedido' });
        }
    });

    return router;
};
