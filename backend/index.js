const express = require('express');
const http = require('http');
const { wss, broadcastData } = require('./websocket/websocket'); 
const cron = require('node-cron');
const Order = require('./model/order');

const cors = require('cors');

const app = express();
app.use(cors());

const port = 3000;

const server = http.createServer(app);

server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});

app.use(express.json());

cron.schedule('0 0 * * *', async () => {
    console.log('Iniciando limpeza de pedidos antigos...');
    await Order.cleanOldOrders();
});

app.use('/', require('./controller/login-controller'));
app.use('/order', require('./controller/order-controller')(broadcastData));
app.use('/menu', require('./controller/menu-controller'));

server.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
