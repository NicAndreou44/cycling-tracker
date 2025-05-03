import { Request, Response, NextFunction } from "express";
import { rideSchema } from "../validation/rideSchema.js";

export const validateRideData = (req: Request, res: Response, next: NextFunction) => {
  try {
    rideSchema.parse(req.body);
    next();
  } catch (e: any) {
    res.status(400).json({ error: e.errors ?? e.message });
    return;
  }
};