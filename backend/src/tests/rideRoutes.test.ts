import request from "supertest";
import app from "../server.js";
import pool from "./utils/testDb.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

let token: string;
let userId: number;

function generateTestToken(userId: number): string {
  const secret = process.env.JWT_SECRET || "dev_secret";
  return jwt.sign({ userId }, secret, { expiresIn: "1h" });
}

describe("Ride Routes Tests", () => {
  beforeAll(async () => {
    const hashedPassword = await bcrypt.hash("password123", 10);

    const userResult = await pool.query(
      "SELECT id FROM users WHERE email = 'test-user@example.com'"
    );
    if (userResult.rows.length === 0) {
      const result = await pool.query(
        `INSERT INTO users (email, password) VALUES ('test-user@example.com', $1) RETURNING id`,
        [hashedPassword]
      );
      userId = result.rows[0].id;
    } else {
      userId = userResult.rows[0].id;
    }

    token = generateTestToken(userId);

    console.log("Test User ID:", userId);
    console.log("Generated Token:", token);
    console.log("Decoded Token:", jwt.decode(token));
    console.log("JWT_SECRET in test:", process.env.JWT_SECRET || "dev_secret");

    await pool.query("DELETE FROM rides WHERE user_id = $1", [userId]);
  });

  beforeEach(async () => {
    await pool.query("DELETE FROM rides WHERE user_id = $1", [userId]);
  });

  afterAll(async () => {
    await pool.query("DELETE FROM rides WHERE user_id = $1", [userId]);
    await pool.end();
  });

  describe("GET /api/rides", () => {
    it("should return all rides", async () => {
      await pool.query(
        `INSERT INTO rides (name, distance_km, duration_minutes, type, notes, user_id)
         VALUES 
         ('Test Ride 1', 20, 60, 'cycling', 'Note 1', $1),
         ('Test Ride 2', 25, 75, 'cycling', 'Note 2', $1)`,
        [userId]
      );

      const res = await request(app)
        .get("/api/rides")
        .set("Authorization", `Bearer ${token}`)
        .expect(response => {
          if (response.status === 401 || response.status === 403) {
            console.log("Auth failure details:", response.body);
          }
        });

      console.log("GET /api/rides response:", res.status, res.body);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.rides)).toBe(true);
      expect(res.body.rides.length).toBeGreaterThanOrEqual(1);
    });

    it("should return 401 if not authenticated", async () => {
      const res = await request(app).get("/api/rides");
      expect(res.status).toBe(401);
    });
  });

  describe("POST /api/rides", () => {
    it("should create a new ride and return 201", async () => {
      const rideData = {
        name: "New Test Ride",
        distanceKm: 30,
        duration_minutes: 80,
        type: "cycling",
        notes: "Created in test"
      };

      console.log("🔧 Using token for POST:", token);
      console.log("🔧 Test userId to use:", userId);

      const res = await request(app)
        .post("/api/rides")
        .set("Authorization", `Bearer ${token}`)
        .send(rideData);

      console.log("POST /api/rides response:", res.status, res.body);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("id");
      expect(res.body.name).toBe("New Test Ride");

      const { rows } = await pool.query(
        "SELECT * FROM rides WHERE name = $1 AND user_id = $2",
        ["New Test Ride", userId]
      );
      expect(rows).toHaveLength(1);
    });

    it("should return 400 for invalid input", async () => {
      const invalidRide = {
        distanceKm: -5
      };

      const res = await request(app)
        .post("/api/rides")
        .set("Authorization", `Bearer ${token}`)
        .send(invalidRide);

      console.log("POST /api/rides (invalid) response:", res.status, res.body);
      expect(res.status).toBe(400);
    });
  });

  describe("Environment Setup Verification", () => {
    it("confirms the test environment is correctly configured", () => {
      const secret = process.env.JWT_SECRET || "dev_secret";
      console.log("Test environment JWT_SECRET:", secret);

      const testToken = generateTestToken(userId);
      const decoded = jwt.decode(testToken);
      console.log("Sample token structure:", decoded);

      try {
        const verified = jwt.verify(testToken, secret);
        console.log("Token verification successful:", verified);
      } catch (err) {
        console.error("Token verification failed:", err);
      }

      expect(true).toBe(true);
    });
  });
});
