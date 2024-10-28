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

async function getTotalItemsValue(other_items) {
    const orders = await Promise.all(other_items.map(async other_items => {
        const [name, count] = other_items.split('x ');
        const itemName = name.trim();
        const quantity = Number(count);
        const menuItem = await Items.getMenuItemByName(itemName);

        return menuItem ? menuItem.price * quantity : 0;
    }));

    const totalValue = orders.reduce((accumulator, price) => accumulator + Number(price), 0);

    return totalValue;
}

module.exports = { getTotalValue, getTotalItemsValue };
