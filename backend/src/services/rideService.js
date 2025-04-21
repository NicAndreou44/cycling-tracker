const pool = require("../config/db");

const getRides = async () => {
  const result = await pool.query("SELECT * FROM rides ORDER BY id ASC");
  return result.rows; 
};

const addRide = async ({ name, distanceKm, duration_minutes, type, notes }) => {
  const result = await pool.query(
    `INSERT INTO rides (name, distance_km, duration_minutes, type, notes) 
     VALUES ($1, $2, $3, $4, $5) 
     RETURNING *`,
    [name, distanceKm, duration_minutes, type, notes]
  );

  const ride = result.rows[0];

 
  return {
    id: ride.id,
    name: ride.name,
    distanceKm: ride.distance_km,
    duration_minutes: ride.duration_minutes,
    type: ride.type,
    notes: ride.notes,
  };
};

const getRideById = async (id) => {
  const result = await pool.query("SELECT * FROM rides WHERE id = $1", [id]);
  const ride = result.rows[0];

  if (!ride) {
    throw new Error("ride not found");
  }

  return ride; 
};

const updateRideById = async (id, updatedFields) => {
  const { name, distanceKm, duration_minutes, type, notes } = updatedFields;

  const result = await pool.query(
    `UPDATE rides 
     SET name = $1, distance_km = $2, duration_minutes = $3, type = $4, notes = $5
     WHERE id = $6 
     RETURNING *`,
    [name, distanceKm, duration_minutes, type, notes, id]
  );

  if (result.rows.length === 0) {
    throw new Error("Ride not found");
  }

  const ride = result.rows[0];

  
  return {
    id: ride.id,
    name: ride.name,
    distanceKm: ride.distance_km,
    duration_minutes: ride.duration_minutes,
    type: ride.type,
    notes: ride.notes,
  };
};

const deleteRideById = async (id) => {
  const result = await pool.query(
    "DELETE FROM rides WHERE id = $1 RETURNING *",
    [id]
  );

  if (result.rows.length === 0) {
    throw new Error("ride not found");
  }

  return result.rows[0]; 
};

module.exports = {
  getRides,
  addRide,
  getRideById,
  updateRideById,
  deleteRideById,
};