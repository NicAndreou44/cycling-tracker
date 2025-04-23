
import { RequestHandler } from "express";
import { rideSchema }     from "../validation/rideSchema";

export const validateRideData: RequestHandler = (req, res, next) => {
  try {
    rideSchema.parse(req.body);
    next();
  } catch (err: any) {
    
    res
      .status(400)
      .json({ error: err.errors ?? [{ message: err.message }] });
    return;
  }
};
