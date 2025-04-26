import { Request, RequestHandler } from "express";
import { getRideById } from "../services/rideService";


interface RideRequest extends Request {
  ride?: any;
}

export const validateRideId: RequestHandler = async (req, res, next) => {
  const id = Number(req.params.id);
  try {
    const ride = await getRideById(id);
    (req as RideRequest).ride = ride; 
    next();
  } catch {
    res.status(404).json({ error: "Ride not found" });
  }
};
