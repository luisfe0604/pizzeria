const Menu = require('../model/menu')

async function getTotalValue(ids) {
    const orders = await Promise.all(ids.map(id => Menu.getMenuItemById(id)));

    const totalValue = orders.reduce((accumulator, order) => {
        return accumulator + (order.value || 0);
    }, 0);

    return totalValue
}

module.exports = { getTotalValue }