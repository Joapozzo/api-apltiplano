import { describe, expect, it } from "vitest";
import {
  calcularRangosEquidistantes,
  resolverNivel,
  sumarPuntos,
  type DificultadRango,
} from "./nivel-scoring.service.js";

/** Rangos iniciales del cliente: 0–40 / 41–70 / 71–94 (configurable en admin). */
const DIFIS: DificultadRango[] = [
  { id_dificultad: 4, nivel: "Inicial", puntaje_min: 0, puntaje_max: 40, orden: 0 },
  { id_dificultad: 1, nivel: "Intermedio", puntaje_min: 41, puntaje_max: 70, orden: 1 },
  { id_dificultad: 2, nivel: "Avanzado", puntaje_min: 71, puntaje_max: 94, orden: 2 },
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
  it("matches inclusive borders for 0–40 / 41–70 / 71–94", () => {
    expect(resolverNivel(0, DIFIS)?.nivel).toBe("Inicial");
    expect(resolverNivel(40, DIFIS)?.nivel).toBe("Inicial");
    expect(resolverNivel(41, DIFIS)?.nivel).toBe("Intermedio");
    expect(resolverNivel(70, DIFIS)?.nivel).toBe("Intermedio");
    expect(resolverNivel(71, DIFIS)?.nivel).toBe("Avanzado");
    expect(resolverNivel(94, DIFIS)?.nivel).toBe("Avanzado");
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
    expect(resolverNivel(10, mixed)?.nivel).toBe("Intermedio");
  });

  it("returns null when no difficulties", () => {
    expect(resolverNivel(10, [])).toBeNull();
  });
});

describe("calcularRangosEquidistantes", () => {
  it("splits score max into N bands", () => {
    const rangos = calcularRangosEquidistantes(94, [
      { id_dificultad: 4 },
      { id_dificultad: 1 },
      { id_dificultad: 2 },
    ]);
    expect(rangos).toHaveLength(3);
    expect(rangos[0]).toEqual({ id_dificultad: 4, puntaje_min: 0, puntaje_max: 30 });
    expect(rangos[2]?.puntaje_max).toBeGreaterThanOrEqual(94);
  });
});
