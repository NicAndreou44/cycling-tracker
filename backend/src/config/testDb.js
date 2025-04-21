const { Pool } = require("pg");
require("dotenv").config({ path: __dirname + "/../../.env" }); 

console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_NAME:", process.env.DB_NAME);

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT)
});

pool.connect()
  .then(() => console.log("✅ Connected successfully"))
  .catch((err) => console.error("❌ Connection Failed:", err));
