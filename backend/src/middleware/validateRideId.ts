
import { RequestHandler } from "express";
import { getRideById } from "../services/rideService";

export const validateRideId: RequestHandler = async (req, res, next) => {
  const id = Number(req.params.id);
  try {
    const ride = await getRideById(id);
    req.ride = ride;
    next();
  } catch {
    res.status(404).json({ error: "Ride not found" });
  }
};
