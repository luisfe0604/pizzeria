const Menu = require('../model/menu');
const Items = require('../model/items');

async function getTotalValue(ids) {
    const orders = await Promise.all(ids.map(async id => {
        const [names, size] = id.split('-');
        const itemNames = names.split('/');
        
        const prices = await Promise.all(itemNames.map(async name => {
            const menuItem = await Menu.getMenuItemByNameAndSize(name.trim(), size.toLowerCase());
            return menuItem ? (names.includes('/') ? menuItem.price / 2 : menuItem.price) : 0;
        }));

        return prices.reduce((acc, price) => acc + Number(price), 0);
    }));

    const totalValue = orders.reduce((accumulator, price) => {
        return accumulator + Number(price);
    }, 0);

    return totalValue;
}

async function getTotalItemsValue(otherItems) {
    const orders = await Promise.all(otherItems.map(async otherItem => {
        const [name, count] = otherItem.split('x');
        const itemName = name.trim();o
        const quantity = Number(count.trim());

        const menuItem = await Items.getMenuItemByName(itemName);

        return menuItem ? menuItem.price * quantity : 0;
    }));

    const totalValue = orders.reduce((accumulator, price) => accumulator + Number(price), 0);

    return totalValue;
}

module.exports = { getTotalValue, getTotalItemsValue };
