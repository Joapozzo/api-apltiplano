import { describe, expect, it } from "vitest";
import {
  defaultSlugForNombre,
  identificadorMatchesServicio,
  slugFromNombre,
  slugVariantsFromNombre,
} from "./servicio-slug.js";

describe("servicio-slug", () => {
  it("genera slug desde nombre con acentos", () => {
    expect(slugFromNombre("Cerro Champaquí")).toBe("cerro-champaqui");
  });

  it("defaultSlug acorta cerro-", () => {
    expect(defaultSlugForNombre("Cerro Champaquí")).toBe("champaqui");
  });

  it("acepta alias champaqui y cerro-champaqui", () => {
    const variants = slugVariantsFromNombre("Cerro Champaquí");
    expect(variants).toContain("champaqui");
    expect(variants).toContain("cerro-champaqui");
    expect(identificadorMatchesServicio("champaqui", "Cerro Champaquí", null)).toBe(true);
    expect(identificadorMatchesServicio("cerro-champaqui", "Cerro Champaquí", null)).toBe(true);
    expect(identificadorMatchesServicio("champaqui", "Cerro Champaquí", "champaqui")).toBe(true);
  });
});
