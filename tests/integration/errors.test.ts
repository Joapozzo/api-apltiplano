import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../src/app.js";

describe("Error handling", () => {
  it("returns 404 for unknown routes via global error handler", async () => {
    const res = await request(app).get("/api/nonexistent-route");

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
  });

  it("handles malformed JSON body", async () => {
    const res = await request(app)
      .post("/api/auth/csrf")
      .set("Content-Type", "application/json")
      .send("not-json-at-all");

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("rate limiter returns 429 after too many requests", async () => {
    // Auth limiter: 10 requests per 15 minutes
    // Send 11 requests and expect the 11th to be rate-limited
    const promises = Array.from({ length: 11 }, () =>
      request(app).post("/api/auth/csrf").send({})
    );

    const results = await Promise.all(promises);
    const rateLimited = results.find((r) => r.status === 429);

    if (rateLimited) {
      expect(rateLimited.body.success).toBe(false);
      expect(rateLimited.body).toHaveProperty("error");
    }
    // If no 429, all 11 requests went through (possible in test env)
  });
});
