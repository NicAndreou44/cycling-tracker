import { PrismaClient, Ride } from "@prisma/client";
import type { CreateRideInput, UpdateRideInput } from "../validation/rideSchema.js";

const prisma = new PrismaClient();

export const getRides = async (): Promise<Ride[]> => {
  return prisma.ride.findMany({
    orderBy: { id: "asc" },
  });
};

export const addRide = async (input: CreateRideInput): Promise<Ride> => {
  return prisma.ride.create({ data: input });
};

export const getRideById = async (id: number): Promise<Ride | null> => {
  const ride = await prisma.ride.findUnique({
    where: { id },
  });
  if (!ride) throw new Error(`Ride with ID ${id} not found`);
  return ride;
};

export const updateRideById = async (
  id: number,
  input: UpdateRideInput
): Promise<Ride> => {
  try {
    return await prisma.ride.update({
      where: { id },
      data: input,
    });
  } catch (err: any) {
    if (err.code === "P2025") {
      throw new Error(`Ride with ID ${id} not found for update`);
    }
    throw err;
  }
};

export const deleteRideById = async (id: number): Promise<{ id: number }> => {
  try {
    return await prisma.ride.delete({
      where: { id },
    });
  } catch (err: any) {
    if (err.code === "P2025") {
      throw new Error(`Ride with ID ${id} not found for deletion`);
    }
    throw err;
  }
};