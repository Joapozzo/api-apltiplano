import { afterEach, describe, expect, it, vi } from "vitest";
import { getCsrfCookieOptions } from "./csrf.js";

describe("getCsrfCookieOptions", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("uses lax + non-secure in local development", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("CSRF_CROSS_ORIGIN", "");

    expect(getCsrfCookieOptions()).toMatchObject({
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });
  });

  it("uses lax + secure in production (same-origin via Next rewrite)", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("VERCEL", "1");
    vi.stubEnv("CSRF_CROSS_ORIGIN", "");

    expect(getCsrfCookieOptions()).toMatchObject({
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    });
  });

  it("uses none + secure when CSRF_CROSS_ORIGIN is forced", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("CSRF_CROSS_ORIGIN", "true");

    expect(getCsrfCookieOptions()).toMatchObject({
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });
  });
});
