
import { Request, Response, NextFunction } from "express";
import { getRideById } from "../services/rideService";



const validateRideId = async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  const id = Number(req.params.id);
  try {
    const ride = await getRideById(id);
    req.ride = ride;
    next();
  } catch {
    return res.status(404).json({ error: "Ride not found" });
  }
};

export default validateRideId;