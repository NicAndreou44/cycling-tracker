import dotenv from "dotenv";


dotenv.config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});


console.log("[DB CONFIG] USER:", process.env.DB_USER);
console.log("[DB CONFIG] PASSWORD:", process.env.DB_PASSWORD);
console.log("[DB CONFIG] HOST:", process.env.DB_HOST);
console.log("[DB CONFIG] NAME:", process.env.DB_NAME);
console.log("[DB CONFIG] PORT:", process.env.DB_PORT);

import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user:     process.env.DB_USER,
  host:     process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port:     Number(process.env.DB_PORT),
});

export default pool;
