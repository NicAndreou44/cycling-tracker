import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authmiddleware.js';
import { getRides, addRide, getRideById, updateRideById, deleteRideById } from '../services/rideService.js';

export const getAllRides = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const rides = await getRides();
    res.json({ rides });
    return;
  } catch (error) {
    console.error("Error fetching rides:", error);
    res.status(500).json({ error: 'Failed to get rides' });
    return;
  }
};

export const createRide = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const ride = await addRide(req.body);
    res.status(201).json(ride);
    return;
  } catch (error) {
    console.error("Error creating ride:", error);
    res.status(500).json({ error: 'Failed to create ride' });
    return;
  }
};

export const getRideDetails = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const rideId = Number(req.params.id);
    const ride = await getRideById(rideId);
    res.json(ride);
    return;
  } catch (error: any) {
    if (error.message === "Ride not found") {
      res.status(404).json({ error: error.message });
      return;
    }
    console.error("Error getting ride details:", error);
    res.status(500).json({ error: 'Failed to get ride details' });
    return;
  }
};

export const updateRide = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const rideId = Number(req.params.id);
    const updatedRide = await updateRideById(rideId, req.body);
    res.json(updatedRide);
    return;
  } catch (error: any) {
    if (error.message === "Ride not found") {
      res.status(404).json({ error: error.message });
      return;
    }
    console.error("Error updating ride:", error);
    res.status(500).json({ error: 'Failed to update ride' });
    return;
  }
};

export const deleteRide = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const rideId = Number(req.params.id);
    const deleted = await deleteRideById(rideId);
    res.status(200).json(deleted);
    return;
  } catch (error: any) {
    if (error.message === "Ride not found") {
      res.status(404).json({ error: error.message });
      return;
    }
    console.error("Error deleting ride:", error);
    res.status(500).json({ error: 'Failed to delete ride' });
    return;
  }
};
