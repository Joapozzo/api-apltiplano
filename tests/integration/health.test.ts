import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../src/app.js";

describe("GET /health", () => {
  it("returns 200 with status ok when database is connected", async () => {
    const res = await request(app).get("/health");

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(res.body).toHaveProperty("timestamp");
    expect(res.body).toHaveProperty("uptime");
    expect(res.body).toHaveProperty("database");
  });
});

describe("GET /", () => {
  it("returns 200 with API info", async () => {
    const res = await request(app).get("/");

    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Altiplano API");
    expect(res.body.status).toBe("running");
    expect(res.body).toHaveProperty("version");
    expect(res.body).toHaveProperty("timestamp");
  });
});
