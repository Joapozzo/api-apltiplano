import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../src/app.js";

describe("Security headers (helmet)", () => {
  it("includes X-Content-Type-Options header", async () => {
    const res = await request(app).get("/health");

    expect(res.headers["x-content-type-options"]).toBe("nosniff");
  });

  it("includes X-Frame-Options header", async () => {
    const res = await request(app).get("/health");

    expect(res.headers["x-frame-options"]).toBe("SAMEORIGIN");
  });

  it("includes Strict-Transport-Security header", async () => {
    const res = await request(app).get("/health");

    expect(res.headers["strict-transport-security"]).toBeDefined();
  });

  it("does not expose Express in X-Powered-By header", async () => {
    const res = await request(app).get("/health");

    expect(res.headers["x-powered-by"]).toBeUndefined();
  });
});
