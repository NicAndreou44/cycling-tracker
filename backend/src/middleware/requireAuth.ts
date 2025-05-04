import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "./authmiddleware.js";

interface ErrorResponse { errors: string[] }

export const requireAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    const errorResponse: ErrorResponse = { errors: ["Unauthorized"] };
    res.status(401).json(errorResponse);
    return;
  }
  next();
};