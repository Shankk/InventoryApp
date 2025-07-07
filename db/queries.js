const pool = require("./pool");

const allowedTables = ['games', 'genres', 'developers']; // whitelist for safety

const allowedColumns = {
  games:       ['id', 'title', 'release_date'],
  genres:      ['id', 'genre', 'description'],
  developers:  ['id', 'developer', 'founded_year']
};

async function getAllFromTable(tableName) {
  if (!allowedTables.includes(tableName)) {
    throw new Error(`Invalid table name: ${tableName}`);
  }

  const { rows } = await pool.query(`SELECT * FROM ${tableName}`);
  return rows;
}

async function insertItem(table, data) {
  if (!allowedTables.includes(table)) {
    throw new Error(`Invalid table name: ${table}`);
  }
  const colsAllowed = allowedColumns[table];

  // Keep only whitelisted columns that were actually supplied
  const cols = Object.keys(data).filter(c => colsAllowed.includes(c));
  if (cols.length === 0) {
    throw new Error('No valid columns to insert');
  }
  const values          = cols.map(c => data[c]);
  const placeholders    = cols.map((_, idx) => `$${idx + 1}`).join(', ');
  const columnListSql   = cols.join(', ');

  const sql = `
    INSERT INTO ${table} (${columnListSql})
    VALUES (${placeholders})
    RETURNING *;
  `;

  const { rows } = await pool.query(sql, values);
  return rows[0];
}

async function getItemFromTable(tableName,id) {
  if (!allowedTables.includes(tableName)) {
    throw new Error(`Invalid table name: ${tableName}`);
  }
  const { rows } = await pool.query(
    `SELECT * FROM ${tableName} WHERE id = $1 LIMIT 1`, [id]);
  return rows[0] ?? null;
}

async function updateItem(table, id, data) {
  if (!allowedTables.includes(table)) {
    throw new Error(`Invalid table name: ${table}`);
  }

  const colsAllowed = allowedColumns[table].filter(c => c !== 'id');
  const cols = Object.keys(data).filter(c => colsAllowed.includes(c));
  if (cols.length === 0) throw new Error('No valid columns to update');

  const setSql  = cols.map((col, i) => `${col} = $${i + 2}`).join(', ');
  const values  = [id, ...cols.map(col => data[col])];   // $1 = id, $2…$n = new values

  /*Execute query (id stays parameterised, table is whitelisted) */
  const sql = `
    UPDATE ${table}
       SET ${setSql}
     WHERE id = $1
     RETURNING *;
  `;
  const { rows } = await pool.query(sql, values);

  return rows[0] ?? null;      // null → not found
}

async function deleteItemPost(table,id) {
  if (!allowedTables.includes(table)) {
    throw new Error(`Invalid table name: ${table}`);
  }
  const { rows } = await pool.query(
    `DELETE FROM ${table}
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
  insertItem,
  updateItem,
  getItemFromTable,
  searchForGames,
  deleteItemPost,
  deleteAllGames
};