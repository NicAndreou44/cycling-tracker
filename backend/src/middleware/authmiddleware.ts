import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: { userId: number }; 
}

const SECRET = process.env.JWT_SECRET || "dev_secret"; 
console.log("SECRET USED TO VERIFY TOKEN:", SECRET);

export const authenticateJWT: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: "Missing Authorization header (Bearer <token>)" });
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "Token format invalid" });
    return;
  }

  try {
    const payload = jwt.verify(token, SECRET) as { userId: number };
    (req as AuthRequest).user = { userId: payload.userId };
    next();
  } catch (error) {
    console.error("JWT VERIFY ERROR:", error);
    res.status(403).json({ error: "Invalid or expired token" });
    return;
  }
};
