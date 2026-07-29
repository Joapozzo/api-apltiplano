import { describe, expect, it } from "vitest";
import {
  calcularRangosEquidistantes,
  resolverNivel,
  sumarPuntos,
  type DificultadRango,
} from "./nivel-scoring.service.js";

const DIFIS: DificultadRango[] = [
  { id_dificultad: 4, nivel: "Inicial", puntaje_min: 0, puntaje_max: 24, orden: 0 },
  { id_dificultad: 1, nivel: "Moderada", puntaje_min: 25, puntaje_max: 49, orden: 1 },
  { id_dificultad: 2, nivel: "Media-alta", puntaje_min: 50, puntaje_max: 74, orden: 2 },
  { id_dificultad: 3, nivel: "Exigente", puntaje_min: 75, puntaje_max: 999, orden: 3 },
];

describe("sumarPuntos", () => {
  it("sums option points", () => {
    expect(sumarPuntos([{ puntos: 5 }, { puntos: 4 }, { puntos: 0 }])).toBe(9);
  });

  it("returns 0 for empty", () => {
    expect(sumarPuntos([])).toBe(0);
  });
});

describe("resolverNivel", () => {
  it("matches inclusive borders", () => {
    expect(resolverNivel(0, DIFIS)?.nivel).toBe("Inicial");
    expect(resolverNivel(24, DIFIS)?.nivel).toBe("Inicial");
    expect(resolverNivel(25, DIFIS)?.nivel).toBe("Moderada");
    expect(resolverNivel(49, DIFIS)?.nivel).toBe("Moderada");
    expect(resolverNivel(50, DIFIS)?.nivel).toBe("Media-alta");
    expect(resolverNivel(75, DIFIS)?.nivel).toBe("Exigente");
    expect(resolverNivel(80, DIFIS)?.nivel).toBe("Exigente");
  });

  it("falls back to closest midpoint on gap", () => {
    const conHueco: DificultadRango[] = [
      { id_dificultad: 1, nivel: "A", puntaje_min: 0, puntaje_max: 10, orden: 0 },
      { id_dificultad: 2, nivel: "B", puntaje_min: 20, puntaje_max: 30, orden: 1 },
    ];
    expect(resolverNivel(15, conHueco)?.nivel).toBe("A");
  });

  it("ignores inactive levels", () => {
    const mixed = [
      { ...DIFIS[0]!, activo: false },
      ...DIFIS.slice(1),
    ];
    expect(resolverNivel(10, mixed)?.nivel).toBe("Moderada");
  });

  it("returns null when no difficulties", () => {
    expect(resolverNivel(10, [])).toBeNull();
  });
});

describe("calcularRangosEquidistantes", () => {
  it("splits score max into N bands", () => {
    const rangos = calcularRangosEquidistantes(80, [
      { id_dificultad: 4 },
      { id_dificultad: 1 },
      { id_dificultad: 2 },
      { id_dificultad: 3 },
    ]);
    expect(rangos).toHaveLength(4);
    expect(rangos[0]).toEqual({ id_dificultad: 4, puntaje_min: 0, puntaje_max: 19 });
    expect(rangos[3]?.puntaje_max).toBeGreaterThanOrEqual(80);
  });
});
