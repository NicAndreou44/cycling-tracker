const request = require("supertest");
const app = require("../../server"); 
const db = require("../db");

beforeEach(async () => {
  await db.query("DELETE FROM rides");
});

afterAll(async () => {
  await db.end();
});

describe("POST /rides with Zod middleware", () => {
  it("should return 400 when required fields are missing", async () => {
    const res = await request(app).post("/rides").send({
      name: "Invalid Ride"
      // missing distanceKm
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
    expect(res.body.error[0].message).toMatch(/required/i);
  });

  it("should succeed with valid data", async () => {
    const res = await request(app).post("/rides").send({
      name: "Zod Approved",
      distanceKm: 30,
      duration_minutes: 70,
      type: "cycling",
      notes: "Good test"
    });

    expect(res.status).toBe(201); // ✅ was 200, should be 201
    expect(res.body.name).toBe("Zod Approved");
  });
});

describe("PUT /rides/:id with validation", () => {
  it("should return 400 for missing required fields", async () => {
    const addRes = await request(app).post("/rides").send({
      name: "To be updated",
      distanceKm: 10,
      duration_minutes: 30,
      type: "cycling",
      notes: "initial"
    });

    const rideId = addRes.body.id;

    const res = await request(app).put(`/rides/${rideId}`).send({
      name: "Still broken"
      // missing distanceKm
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it("should return 404 if ride ID does not exist", async () => {
    const res = await request(app).put("/rides/999999").send({
      name: "Does not exist",
      distanceKm: 50,
      duration_minutes: 60,
      type: "cycling",
      notes: "invalid id"
    });

    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/ride not found/i);
  });
});

describe("DELETE /rides/:id with validation", () => {
  it("should return 404 if ride ID does not exist", async () => {
    const res = await request(app).delete("/rides/999999");
    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/ride not found/i);
  });

  it("should successfully delete a ride by ID", async () => {
    const addRes = await request(app).post("/rides").send({
      name: "To be deleted",
      distanceKm: 15,
      duration_minutes: 45,
      type: "cycling",
      notes: "bye"
    });

    const rideId = addRes.body.id;

    const deleteRes = await request(app).delete(`/rides/${rideId}`);
    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body.id).toBe(rideId);
  });
});
