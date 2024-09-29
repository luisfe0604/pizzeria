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

async function getMenuItemByNameAndSize(name, size) {
  try {
    const query = `
      SELECT 
        CASE 
          WHEN $1 = 'p' THEN p
          WHEN $1 = 'm' THEN m
          WHEN $1 = 'g' THEN g
          WHEN $1 = 'b' THEN b
        END AS price
      FROM 
        menu 
      WHERE 
        name = $2;
    `;

    const result = await pool.query(query, [size.toLowerCase(), name]);
    return result.rows[0]; 
  } catch (err) {
    console.error(`Erro ao buscar item do menu com nome ${name} e tamanho ${size}:`, err);
    throw err; 
  }
}

async function addMenuItem(name, ingredients, P, M, G, B) {
  try {
    const result = await pool.query(
      `INSERT INTO menu 
      (name, ingredients, p, m, g, b, active) 
      VALUES ($1, $2, $3, $4, $5, $6, true) 
      RETURNING *`,
      [name, ingredients, P, M, G, B]
    );
    return result.rows[0];
  } catch (err) {
    console.error(`Erro ao adicionar item ao menu:`, err);
    throw err;
  }
}

async function updateMenuItem(id, name, ingredients, P, M, G, B, active) {
  try {
    const result = await pool.query(
      `UPDATE menu SET 
        name = $1, 
        ingredients = $2, 
        p = $3, 
        m = $4,
        g = $5,
        b = $6, 
        active = $7
       WHERE id = $8 
       RETURNING *`,
      [name, ingredients, P, M, G, B, active, id]
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
  getMenuItemByNameAndSize,
  addMenuItem,
  updateMenuItem,
};
