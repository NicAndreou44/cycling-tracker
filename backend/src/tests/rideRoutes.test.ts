import request from 'supertest';
import app from '../server';
import db from '../config/testDb';

let token: string;

beforeAll(async () => {
  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: "admin@example.com", password: "password123" });

  if (!res.body.token) {
    throw new Error("Failed to get token before running tests");
  }

  token = res.body.token;
}, 15000); 

beforeEach(async () => {
  await db.query("DELETE FROM rides");
});

afterAll(async () => {
  await db.end();
  await new Promise(resolve => setTimeout(resolve, 500)); 
});

describe("POST /api/rides with Zod middleware", () => {
  it("should return 400 when required fields are missing", async () => {
    const res = await request(app)
      .post("/api/rides")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Invalid Ride" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
    expect(res.body.error[0].message).toMatch(/required/i);
  });

  it("should succeed with valid data", async () => {
    const res = await request(app)
      .post("/api/rides")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Zod Approved",
        distanceKm: 30,
        duration_minutes: 70,
        type: "cycling",
        notes: "Good test",
      });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe("Zod Approved");
  });
});

describe("PUT /api/rides/:id with validation", () => {
  it("should return 400 for missing required fields", async () => {
    const addRes = await request(app)
      .post("/api/rides")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "To be updated",
        distanceKm: 10,
        duration_minutes: 30,
        type: "cycling",
        notes: "initial",
      });

    const rideId = addRes.body.id;

    const res = await request(app)
      .put(`/api/rides/${rideId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Still broken" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it("should return 404 if ride ID does not exist", async () => {
    const res = await request(app)
      .put("/api/rides/999999")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Does not exist",
        distanceKm: 50,
        duration_minutes: 60,
        type: "cycling",
        notes: "invalid id",
      });

    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/Ride not found/i);
  });
});

describe("DELETE /api/rides/:id with validation", () => {
  it("should return 404 if ride ID does not exist", async () => {
    const res = await request(app)
      .delete("/api/rides/999999")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/Ride not found/i);
  });

  it("should successfully delete a ride by ID", async () => {
    const addRes = await request(app)
      .post("/api/rides")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "To be deleted",
        distanceKm: 15,
        duration_minutes: 45,
        type: "cycling",
        notes: "bye",
      });

    const rideId = addRes.body.id;

    const deleteRes = await request(app)
      .delete(`/api/rides/${rideId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body.id).toBe(rideId);
  });
});

it("should reach test endpoint", async () => {
  const res = await request(app).get("/test-endpoint");
  expect(res.status).toBe(200);
});

it("should reach debug endpoint", async () => {
  const res = await request(app).get("/test-debug");
  expect(res.status).toBe(200);
});
