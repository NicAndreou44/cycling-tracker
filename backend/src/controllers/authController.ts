import type { RequestHandler } from "express";
import bcrypt from "bcrypt";
import { loginSchema } from "../validation/authSchema.js";
import { findUserByEmail, createUser } from "../services/postgres/authService.js";
import { generateToken } from "../services/authservices.js";

export const registerUser: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      res.status(409).json({ error: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser(email, hashedPassword);
    const token = generateToken({ userId: user.id });

    res.status(201).json({ token });
  } catch (err: any) {
    res.status(400).json({
      error: err.errors ?? [{ message: err.message }],
    });
  }
};

export const loginUser: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await findUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = generateToken({ userId: user.id });
    res.status(200).json({ token });
  } catch (err: any) {
    res.status(400).json({
      error: err.errors ?? [{ message: err.message }],
    });
  }
};