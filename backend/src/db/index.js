const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "cycling_tracker",
  password: "Polako4!",
  port: 5432,
});

module.exports = pool;
