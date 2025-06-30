const { Pool } = require("pg");

// All of the following properties should be read from environment variables
// We're hardcoding them here for simplicity
module.exports = new Pool({
  host: process.env.DB_HOST, // or wherever the db is hosted
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT // The default port
  //connectionString: "postgresql://<role_name>:<role_password>@localhost:5432/top_users"
});