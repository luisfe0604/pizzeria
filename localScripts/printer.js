const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

const wsServerUrl = 'wss://pizzeria-l6im.onrender.com/';

function connectWebSocket() {
    const ws = new WebSocket(wsServerUrl);

    ws.on('open', () => {
        console.log('Conectado ao servidor WebSocket');
    });

    ws.on('message', async (message) => {
        try {
            const data = JSON.parse(message);

            if (data.action === 'finish_order') {
                const order = data.data;
                const itemNames = order.items.join(', ');

                // Formatar os detalhes do pedido como string
                const orderDetails = `
                    Pedido: ${order.id}
                    Cliente: ${order.client.trim()}
                    Local: ${order.locale.trim()}
                    Total: R$ ${Number(order.value).toFixed(2).trim()}
                    Itens: ${itemNames}`;

                // Caminho para salvar o arquivo
                const filePath = path.join(__dirname, 'pedido.txt');

                // Salvar o documento como .txt
                fs.writeFileSync(filePath, orderDetails, 'utf8');

                console.log(`Arquivo criado: ${filePath}`);

                // Abrir o arquivo de acordo com o sistema operacional
                const openCommand = process.platform === 'win32' ? `start ${filePath}` :
                    process.platform === 'darwin' ? `open ${filePath}` : `xdg-open ${filePath}`;

                require('child_process').exec(openCommand, (err) => {
                    if (err) {
                        console.error('Erro ao abrir o arquivo:', err);
                    } else {
                        console.log('Arquivo aberto com sucesso!');
                    }
                });
            }
        } catch (error) {
            console.error('Erro ao processar mensagem WebSocket:', error);
        }
    });

    ws.on('close', () => {
        console.log('Conexão com o servidor WebSocket fechada, tentando reconectar...');
        setTimeout(connectWebSocket, 5000);
    });

    ws.on('error', (err) => {
        console.error('Erro de conexão WebSocket:', err);
        ws.close();
    });
}

connectWebSocket();
