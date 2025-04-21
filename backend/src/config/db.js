require("dotenv").config();
const { Pool } = require("pg");
// // console.log("DB_USER:", process.env.DB_USER);
// // console.log("DB_PASSWORD:", process.env.DB_PASSWORD);

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: "Polako4!", 
  port: Number(process.env.DB_PORT),
});


module.exports = pool;
