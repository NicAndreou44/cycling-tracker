import pool from "../config/db.js";
import { Ride, RideInput } from "../types/Rides.js";

type DbRow = {
  id: number;
  name: string;
  distance_km: number;
  duration_minutes: number | null;
  type: string | null;
  notes: string | null;
};

export const getRides = async (): Promise<Ride[]> => {
  const { rows } = await pool.query<DbRow>(
    "SELECT * FROM rides ORDER BY id ASC"
  );
  return rows.map(r => ({
    id:               r.id,
    name:             r.name,
    distanceKm:       r.distance_km,
    duration_minutes: r.duration_minutes ?? undefined,
    type:             r.type             ?? undefined,
    notes:            r.notes            ?? undefined,
  }));
};

export const addRide = async (input: RideInput): Promise<Ride> => {
  const { name, distanceKm, duration_minutes, type, notes } = input;
  const { rows } = await pool.query<DbRow>(
    `INSERT INTO rides
       (name, distance_km, duration_minutes, type, notes)
     VALUES ($1,$2,$3,$4,$5)
     RETURNING *`,
    [
      name,
      distanceKm,
      duration_minutes ?? null,
      type             ?? null,
      notes            ?? null,
    ]
  );
  const r = rows[0];
  return {
    id:               r.id,
    name:             r.name,
    distanceKm:       r.distance_km,
    duration_minutes: r.duration_minutes ?? undefined,
    type:             r.type             ?? undefined,
    notes:            r.notes            ?? undefined,
  };
};

export const getRideById = async (id: number): Promise<Ride> => {
  const { rows } = await pool.query<DbRow>(
    "SELECT * FROM rides WHERE id = $1",
    [id]
  );
  if (rows.length === 0) throw new Error("Ride not found");
  const r = rows[0];
  return {
    id:               r.id,
    name:             r.name,
    distanceKm:       r.distance_km,
    duration_minutes: r.duration_minutes ?? undefined,
    type:             r.type             ?? undefined,
    notes:            r.notes            ?? undefined,
  };
};

export const updateRideById = async (
  id: number,
  input: RideInput
): Promise<Ride> => {
  const { name, distanceKm, duration_minutes, type, notes } = input;
  const { rows } = await pool.query<DbRow>(
    `UPDATE rides
        SET name=$1,
            distance_km=$2,
            duration_minutes=$3,
            type=$4,
            notes=$5
      WHERE id=$6
      RETURNING *`,
    [
      name,
      distanceKm,
      duration_minutes ?? null,
      type             ?? null,
      notes            ?? null,
      id
    ]
  );
  if (rows.length === 0) throw new Error("Ride not found");
  const r = rows[0];
  return {
    id:               r.id,
    name:             r.name,
    distanceKm:       r.distance_km,
    duration_minutes: r.duration_minutes ?? undefined,
    type:             r.type             ?? undefined,
    notes:            r.notes            ?? undefined,
  };
};

export const deleteRideById = async (id: number): Promise<Ride> => {
  const { rows } = await pool.query<DbRow>(
    "DELETE FROM rides WHERE id = $1 RETURNING *",
    [id]
  );
  if (rows.length === 0) throw new Error("Ride not found");
  const r = rows[0];
  return {
    id:               r.id,
    name:             r.name,
    distanceKm:       r.distance_km,
    duration_minutes: r.duration_minutes ?? undefined,
    type:             r.type             ?? undefined,
    notes:            r.notes            ?? undefined,
  };
};