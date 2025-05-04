import { RequestHandler, NextFunction } from "express";
import bcrypt from "bcrypt";
import { loginSchema, LoginInput } from "../validation/authSchema.js";
import { findUserByEmail, createUser } from "../services/postgres/authService.js";
import { generateToken } from "../services/authservices.js";
import { ZodError } from "zod";

const SALT_ROUNDS = 10;
interface ErrorResponse { errors: string[] }

export const registerUser: RequestHandler<unknown, unknown, LoginInput> =
  async (req, res, next): Promise<void> => {
    try {
      const { email, password } = loginSchema.parse(req.body);

      if (await findUserByEmail(email)) {
        res.status(409).json({ errors: ["User already exists"] });
        return;
      }

      const hashed = await bcrypt.hash(password, SALT_ROUNDS);
      const user = await createUser(email, hashed);
      const token = generateToken({ userId: user.id });

      res.status(201).json({ token });
      return;
    } catch (err: any) {
      if (err instanceof ZodError) {
        res.status(400).json({ errors: err.issues.map(i => i.message) });
        return;
      }
      console.error("registerUser error:", err);
      next(err);
    }
  };

export const loginUser: RequestHandler<unknown, unknown, LoginInput> =
  async (req, res, next): Promise<void> => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      const user = await findUserByEmail(email);

      if (!user || !(await bcrypt.compare(password, user.password))) {
        res.status(401).json({ errors: ["Invalid credentials"] });
        return;
      }

      const token = generateToken({ userId: user.id });
      res.status(200).json({ token });
      return;
    } catch (err: any) {
      if (err instanceof ZodError) {
        res.status(400).json({ errors: err.issues.map(i => i.message) });
        return;
      }
      console.error("loginUser error:", err);
      next(err);
    }
  };