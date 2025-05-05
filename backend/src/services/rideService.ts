import pool from "../db/index.js";
import type { CreateRideInput, UpdateRideInput } from "../validation/rideSchema.js";

interface Ride {
  id: number;
  name: string;
  distanceKm: number;
  duration_minutes?: number | null;
  type?: string | null;
  notes?: string | null;
  userId: number;
  created_at?: Date;
}


const mapRideFromDb = (row: any): Ride => ({
  id: row.id,
  name: row.name,
  distanceKm: row.distance_km,
  duration_minutes: row.duration_minutes,
  type: row.type,
  notes: row.notes,
  userId: row.user_id,
  created_at: row.created_at
});

export const getRides = async (): Promise<Ride[]> => {
  const { rows } = await pool.query(`
    SELECT * FROM rides 
    ORDER BY id ASC
  `);
  
  return rows.map(mapRideFromDb);
};

export const addRide = async (input: CreateRideInput): Promise<Ride> => {
  const { name, distanceKm, duration_minutes, type, notes, userId } = input;
  
  const { rows } = await pool.query(`
    INSERT INTO rides (name, distance_km, duration_minutes, type, notes, user_id) 
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `, [name, distanceKm, duration_minutes, type, notes, userId]);
  
  return mapRideFromDb(rows[0]);
};

export const getRideById = async (id: number): Promise<Ride> => {
  const { rows } = await pool.query(`
    SELECT * FROM rides WHERE id = $1
  `, [id]);
  
  if (rows.length === 0) {
    throw new Error(`Ride with ID ${id} not found`);
  }
  
  return mapRideFromDb(rows[0]);
};

export const updateRideById = async (
  id: number,
  input: UpdateRideInput
): Promise<Ride> => {
  
  const { rows: existingRows } = await pool.query(`
    SELECT * FROM rides WHERE id = $1
  `, [id]);
  
  if (existingRows.length === 0) {
    throw new Error(`Ride with ID ${id} not found for update`);
  }
  
  
  const params: any[] = [];
  const updateFields: string[] = [];
  
  
  if (input.name !== undefined) {
    params.push(input.name);
    updateFields.push(`name = $${params.length}`);
  }
  
  if (input.distanceKm !== undefined) {
    params.push(input.distanceKm);
    updateFields.push(`distance_km = $${params.length}`);
  }
  
  if (input.duration_minutes !== undefined) {
    params.push(input.duration_minutes);
    updateFields.push(`duration_minutes = $${params.length}`);
  }
  
  if (input.type !== undefined) {
    params.push(input.type);
    updateFields.push(`type = $${params.length}`);
  }
  
  if (input.notes !== undefined) {
    params.push(input.notes);
    updateFields.push(`notes = $${params.length}`);
  }
  
  if (input.userId !== undefined) {
    params.push(input.userId);
    updateFields.push(`user_id = $${params.length}`);
  }
  
  
  if (updateFields.length === 0) {
    return mapRideFromDb(existingRows[0]);
  }
  
  
  params.push(id);
  
 
  const query = `
    UPDATE rides 
    SET ${updateFields.join(', ')} 
    WHERE id = $${params.length}
    RETURNING *
  `;
  
  const { rows } = await pool.query(query, params);
  
  return mapRideFromDb(rows[0]);
};

export const deleteRideById = async (id: number): Promise<{ id: number }> => {
  
  const { rows: existingRows } = await pool.query(`
    SELECT * FROM rides WHERE id = $1
  `, [id]);
  
  if (existingRows.length === 0) {
    throw new Error(`Ride with ID ${id} not found for deletion`);
  }
  
  const { rows } = await pool.query(`
    DELETE FROM rides WHERE id = $1
    RETURNING id
  `, [id]);
  
  return { id: rows[0].id };
};