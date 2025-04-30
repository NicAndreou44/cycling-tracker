import pool from "../../db/index.js"; 




export const findUserByEmail = async (email: string) => {
  const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  return rows[0];
};


export const createUser = async (email: string, hashedPassword: string) => {
  const { rows } = await pool.query(
    "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id",
    [email, hashedPassword]
  );
  return rows[0];
};
