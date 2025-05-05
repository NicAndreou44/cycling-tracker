import request from "supertest";
import app from "../server.js";
import { describe, it, expect } from "vitest";

describe("GET /health", () => {
  it("returns 200 OK with { status: 'ok' }", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });
});