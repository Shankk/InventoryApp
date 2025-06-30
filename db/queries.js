const pool = require("./pool");

async function getAllGames() {
  const { rows } = await pool.query("SELECT * FROM games");
  return rows;
}
async function getAllGenres() {
  const { rows } = await pool.query("SELECT * FROM genres");
  return rows;
}
async function getAllDevelopers() {
  const { rows } = await pool.query("SELECT * FROM developers");
  return rows;
}
async function insertGame(game) {
  await pool.query("INSERT INTO games (game) VALUES ($1)", [game]);
}
async function insertGenre(genre) {
  await pool.query("INSERT INTO genres (genre) VALUES ($1)", [genre]);
}
async function insertDeveloper(developer) {
  await pool.query("INSERT INTO developers (developer) VALUES ($1)", [developer]);
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
  getAllGames,
  getAllGenres,
  getAllDevelopers,
  insertGame,
  insertGenre,
  insertDeveloper,
  searchForGames,
  deleteAllGames
};