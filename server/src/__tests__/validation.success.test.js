import { jest } from "@jest/globals";
import request from "supertest";

jest.unstable_mockModule("../db.js", () => ({
  pool: {
    query: jest.fn()
  }
}));

jest.unstable_mockModule("jsonwebtoken", () => ({
  default: {
    verify: jest.fn(() => ({ id: 1, role: "admin", email: "test@example.com" })),
    sign: jest.fn()
  }
}));

const { pool } = await import("../db.js");
const { createApp } = await import("../app.js");

describe("Request validation and success response preservation", () => {
  let app;

  beforeEach(() => {
    app = createApp({ allowedOrigins: ["http://localhost"] });
    pool.query.mockReset();
  });

  test("product create: no invented required-field validation (reaches the database layer unchanged)", async () => {
    // Approved scope: do not invent required product fields unsupported by
    // prior behavior. An empty body must NOT be rejected as 400 -- it
    // should pass through to the controller/database layer unchanged.
    pool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });

    const res = await request(app)
      .post("/api/products")
      .set("Authorization", "Bearer token")
      .send({});

    expect(res.statusCode).toBe(200);
    expect(pool.query).toHaveBeenCalled();
  });

  test("stock validation: qty <= 0 -> 400 VALIDATION_ERROR", async () => {
    const res = await request(app)
      .post("/api/stock/in")
      .set("Authorization", "Bearer token")
      .send({ product_id: 1, qty: 0 });
    expect(res.statusCode).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  test("supplier validation: missing name -> 400 VALIDATION_ERROR", async () => {
    const res = await request(app)
      .post("/api/suppliers")
      .set("Authorization", "Bearer token")
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  test("success response preserved: GET /api/products returns array", async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 1, name: "P1" }] });
    const res = await request(app)
      .get("/api/products")
      .set("Authorization", "Bearer token");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toEqual([{ id: 1, name: "P1" }]);
  });
});
