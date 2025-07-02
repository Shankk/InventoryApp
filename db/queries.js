const pool = require("./pool");

async function getAllFromTable(tableName) {
  const allowedTables = ['games', 'genres', 'developers']; // whitelist for safety

  if (!allowedTables.includes(tableName)) {
    throw new Error(`Invalid table name: ${tableName}`);
  }

  const { rows } = await pool.query(`SELECT * FROM ${tableName}`);
  return rows;
}

async function insertGame(title, release) {
  await pool.query("INSERT INTO games (title, release_date) VALUES ($1,$2)", [title, release]);
}
async function insertGenre(genre, desc) {
  await pool.query("INSERT INTO genres (name, description) VALUES ($1,$2)", [genre, desc]);
}
async function insertDeveloper(developer, founded) {
  await pool.query("INSERT INTO developers (name, founded_year) VALUES ($1,$2)", [developer, founded]);
}

async function getItemFromTable(tableName,id) {
  const allowedTables = ['games', 'genres', 'developers']; // whitelist for safety
  if (!allowedTables.includes(tableName)) {
    throw new Error(`Invalid table name: ${tableName}`);
  }
  const { rows } = await pool.query(
    `SELECT * FROM ${tableName} WHERE id = $1 LIMIT 1`, [id]);
  return rows[0] ?? null;
}

async function postUpdateGame(id, title, release) {
  const { rows } = await pool.query(
    `UPDATE games
       SET title        = $2,
           release_date = $3
     WHERE id = $1
     RETURNING *`,
    [id, title, release]          // ← parameterised values (no SQL-injection risk)
  );

  return rows[0] ?? null;         // either the updated row or null
}

async function postDeleteGame(id) {
  const { rows } = await pool.query(
    `DELETE FROM games
      WHERE id = $1
      RETURNING *`,
    [id]                // ← parameterised → no SQL-injection risk
  );

  return rows[0] ?? null;  // row data if deleted, else null (not found)
}

async function searchForGames(search) {
  const base = 'SELECT game FROM games'
  let text = base;
  let params = [];
  if(search) {
    text += ' WHERE game ILIKE $1';
    params = [`%${search}%`];
  }
  text += ` ORDER BY game`;
  const {rows} = await pool.query(text,params);
  return rows;
}

async function deleteAllGames() {
  const {rows} = await pool.query("DELETE FROM games");
  return rows;
}

module.exports = {
  getAllFromTable,
  insertGame,
  insertGenre,
  insertDeveloper,
  getItemFromTable,
  postUpdateGame,
  searchForGames,
  postDeleteGame,
  deleteAllGames
};