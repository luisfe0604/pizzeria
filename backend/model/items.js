const pool = require(`../helper/dbConfig`);

async function getAllMenuItemsActives() {
  try {
    const result = await pool.query(`SELECT * FROM items WHERE active = true`);
    return result.rows;
  } catch (err) {
    console.error(`Erro ao buscar itens:`, err);
    throw err;
  }
}

async function getAllMenuItems() {
  try {
    const result = await pool.query(`SELECT * FROM items`);
    return result.rows;
  } catch (err) {
    console.error(`Erro ao buscar itens:`, err);
    throw err;
  }
}

async function getMenuItemById(id) {
  try {
    const result = await pool.query(
      `SELECT * 
        FROM items 
        WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  } catch (err) {
    console.error(`Erro ao buscar item com ID ${id}:`, err);
    throw err;
  }
}

async function getMenuItemByType(type) {
  try {
    const result = await pool.query(
      `SELECT * 
          FROM items 
          WHERE type = $1`,
      [type]
    );
    return result.rows;
  } catch (err) {
    console.error(`Erro ao buscar item com type ${type}:`, err);
    throw err;
  }
}

async function addMenuItem(name, value, type) {
  try {
    const result = await pool.query(
      `INSERT INTO items 
      (name, value, type, active) 
      VALUES ($1, $2, $3, true) 
      RETURNING *`,
      [name, value, type]
    );
    return result.rows[0];
  } catch (err) {
    console.error(`Erro ao adicionar item:`, err);
    throw err;
  }
}

async function getMenuItemByName(name) {
  try {
    const result = await pool.query(`
            SELECT value as price
            FROM items 
            WHERE name = $1;`,
    [name]
    );
    return result.rows[0];
  } catch (err) {
    console.error(`Erro ao buscar item do menu com nome ${name}:`, err);
    throw err;
  }
}

async function updateMenuItem(id, name, value, type, active) {
  try {
    const result = await pool.query(
      `UPDATE items SET 
        name = $1, 
        value = $2, 
        type = $3, 
        active = $4
       WHERE id = $5 
       RETURNING *`,
      [name, value, type, active, id]
    );
    return result.rows[0];
  } catch (err) {
    console.error(`Erro ao atualizar item com ID ${id}:`, err);
    throw err;
  }
}

module.exports = {
  getAllMenuItemsActives,
  getAllMenuItems,
  getMenuItemById,
  getMenuItemByType,
  getMenuItemByName,
  addMenuItem,
  updateMenuItem,
};
