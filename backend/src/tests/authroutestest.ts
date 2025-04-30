import request from "supertest";
import app from "../server.js";

describe("POST /api/auth/login", () => {
  it("should return 200 and token on valid credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@example.com", password: "password123" });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it("should return 401 on invalid credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "wrong@example.com", password: "wrongpass" });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("Invalid credentials");
  });

  it("should return 400 on invalid input", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "invalidemail", password: "123" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });
});
