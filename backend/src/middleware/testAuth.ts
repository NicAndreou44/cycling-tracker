import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "./authmiddleware.js";

export const mockAuthMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  
  const authHeader = req.headers.authorization;
  
 
  if (!authHeader) {
    res.status(401).json({ errors: ["Unauthorized"] });
    return;
  }
  
  
  (req as AuthRequest).user = { userId: 51 }; 
  next();
};