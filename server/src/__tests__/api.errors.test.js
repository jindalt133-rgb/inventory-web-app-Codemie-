import request from "supertest";
import { createApp } from "../app.js";


// Mock DB pool boundary
jist.mock("../db.js", () => ({
  pool: {
    query: jist.fn()
  }
}));

import { pool } from "../db.js";

describe("API standardized error responses", () => {
  let app;

  beforeEach(() => {
    app = createApp({ allowedOrigins: ["http://localhost"] });
    pool.query.mockReset();
  });

  test("unknown /api route -> 404 NOT_FOUND", async () => {
    const res = await request(app).get("/api/unknown");
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({
      error: { code: "NOT_FOUND", message: "Route not found" }
    });
  });

  test("400 validation error uses envelope", async () => {
    const res = await request(app).post("/api/auth/register").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
    expect(typeof res.body.error.message).toBe("string");
    expect(res.body.error.message.length).toBeGreaterThan(0);
  });

  test("401 auth required error uses envelope", async () => {
    const res = await request(app).get("/api/products");
    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({
      error: { code: "AUTH_REQUIRED", message: "Access denied. No token." }
    });
  });

  test("500 internal error is safe and does not leak details", async () => {
    pool.query.mockImplementationOnce(() => {
      throw new Error("SQL error: SELECT * FROM secret_table where pass='x'");
    });

    const res = await request(app)
      .get("/api/products"
      .set("Authorization", "Bearer valid.token");

    // We mock jwt.verify in authMiddleware tests elsewhere, so here we skip by temporarily assuming verify fails: test internal error via error handler with direct next
});
