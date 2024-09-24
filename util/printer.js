const escpos = require('escpos');
const Menu = require('../model/menu'); 
const Order = require('../model/order');

escpos.USB = require('escpos-usb');

const printOrder = async (id) => {
    try {
        const order = await Order.getOrderById(id);

        if (!order) {
            throw new Error(`Pedido com ID ${id} não encontrado`);
        }

        const itemNamesPromises = order.items.map(async (itemId) => {
            const menuItem = await Menu.getMenuItemById(itemId); 
            return menuItem ? menuItem.name : `Item ${itemId} não encontrado`;
        });

        const itemNames = await Promise.all(itemNamesPromises);

        const device = new escpos.USB();
        const options = { encoding: "GB18030" };
        const printer = new escpos.Printer(device, options);

        const printData = `
            Pedido: ${order.id}
            Cliente: ${order.client}
            Local: ${order.locale}
            Valor Total: R$${order.total.toFixed(2)}
            Itens: ${itemNames.map(item => `\n- ${item}`).join('')}
        `;

        device.open(function () {
            printer
                .text(printData) 
                .cut()       
                .close();        
        });
    } catch (err) {
        console.error(`Erro ao imprimir pedido: ${err.message}`);
    }
};

module.exports = {
    printOrder
};
