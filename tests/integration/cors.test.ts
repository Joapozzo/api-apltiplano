import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../src/app.js";

describe("CORS", () => {
  it("allows requests from allowed origins", async () => {
    const res = await request(app)
      .get("/health")
      .set("Origin", "http://localhost:3000");

    expect(res.status).toBe(200);
    expect(res.headers["access-control-allow-origin"]).toBe("http://localhost:3000");
  });

  it("includes CORS credentials header on responses", async () => {
    const res = await request(app).get("/health");

    expect(res.headers["access-control-allow-credentials"]).toBe("true");
  });
});
