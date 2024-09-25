const WebSocket = require('ws');

const wss = new WebSocket.Server({ noServer: true });

let connectedClients = [];

wss.on('connection', (ws) => {
    console.log('Novo cliente WebSocket conectado');
    connectedClients.push(ws);

    ws.on('close', () => {
        console.log('Cliente WebSocket desconectado');
        connectedClients = connectedClients.filter(client => client !== ws);
    });
});

const broadcastData = (data) => {
    connectedClients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
};

module.exports = { wss, broadcastData };
