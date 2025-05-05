import { Response } from "express";
import { AuthRequest } from "../middleware/authmiddleware.js";
import {
  getRides as getRidesService,
  addRide as addRideService,
  getRideById,
  updateRideById,
  deleteRideById
} from "../services/rideService.js";


export const getAllRides = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const rides = await getRidesService();
    
    
    const userRides = userId !== undefined 
      ? rides.filter(ride => ride.userId === userId)
      : rides;
    
    res.status(200).json({ rides: userRides });
  } catch (error) {
    console.error("Error getting rides:", error);
    res.status(500).json({ errors: ["Failed to retrieve rides"] });
  }
};


export const createRide = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    
    
    if (userId === undefined) {
      res.status(401).json({ errors: ["User not authenticated"] });
      return;
    }
    
    const { name, distanceKm, duration_minutes, type, notes } = req.body;
    
    
    const errors = [];
    if (!name) errors.push("Required");
    if (typeof distanceKm !== "number" || distanceKm <= 0) errors.push("Distance must be positive");
    if (typeof duration_minutes !== "number" || duration_minutes <= 0) errors.push("Duration must be positive");
    
    if (errors.length > 0) {
      res.status(400).json({ errors });
      return;
    }
    
    const newRide = await addRideService({
      name,
      distanceKm,
      duration_minutes,
      type,
      notes,
      userId
    });
    
    res.status(201).json(newRide);
  } catch (error) {
    console.error("Error creating ride:", error);
    res.status(500).json({ errors: ["Failed to create ride"] });
  }
};


export const getRideDetails = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const rideId = parseInt(req.params.id);
    const ride = await getRideById(rideId);
    res.status(200).json(ride);
  } catch (error) {
    console.error("getRideDetails error:", error);
    
    
    if (error instanceof Error && error.message.includes("not found")) {
      res.status(404).json({ errors: ["Ride not found"] });
    } else {
      
      res.status(500).json({ errors: ["Internal server error"] });
    }
  }
};


export const updateRide = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const rideId = parseInt(req.params.id);
    const userId = req.user?.userId;
    
    
    if (userId === undefined) {
      res.status(401).json({ errors: ["User not authenticated"] });
      return;
    }
    
   
    
    const updatedRide = await updateRideById(rideId, { ...req.body, userId });
    res.status(200).json(updatedRide);
  } catch (error) {
    console.error("updateRide error:", error);
    
    
    if (error instanceof Error && error.message.includes("not found")) {
      res.status(404).json({ errors: ["Ride not found"] });
    } else {
      res.status(500).json({ errors: ["Internal server error"] });
    }
  }
};


export const deleteRide = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const rideId = parseInt(req.params.id);
    
    await deleteRideById(rideId);
    res.status(204).end();
  } catch (error) {
    console.error("deleteRide error:", error);
    
    
    if (error instanceof Error && error.message.includes("not found")) {
      res.status(404).json({ errors: ["Ride not found"] });
    } else {
      res.status(500).json({ errors: ["Internal server error"] });
    }
  }
};