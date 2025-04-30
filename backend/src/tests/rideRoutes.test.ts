import request from "supertest";
import app from "../server.js";
import pool from "./utils/testDb.js";

let token: string;

beforeAll(async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL
    );
  `);

  await pool.query(`
    INSERT INTO users (email, password)
    VALUES ('admin@example.com', '$2b$10$QnJ3pTle7fCKlx1q0zHgLOV48xYIjo61J20UzMmkxLRjc6z9Yj8dO')
    ON CONFLICT (email) DO NOTHING;
  `);

  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: "admin@example.com", password: "password123" });

  token = res.body.token;
});

beforeEach(async () => {
  await pool.query("DELETE FROM rides");
});

afterAll(async () => {
  await pool.end();
});

describe("POST /api/rides", () => {
  it("should 400 on missing fields", async () => {
    const res = await request(app)
      .post("/api/rides")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Invalid Ride" });

    expect(res.status).toBe(400);
    expect(res.body.error[0].message).toMatch(/required/i);
  });

  it("should 201 on valid input", async () => {
    const res = await request(app)
      .post("/api/rides")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Zod Approved",
        distanceKm: 30,
        duration_minutes: 70,
        type: "cycling",
        notes: "Solid ride",
      });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe("Zod Approved");
  });
});

describe("PUT /api/rides/:id", () => {
  it("should 400 on missing fields", async () => {
    const added = await request(app)
      .post("/api/rides")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "To be updated",
        distanceKm: 10,
        duration_minutes: 30,
        type: "cycling",
        notes: "initial",
      });

    const rideId = added.body.id;

    const res = await request(app)
      .put(`/api/rides/${rideId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Invalid update" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it("should 404 if ride not found", async () => {
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

describe("DELETE /api/rides/:id", () => {
  it("should 404 on nonexistent ride", async () => {
    const res = await request(app)
      .delete("/api/rides/999999")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
    expect(res.body.error).toMatch(/Ride not found/i);
  });

  it("should delete ride", async () => {
    const added = await request(app)
      .post("/api/rides")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "To be deleted",
        distanceKm: 15,
        duration_minutes: 45,
        type: "cycling",
        notes: "bye",
      });

    const rideId = added.body.id;

    const res = await request(app)
      .delete(`/api/rides/${rideId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(rideId);
  });
});
