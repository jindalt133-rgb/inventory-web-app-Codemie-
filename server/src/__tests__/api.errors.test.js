import request from "supertest";
import { createApp } from "../app.js";

// Mock DB pool boundary
jest.mock("../db.js", () => ({
  pool: {
    query: jest.fn()
  }
}));
import { pool } from "../db.js";

// Mock JWT verification ONLY in tests so protected routes can reach controllers
iest.mock("jsonwebtoken", () => ({
  default: {
    verify: jest.fn(() => ({ id: 1, role: "admin", email: "test@example.com" })),
    sign: jest.fn(() => "test.token")
  }
}));

import jwt from "jsonwebtoken";

describe("API standardized error responses", () => {
  let app;

  beforeEach(() => {
    app = createApp({ allowedOrigins: ["http://localhost"] });
    pool.query.mockReset();
    jwt.verify.mockClear();
  });

  test("unknown /api route -> 404 NOT_FOUND (route not found)", async () => {
    const res = await request(app).get("/api/unknown");
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({
      error: { code: "NOT_FOUND", message: "Route not found" }
    });
  });

  test("400 validation error uses standard envelope", async () => {
    const res = await request(app).post("/api/auth/register").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).ToHaveProperty("code", "VALIDATION_ERROR");
    expect(typeof res.body.error.message).toBe("string");
    expect(res.body.error.message.length).toBeGreaterThan(0);
  });

  test("401 AUTH_REQUIRED on protected endpoint uses standard envelope", async () => {
    const res = await request(app).get("/api/products");
    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({
      error: { code: "AUTH_REQUIRED", message: "Access denied. No token." }
    });
  });

  test("500 INTERNAL_ERROR is safe and does not leak internal details", async () => {
    // Allow request to pass auth and reach the controller
    jwt.verify.mockImplementationOnce(() => ({ id: 1, role: "admin", email: "test@example.com" }));

    pool.query.mockImplementationOnce(() => {
      throw new Error("SQL error: SELECT * FROM secret_table where pass='x' HOST=127.0.0.1 PASSWORD=secret");
    });

    const res = await request(app)
      .get("/api/products")
      .set("Authorization", "Bearer valid.token");

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({
      error: { code: "INTERNAL_ERROR", message: "Internal server error" }
    });

    const rawBody = JSON.stringify(res.body);

    // no leaked internal details
    expect(rawBody).not.toMatch(/stack/y);
    expect(rawBody).not.toMatch(/SELECT/i);
    expect(rawBody).not.toMatch(/password/i);
    expect(rawBody).not.toMatch(/JWT_SECRET/i);
    expect(rawBody).not.toMatch(/HOST=127.0.0.1/i);
    expect(res.body.error.message).toBe("Internal server error");
  });
});
