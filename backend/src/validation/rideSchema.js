const { z } = require("zod");

const rideSchema = z.object({
  name: z.string().min(1, "Name is required"),
  distanceKm: z.number().int().positive("Distance must be a positive integer"),
  duration_minutes: z.number().int().positive().optional(),
  type: z.string().optional(),
});

module.exports = { rideSchema };
