import express from "express";
import bcrypt from "bcrypt";
import pool from "../config/db";
import { z } from "zod";
import { generateToken } from "../services/authservices";

const router = express.Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

router.post("/register", (req, res, next) => {
  (async () => {
    try {
      const { email, password } = loginSchema.parse(req.body);

      
      const existingUser = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );

      if (existingUser.rows.length > 0) {
        return res.status(409).json({ error: "User already exists" });
      }

      
      const hashedPassword = await bcrypt.hash(password, 10);

      
      const { rows } = await pool.query(
        "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id",
        [email, hashedPassword]
      );

      const user = rows[0];

    
      const token = generateToken({ userId: user.id });

      res.status(201).json({ token });
    } catch (err: any) {
      res.status(400).json({ error: err.errors ?? [{ message: err.message }] });
    }
  })().catch(next);
});


router.post("/login", (req, res, next) => {
  (async () => {
    try {
      const { email, password } = loginSchema.parse(req.body);

      const { rows } = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );

      if (rows.length === 0) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const user = rows[0];

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = generateToken({ userId: user.id });
      res.status(200).json({ token });
    } catch (err: any) {
      res.status(400).json({ error: err.errors ?? [{ message: err.message }] });
    }
  })().catch(next);
});

export default router;
