import pool from './utils/testDb.js';
import {
  getRides,
  addRide,
  getRideById,
  updateRideById,
  deleteRideById,
} from '../services/rideService.js';

beforeEach(async () => {
  
  await pool.query('DELETE FROM rides');
  await pool.query(`
    INSERT INTO rides (name, distance_km, duration_minutes, type, notes)
    VALUES
      ('Morning Ride', 18, 60, 'cycling', 'Morning routine'),
      ('Evening Ride', 22, 75, 'cycling', 'Evening cooldown'),
      ('City Ride', 12, 40, 'cycling', 'Errands')
  `);
});

afterAll(async () => {
  await pool.end();
});

describe('Ride Service – getRides()', () => {
  it('returns 3 rides', async () => {
    const rides = await getRides();
    expect(rides).toHaveLength(3);
  });

  it("first ride's name is 'Morning Ride'", async () => {
    const rides = await getRides();
    expect(rides[0].name).toBe('Morning Ride');
  });
});

describe('Ride Service – addRide()', () => {
  it('adds and returns a new ride', async () => {
    const newRide = {
      name: 'Test Ride',
      distanceKm: 25,
      duration_minutes: 50,
      type: 'cycling',
      notes: 'Test notes',
    };
    const added = await addRide(newRide);
    expect(added).toHaveProperty('id');
    expect(added.name).toBe('Test Ride');
    expect(added.distanceKm).toBe(25);
  });
});

describe('Ride Service – getRideById()', () => {
  it('fetches the correct ride', async () => {
    const rides = await getRides();
    const ride = await getRideById(rides[0].id);
    expect(ride.name).toBe('Morning Ride');
  });

  it('throws if ID does not exist', async () => {
    await expect(() => getRideById(9999)).rejects.toThrow('Ride not found');
  });
});

describe('Ride Service – updateRideById()', () => {
  it('updates a ride', async () => {
    const added = await addRide({
      name: 'Original',
      distanceKm: 5,
      duration_minutes: 15,
      type: 'cycling',
      notes: 'Old',
    });
    const updated = await updateRideById(added.id, {
      name: 'Updated Ride',
      distanceKm: 10,
      duration_minutes: 15,
      type: 'cycling',
      notes: 'Still old',
    });
    expect(updated.name).toBe('Updated Ride');
    expect(updated.distanceKm).toBe(10);
  });

  it('throws on nonexistent ID', async () => {
    await expect(() =>
      updateRideById(9999, {
        name: 'X',
        distanceKm: 1,
        duration_minutes: 1,
        type: 'cycling',
        notes: 'X',
      })
    ).rejects.toThrow('Ride not found');
  });
});

describe('Ride Service – deleteRideById()', () => {
  it('deletes a ride', async () => {
    const added = await addRide({
      name: 'Delete Me',
      distanceKm: 8,
      duration_minutes: 20,
      type: 'cycling',
      notes: 'Delete test',
    });
    const deleted = await deleteRideById(added.id);
    expect(deleted.id).toBe(added.id);

    const rides = await getRides();
    expect(rides.find(r => r.id === added.id)).toBeUndefined();
  });

  it('throws on nonexistent ID', async () => {
    await expect(() => deleteRideById(9999)).rejects.toThrow('Ride not found');
  });
});