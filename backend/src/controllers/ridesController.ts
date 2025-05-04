import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authmiddleware.js';
import { getRides, addRide, getRideById, updateRideById, deleteRideById } from '../services/rideService.js';
import { rideSchema, updateRideSchema, CreateRideInput, UpdateRideInput } from "../validation/rideSchema.js";
import { ZodError } from "zod";

interface ErrorResponse { errors: string[] }

export const getAllRides = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      const errorResponse: ErrorResponse = { errors: ["Unauthorized"] };
      res.status(401).json(errorResponse);
      return;
    }
    const rides = await getRides();
    res.status(200).json({ rides });
    return;
  } catch (error) {
    console.error("Error fetching rides:", error);
    const errorResponse: ErrorResponse = { errors: ["Failed to get rides"] };
    next(error);
    return;
  }
};

export const createRide = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      const errorResponse: ErrorResponse = { errors: ["Unauthorized"] };
      res.status(401).json(errorResponse);
      return;
    }

    const input = rideSchema.parse({ ...req.body, userId: req.user.userId }) as CreateRideInput;
    
    const ride = await addRide(input);

    res.status(201).json(ride);
    return;
  } catch (err: any) {
    if (err instanceof ZodError) {
      const errorResponse: ErrorResponse = { errors: err.issues.map(i => i.message) };
      res.status(400).json(errorResponse);
      return;
    }
    console.error("createRide error:", err);
    next(err);
    return;
  }
};

export const getRideDetails = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      const errorResponse: ErrorResponse = { errors: ["Unauthorized"] };
      res.status(401).json(errorResponse);
      return;
    }

    const rideId = Number(req.params.id);
    if (isNaN(rideId)) {
      const errorResponse: ErrorResponse = { errors: ["Invalid ride ID"] };
      res.status(400).json(errorResponse);
      return;
    }
    const ride = await getRideById(rideId);
    res.status(200).json(ride);
    return;
  } catch (error: any) {
    if (error.message === "Ride not found") {
      const errorResponse: ErrorResponse = { errors: [error.message] };
      res.status(404).json(errorResponse);
      return;
    }
    console.error("getRideDetails error:", error);
    const errorResponse: ErrorResponse = { errors: ["Failed to get ride details"] };
    next(error);
    return;
  }
};

export const updateRide = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
     if (!req.user) {
       const errorResponse: ErrorResponse = { errors: ["Unauthorized"] };
       res.status(401).json(errorResponse);
       return;
     }

    const rideId = Number(req.params.id);
    if (isNaN(rideId)) {
      const errorResponse: ErrorResponse = { errors: ["Invalid ride ID"] };
      res.status(400).json(errorResponse);
      return;
    }

    const input = updateRideSchema.parse({ ...req.body, userId: req.user.userId }) as UpdateRideInput;
    const updatedRide = await updateRideById(rideId, input);
    res.status(200).json(updatedRide);
    return;
  } catch (err: any) {
    if (err instanceof ZodError) {
      const errorResponse: ErrorResponse = { errors: err.issues.map(i => i.message) };
      res.status(400).json(errorResponse);
      return;
    }
    console.error("updateRide error:", err);
    const errorResponse: ErrorResponse = { errors: ["Failed to update ride"] };
    next(err);
    return;
  }
};

export const deleteRide = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
     if (!req.user) {
       const errorResponse: ErrorResponse = { errors: ["Unauthorized"] };
       res.status(401).json(errorResponse);
       return;
     }

    const rideId = Number(req.params.id);
    if (isNaN(rideId)) {
      const errorResponse: ErrorResponse = { errors: ["Invalid ride ID"] };
      res.status(400).json(errorResponse);
      return;
    }

    await deleteRideById(rideId);
    res.status(204).send();
    return;
  } catch (error: any) {
    if (error.message === "Ride not found") {
      const errorResponse: ErrorResponse = { errors: [error.message] };
      res.status(404).json(errorResponse);
      return;
    }
    console.error("deleteRide error:", error);
    const errorResponse: ErrorResponse = { errors: ["Failed to delete ride"] };
    next(error);
    return;
  }
};