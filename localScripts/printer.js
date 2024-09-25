const escpos = require('escpos');
escpos.USB = require('escpos-usb');
const WebSocket = require('ws');

const device = new escpos.USB();
const options = { encoding: "GB18030" }; 
const printer = new escpos.Printer(device, options);

const wsServerUrl = 'ws://endereco_do_servidor:3000'; 

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
                const itemNames = order.items.map(item => `\n- ${item.name}`).join('');

                const printData = `
                    Pedido: ${order.id}
                    Cliente: ${order.client}
                    Local: ${order.locale}
                    Valor Total: R$${order.total.toFixed(2)}
                    Itens: ${itemNames}
                `;

                device.open(function () {
                    printer
                        .text(printData)
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
