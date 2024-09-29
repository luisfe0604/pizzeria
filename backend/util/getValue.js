const Menu = require('../model/menu');

async function getTotalValue(ids) {
    const orders = await Promise.all(ids.map(async id => {
        const [name, size] = id.split('-');
        const menuItem = await Menu.getMenuItemByNameAndSize(name, size.toLowerCase());
        return menuItem ? menuItem.price : 0; 
    }));

    const totalValue = orders.reduce((accumulator, price) => {
        return accumulator + Number(price);
    }, 0);

    return totalValue;
}

module.exports = { getTotalValue };
