const Menu = require('../model/menu');

async function getTotalValue(ids) {
    const orders = await Promise.all(ids.map(async id => {
        const [names, size] = id.split('-');
        const itemNames = names.split('/');
        
        const prices = await Promise.all(itemNames.map(async name => {
            const menuItem = await Menu.getMenuItemByNameAndSize(name.trim(), size.toLowerCase());
            return menuItem ? menuItem.price / 2 : 0;
        }));

        return prices.reduce((acc, price) => acc + Number(price), 0);
    }));

    const totalValue = orders.reduce((accumulator, price) => {
        return accumulator + Number(price);
    }, 0);

    return totalValue;
}
module.exports = { getTotalValue };
