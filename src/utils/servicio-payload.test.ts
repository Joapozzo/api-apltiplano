import { describe, expect, it } from "vitest";
import { normalizeExperienciaRequerida } from "./servicio-payload.js";

describe("normalizeExperienciaRequerida", () => {
  it("devuelve null para null, undefined y string vacío", () => {
    expect(normalizeExperienciaRequerida(null)).toBeNull();
    expect(normalizeExperienciaRequerida(undefined)).toBeNull();
    expect(normalizeExperienciaRequerida("")).toBeNull();
    expect(normalizeExperienciaRequerida("   ")).toBeNull();
  });

  it("descarta números legacy del rating", () => {
    expect(normalizeExperienciaRequerida(2)).toBeNull();
    expect(normalizeExperienciaRequerida(0)).toBeNull();
  });

  it("conserva texto descriptivo", () => {
    const text = "Se recomienda experiencia previa en altura.";
    expect(normalizeExperienciaRequerida(text)).toBe(text);
  });

  it("conserva string legacy '2' como texto (no es number)", () => {
    expect(normalizeExperienciaRequerida("2")).toBe("2");
  });

  it("descarta tipos no string/number", () => {
    expect(normalizeExperienciaRequerida(true)).toBeNull();
    expect(normalizeExperienciaRequerida([])).toBeNull();
  });
});
