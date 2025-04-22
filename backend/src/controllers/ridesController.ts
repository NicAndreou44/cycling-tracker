import { Request, Response, NextFunction } from "express";
import { rideSchema } from "../validation/rideSchema";
import {
  getRides,
  addRide,
  getRideById,
  updateRideById,
  deleteRideById,
} from "../services/rideService";
import { RideInput } from "../types/Rides";

type RequestHandlerFunc = (req: Request, res: Response, next?: NextFunction) => Promise<any>;

export const getAllRides: RequestHandlerFunc = async (_req, res) => {
  try {
    const rides = await getRides();
    return res.status(200).json(rides);
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const createRide: RequestHandlerFunc = async (req, res) => {
  try {
    const input = rideSchema.parse(req.body) as RideInput;
    const ride = await addRide(input);
    return res.status(201).json(ride);
  } catch (e: any) {
    return res.status(400).json({ error: e.errors ?? e.message });
  }
};

export const getRideDetails: RequestHandlerFunc = async (req, res) => {
  return res.status(200).json(req.ride);
};

export const updateRide: RequestHandlerFunc = async (req, res) => {
  try {
    const input = rideSchema.parse(req.body) as RideInput;
    const updated = await updateRideById(Number(req.params.id), input);
    return res.status(200).json(updated);
  } catch (e: any) {
    const status = e.errors ? 400 : 404;
    return res.status(status).json({ error: e.errors ?? e.message });
  }
};

export const deleteRide: RequestHandlerFunc = async (req, res) => {
  try {
    const deleted = await deleteRideById(Number(req.params.id));
    return res.status(200).json(deleted);
  } catch {
    return res.status(404).json({ error: "Ride not found" });
  }
};