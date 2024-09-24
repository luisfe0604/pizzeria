const pool = require('../helper/dbConfig');
const bcrypt = require('bcryptjs');

async function findByUsername(username) {
    try {
        const result = await pool.query(
            `SELECT * 
            FROM users 
            WHERE login = $1`,
            [username]
        );
        return result.rows[0];
    } catch (err) {
        console.error(`Erro ao buscar usuário com nome ${username}:`, err);
        throw err;
    }
}

async function createUser(username, password) {
    try {
        const hashedPassword = await bcrypt.hash(password, 5);

        const result = await pool.query(
            `INSERT INTO users (login, password) 
            VALUES ($1, $2) 
            RETURNING *`,
            [username, hashedPassword]
        );
        return result.rows[0]; 
    } catch (err) {
        console.error(`Erro ao criar usuário ${username}:`, err);
        throw err;
    }
}

module.exports = {
    findByUsername,
    createUser,
};
