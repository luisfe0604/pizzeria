const pool = require(`../helper/dbConfig`);

async function getAllOpenOrders() {
    try {
        const result = await pool.query(
            `SELECT * 
            FROM orders
            WHERE status = true`
        );
        return result.rows;
    } catch (err) {
        console.error(`Erro ao buscar pedidos:`, err);
        throw err;
    }
}

async function getOrderById(id) {
    try {
        const result = await pool.query(
            `SELECT * 
            FROM orders 
            WHERE id = $1`,
            [id]
        );
        return result.rows[0];
    } catch (err) {
        console.error(`Erro ao buscar item do menu com ID ${id}:`, err);
        throw err;
    }
}

async function getOrderByTimestamp(startTimestamp, endTimestamp) {
    try {
        const result = await pool.query(
            `SELECT * 
            FROM orders 
            WHERE start_timestamp BETWEEN $1 AND $2`,
            [startTimestamp, endTimestamp]
        );
        return result.rows;
    } catch (err) {
        console.error(`Erro ao buscar pedidos dentro do intervalo:`, err);
        throw err;
    }
}

async function addOrder(items, locale, client, totalValue, observations) {
    try {
        const result = await pool.query(
            `INSERT INTO orders 
            (locale, client, items, value, observations, status) 
            VALUES ($1, $2, $3, $4, $5, true) 
            RETURNING *`,
            [locale, client, items, totalValue, observations]
        );
        return result.rows[0];
    } catch (err) {
        console.error(`Erro ao fazer pedido:`, err);
        throw err;
    }
}

async function finishOrder(id, value) {
    try {
        const result = await pool.query(
            `UPDATE orders SET 
                value = $2, 
                end_timestamp = NOW(),
                status = false
            WHERE id = $1 
            RETURNING *`,
            [id, value]
        );
        return result.rows[0];
    } catch (err) {
        console.error(`Erro ao atualizar item do menu com ID ${id}:`, err);
        throw err;
    }
}

async function cleanOldOrders() {

    try {
        await pool.query( `
            DELETE FROM orders
            WHERE start_timestamp < NOW() - INTERVAL '6 months';
        `);

    } catch (err) {
        console.error('Erro ao limpar pedidos antigos:', err);
    } 
}

module.exports = {
    getAllOpenOrders,
    getOrderById,
    getOrderByTimestamp, 
    addOrder,
    finishOrder,
    cleanOldOrders
};
