const pool = require(`../helper/dbConfig`);

async function getAllMenuItemsActives() {
  try {
    const result = await pool.query(`SELECT * FROM menu WHERE active = true`);
    return result.rows; 
  } catch (err) {
    console.error(`Erro ao buscar itens do menu:`, err);
    throw err;
  }
}

async function getAllMenuItems() {
  try {
    const result = await pool.query(`SELECT * FROM menu`);
    return result.rows; 
  } catch (err) {
    console.error(`Erro ao buscar itens do menu:`, err);
    throw err;
  }
}

async function getMenuItemById(id) {
  try {
    const result = await pool.query(
        `SELECT * 
        FROM menu 
        WHERE id = $1`, 
        [id]
    );
    return result.rows[0]; 
  } catch (err) {
    console.error(`Erro ao buscar item do menu com ID ${id}:`, err);
    throw err;
  }
}

async function addMenuItem(name, ingredients, value) {
  try {
    const result = await pool.query(
      `INSERT INTO menu 
      (name, ingredients, value, active) 
      VALUES ($1, $2, $3, true) 
      RETURNING *`,
      [name, ingredients, value]
    );
    return result.rows[0];
  } catch (err) {
    console.error(`Erro ao adicionar item ao menu:`, err);
    throw err;
  }
}

async function updateMenuItem(id, name, ingredients, value, active) {
  try {
    const result = await pool.query(
      `UPDATE menu SET 
        name = $1, 
        ingredients = $2, 
        value = $3,  
        active = $4
       WHERE id = $5 
       RETURNING *`,
      [name, ingredients, value, active, id]
    );
    return result.rows[0];
  } catch (err) {
    console.error(`Erro ao atualizar item do menu com ID ${id}:`, err);
    throw err;
  }
}

module.exports = {
  getAllMenuItemsActives, 
  getAllMenuItems,
  getMenuItemById,
  addMenuItem,
  updateMenuItem,
};
