import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../src/app.js";

describe("CSRF", () => {
  it("GET /api/auth/csrf sets csrf_token cookie and returns token", async () => {
    const res = await request(app).get("/api/auth/csrf");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(typeof res.body.csrfToken).toBe("string");
    expect(res.body.csrfToken.length).toBeGreaterThan(10);

    const setCookie = res.headers["set-cookie"];
    expect(setCookie).toBeDefined();
    const cookieHeader = Array.isArray(setCookie) ? setCookie.join(";") : String(setCookie);
    expect(cookieHeader).toContain("csrf_token=");
  });

  it("DELETE without CSRF returns CSRF_MISSING", async () => {
    const res = await request(app).delete("/api/servicios/1");

    expect(res.status).toBe(403);
    expect(res.body.code).toBe("CSRF_MISSING");
  });

  it("DELETE with cookie and matching X-CSRF-Token passes CSRF check", async () => {
    const csrfRes = await request(app).get("/api/auth/csrf");
    const token = csrfRes.body.csrfToken as string;

    const res = await request(app)
      .delete("/api/servicios/1")
      .set("Cookie", `csrf_token=${token}`)
      .set("X-CSRF-Token", token);

    expect(res.status).not.toBe(403);
    expect(res.body.code).not.toBe("CSRF_MISSING");
    expect(res.body.code).not.toBe("CSRF_MISSING_HEADER");
    expect(res.body.code).not.toBe("CSRF_INVALID");
  });
});
