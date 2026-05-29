import { afterEach, describe, expect, it, vi } from "vitest";
import { getCsrfCookieOptions } from "./csrf.js";

describe("getCsrfCookieOptions", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("uses lax + non-secure in local development", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("VERCEL", "");
    vi.stubEnv("CSRF_CROSS_ORIGIN", "");

    expect(getCsrfCookieOptions()).toMatchObject({
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });
  });

  it("uses none + secure on Vercel (cross-origin front/API)", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("VERCEL", "1");
    vi.stubEnv("CSRF_CROSS_ORIGIN", "");

    expect(getCsrfCookieOptions()).toMatchObject({
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });
  });
});
