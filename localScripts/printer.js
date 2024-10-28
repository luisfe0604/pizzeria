const fs = require('fs');
const path = require('path');
const os = require('os'); // Importa o módulo os para obter o diretório temporário
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

            if (data.action === 'finish_order' || data.action === 'new_order') {
                const order = data.data;
                const itemNames = order.items.map((item, index) => `${item} - borda: ${order.borders[index] ? order.borders[index] : 'S/B'}`).join('\n');
                const other = order.other_items.join(', ');

                // Formatar os detalhes do pedido como string
                const orderDetails = `Pedido: ${order.id}\nCliente: ${order.client.trim()}\nLocal: ${order.locale.trim()}\nValor Total: R$ ${Number(order.value).toFixed(2).trim()}\nPizzas: \n${itemNames}\nOutros: \n${other}\n.\n.\n.\n.\n.\n.\n.\n.\n.\n${new Date().toLocaleString('pt-BR', { hour12: false }).replace(',', '')}`;

                // Caminho para salvar o arquivo na pasta temporária do sistema
                const filePath = path.join(os.tmpdir(), 'pedido.txt');

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
