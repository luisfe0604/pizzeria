/*const escpos = require('escpos');
escpos.USB = require('escpos-usb');
const WebSocket = require('ws');

const device = new escpos.USB();
const options = { encoding: "GB18030" }; 
const printer = new escpos.Printer(device, options);

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

                const printData = `
                    Pedido: ${order.id}
                    Cliente: ${order.client}
                    Local: ${order.locale}
                    Valor Total: R$${order.value.toFixed(2)}
                    Itens: ${itemNames}
                `;

                device.open(async function () {
                    const logo = await escposImage.load(path.join(__dirname, 'image.png'));
                    printer
                        .text(printData)
                        .raster(logo)
                        .cut()
                        .close();
                });

                console.log(`Pedido ${order.id} impresso com sucesso!`);
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
*/
const WebSocket = require('ws');
const path = require('path');

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

                const printData = `
                    Pedido: ${order.id}
                    Cliente: ${order.client}
                    Local: ${order.locale}
                    Valor Total: R$${Number(order.value).toFixed(2)}
                    Itens: ${itemNames}
                `;

                // Simulação de carregamento de imagem
                const logoPath = path.join(__dirname, 'image.png');
                console.log(`Carregando imagem: ${logoPath}`);

                // Simular a "impressão" da imagem
                console.log('Simulando impressão da imagem logo.png');

                // Simular impressão do texto
                console.log("Simulação de impressão:\n", printData);
                console.log("Corte do papel simulado.\n");

                console.log(`Pedido ${order.id} impresso com sucesso (simulado)!`);
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
