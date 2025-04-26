import {
  getRides,
  addRide,
  getRideById,
  updateRideById,
  deleteRideById,
} from "../services/rideService";
import db from "../config/testDb";

beforeEach(async () => {
  await db.query("DELETE FROM rides");
  await db.query(`
    INSERT INTO rides (name, distance_km, duration_minutes, type, notes)
    VALUES
      ('Morning Ride', 18, 60, 'cycling', 'Morning routine'),
      ('Evening Ride', 22, 75, 'cycling', 'Evening cooldown'),
      ('City Ride', 12, 40, 'cycling', 'Errands');
  `);
});

describe("getRides", () => {
  test("should return 3 rides from DB", async () => {
    const rides = await getRides();
    expect(rides).toHaveLength(3);
  });

  test("first ride should be named 'Morning Ride'", async () => {
    const rides = await getRides();
    expect(rides[0].name).toBe("Morning Ride");
  });
});

describe("addRide", () => {
  test("should add a ride with all fields and return it", async () => {
    const newRide = {
      name: "Test Ride",
      distanceKm: 25,
      duration_minutes: 50,
      type: "cycling",
      notes: "Test notes"
    };
    const added = await addRide(newRide);
    expect(added).toHaveProperty("id");
    expect(added.name).toBe("Test Ride");
    expect(added.distanceKm).toBe(25);
  });
});

describe("getRideById", () => {
  test("should return the correct ride when ID exists", async () => {
    const rides = await getRides();
    const ride = await getRideById(rides[0].id);
    expect(ride.name).toBe("Morning Ride");
  });

  test("should throw an error when ID does not exist", async () => {
    await expect(getRideById(9999)).rejects.toThrow("Ride not found");
  });
});

describe("deleteRideById", () => {
  test("should delete the ride with a valid ID", async () => {
    const added = await addRide({
      name: "Temp Ride",
      distanceKm: 8,
      duration_minutes: 20,
      type: "cycling",
      notes: "Temp"
    });
    const deleted = await deleteRideById(added.id);
    expect(deleted.id).toBe(added.id);
    const rides = await getRides();
    expect(rides.find((r) => r.id === added.id)).toBeUndefined();
  });

  test("should throw an error if the ID does not exist", async () => {
    await expect(deleteRideById(9999)).rejects.toThrow("Ride not found");
  });
});

describe("updateRideById", () => {
  test("should update name and distance of a ride", async () => {
    const added = await addRide({
      name: "Original",
      distanceKm: 5,
      duration_minutes: 15,
      type: "cycling",
      notes: "Old"
    });

    const updated = await updateRideById(added.id, {
      name: "Updated Ride",
      distanceKm: 10,
      duration_minutes: 15,
      type: "cycling",
      notes: "Old"
    });
    expect(updated.name).toBe("Updated Ride");
    expect(updated.distanceKm).toBe(10);
  });

  test("should throw an error if the ride is not found", async () => {
    await expect(
      updateRideById(99999, {
        name: "Doesn't exist",
        distanceKm: 10,
        duration_minutes: 30,
        type: "cycling",
        notes: "Test"
      })
    ).rejects.toThrow("Ride not found");
  });
});
afterAll(async () => {
  await db.end(); 
});