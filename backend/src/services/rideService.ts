
import pool from "../config/db";
import { Rides, RideInput } from "../types/Rides";

export const getRides = async (): Promise<Rides[]> => {
  const { rows } = await pool.query("SELECT * FROM rides ORDER BY id ASC");
  return rows.map(r => ({
    id:               r.id,
    name:             r.name,
    distanceKm:       r.distance_km,
    duration_minutes: r.duration_minutes ?? 0,
    type:             r.type ?? "",
    notes:            r.notes ?? "",
  }));
};

export const addRide = async (input: RideInput): Promise<Rides> => {
  const { name, distanceKm, duration_minutes, type, notes } = input;
  const { rows } = await pool.query(
    `INSERT INTO rides (name, distance_km, duration_minutes, type, notes)
     VALUES ($1,$2,$3,$4,$5)
     RETURNING *`,
    [name, distanceKm, duration_minutes, type, notes]
  );
  const r = rows[0];
  return {
    id:               r.id,
    name:             r.name,
    distanceKm:       r.distance_km,
    duration_minutes: r.duration_minutes ?? 0,
    type:             r.type ?? "",
    notes:            r.notes ?? "",
  };
};

export const getRideById = async (id: number): Promise<Rides> => {
  const { rows } = await pool.query("SELECT * FROM rides WHERE id = $1", [id]);
  const r = rows[0];
  if (!r) throw new Error("Ride not found");
  return {
    id:               r.id,
    name:             r.name,
    distanceKm:       r.distance_km,
    duration_minutes: r.duration_minutes ?? 0,
    type:             r.type ?? "",
    notes:            r.notes ?? "",
  };
};

export const updateRideById = async (id: number, input: RideInput): Promise<Rides> => {
  const { name, distanceKm, duration_minutes, type, notes } = input;
  const { rows } = await pool.query(
    `UPDATE rides
     SET name=$1, distance_km=$2, duration_minutes=$3, type=$4, notes=$5
     WHERE id=$6
     RETURNING *`,
    [name, distanceKm, duration_minutes, type, notes, id]
  );
  if (rows.length === 0) throw new Error("Ride not found");
  const r = rows[0];
  return {
    id:               r.id,
    name:             r.name,
    distanceKm:       r.distance_km,
    duration_minutes: r.duration_minutes ?? 0,
    type:             r.type ?? "",
    notes:            r.notes ?? "",
  };
};

export const deleteRideById = async (id: number): Promise<Rides> => {
  const { rows } = await pool.query(
    "DELETE FROM rides WHERE id = $1 RETURNING *",
    [id]
  );
  if (rows.length === 0) throw new Error("Ride not found");
  const r = rows[0];
  return {
    id:               r.id,
    name:             r.name,
    distanceKm:       r.distance_km,
    duration_minutes: r.duration_minutes ?? 0,
    type:             r.type ?? "",
    notes:            r.notes ?? "",
  };
};
