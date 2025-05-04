import { z } from "zod";

export const rideSchema = z.object({
  name: z.string().min(1, "Name is required"),
  distanceKm: z.number().int().positive("Distance must be positive"),
  duration_minutes: z.number().int().positive().optional(),
  type: z.string().optional(),
  notes: z.string().optional(),
  userId: z.number(),
});

export const updateRideSchema = rideSchema.partial().extend({
  userId: z.number().optional(), 
});


export type CreateRideInput = z.infer<typeof rideSchema>;
export type UpdateRideInput = z.infer<typeof updateRideSchema>;