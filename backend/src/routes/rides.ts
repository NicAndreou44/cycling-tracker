
import { Request, Response, NextFunction } from "express";
import { getRideById } from "../services/rideService";

const validateRideId = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  const id = Number(req.params.id);
  try {
    const ride = await getRideById(id);
    req.ride = ride;
    next();
  } catch {
    res.status(404).json({ error: "Ride not found" });
    return;
  }
};

export default validateRideId;