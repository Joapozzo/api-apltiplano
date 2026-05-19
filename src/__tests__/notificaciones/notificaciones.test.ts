import { describe, it, expect, vi, beforeEach } from "vitest";
import { getNotificacionesRules, getInscripcionesIncompletasRules } from "../../utils/notificaciones-rules.js";
import { NOTIFICACION_TIPOS, NOTIFICACION_SEVERIDAD } from "../../types/notificaciones.dto.js";

describe("notificaciones-rules", () => {
  describe("getNotificacionesRules", () => {
    it("debe generar notificación de cupos llenos cuando no quedan lugares", () => {
      const expediciones = [
        {
          id_expedicion: 1,
          estado: "Activa",
          fecha_salida: new Date("2026-06-15"),
          cupos_disponibles: 10,
          cupos_ocupados: 10,
          presupuesto_valido_hasta: new Date("2026-07-01"),
          servicios: { nombre: "Cerro Champaquí" },
        },
      ];

      const reglas = getNotificacionesRules(expediciones, []);

      const cuposLlenos = reglas.nuevas.find((r) => r.tipo === NOTIFICACION_TIPOS.SALIDA_CUPOS_LLENOS);
      expect(cuposLlenos).toBeDefined();
      expect(cuposLlenos?.severidad).toBe(NOTIFICACION_SEVERIDAD.CRITICAL);
      expect(cuposLlenos?.dedupeKey).toBe("SALIDA_CUPOS_LLENOS:exp:1");
    });

    it("debe generar notificación de cupos críticos cuando quedan pocos lugares", () => {
      const expediciones = [
        {
          id_expedicion: 2,
          estado: "Activa",
          fecha_salida: new Date("2026-06-15"),
          cupos_disponibles: 10,
          cupos_ocupados: 9,
          presupuesto_valido_hasta: new Date("2026-07-01"),
          servicios: { nombre: "Cerro Torre" },
        },
      ];

      const reglas = getNotificacionesRules(expediciones, [], 2);

      const cuposCriticos = reglas.nuevas.find((r) => r.tipo === NOTIFICACION_TIPOS.SALIDA_CUPOS_CRITICOS);
      expect(cuposCriticos).toBeDefined();
      expect(cuposCriticos?.severidad).toBe(NOTIFICACION_SEVERIDAD.WARNING);
      expect(cuposCriticos?.dedupeKey).toBe("SALIDA_CUPOS_CRITICOS:exp:2");
    });

    it("no debe generar cupos críticos cuando hay suficientes lugares", () => {
      const expediciones = [
        {
          id_expedicion: 3,
          estado: "Activa",
          fecha_salida: new Date("2026-06-15"),
          cupos_disponibles: 10,
          cupos_ocupados: 5,
          presupuesto_valido_hasta: new Date("2026-07-01"),
          servicios: { nombre: "Aconcagua" },
        },
      ];

      const reglas = getNotificacionesRules(expediciones, [], 2);

      const cuposCriticos = reglas.nuevas.find((r) => r.tipo === NOTIFICACION_TIPOS.SALIDA_CUPOS_CRITICOS);
      expect(cuposCriticos).toBeUndefined();
    });

    it("debe generar notificación de presupuesto por vencer", () => {
      const manana = new Date();
      manana.setDate(manana.getDate() + 5);

      const expediciones = [
        {
          id_expedicion: 4,
          estado: "Activa",
          fecha_salida: new Date("2026-06-15"),
          cupos_disponibles: 10,
          cupos_ocupados: 3,
          presupuesto_valido_hasta: manana,
          servicios: { nombre: "Fitz Roy" },
        },
      ];

      const reglas = getNotificacionesRules(expediciones, [], 2, 7, 30, 30);

      const presupuesto = reglas.nuevas.find((r) => r.tipo === NOTIFICACION_TIPOS.SALIDA_PRESUPUESTO_POR_VENCER);
      expect(presupuesto).toBeDefined();
      expect(presupuesto?.severidad).toBe(NOTIFICACION_SEVERIDAD.WARNING);
    });

    it("debe generar notificación de presupuesto vencido", () => {
      const ayer = new Date();
      ayer.setDate(ayer.getDate() - 1);

      const expediciones = [
        {
          id_expedicion: 5,
          estado: "Activa",
          fecha_salida: new Date("2026-06-15"),
          cupos_disponibles: 10,
          cupos_ocupados: 3,
          presupuesto_valido_hasta: ayer,
          servicios: { nombre: "Lanin" },
        },
      ];

      const reglas = getNotificacionesRules(expediciones, [], 2, 7, 30, 30);

      const presupuestoVencido = reglas.nuevas.find((r) => r.tipo === NOTIFICACION_TIPOS.SALIDA_PRESUPUESTO_VENCIDO);
      expect(presupuestoVencido).toBeDefined();
      expect(presupuestoVencido?.severidad).toBe(NOTIFICACION_SEVERIDAD.CRITICAL);
    });

    it("debe generar notificación de salida próxima", () => {
      const en5Dias = new Date();
      en5Dias.setDate(en5Dias.getDate() + 5);

      const expediciones = [
        {
          id_expedicion: 6,
          estado: "Activa",
          fecha_salida: en5Dias,
          cupos_disponibles: 10,
          cupos_ocupados: 3,
          presupuesto_valido_hasta: new Date("2026-12-31"),
          servicios: { nombre: "Ski" },
        },
      ];

      const reglas = getNotificacionesRules(expediciones, [], 2, 30, 7, 3);

      const salidaProxima = reglas.nuevas.find((r) => r.tipo === NOTIFICACION_TIPOS.SALIDA_PROXIMA);
      expect(salidaProxima).toBeDefined();
      expect(salidaProxima?.severidad).toBe(NOTIFICACION_SEVERIDAD.INFO);
    });

    it("no debe generar alertas para expediciones finalizadas", () => {
      const expediciones = [
        {
          id_expedicion: 7,
          estado: "Finalizada",
          fecha_salida: new Date("2026-06-15"),
          cupos_disponibles: 10,
          cupos_ocupados: 10,
          presupuesto_valido_hasta: new Date("2026-07-01"),
          servicios: { nombre: "Pasada" },
        },
      ];

      const reglas = getNotificacionesRules(expediciones, []);

      expect(reglas.nuevas.length).toBe(0);
      expect(reglas.archivar.length).toBeGreaterThan(0);
    });
  });

  describe("getInscripcionesIncompletasRules", () => {
    it("debe generar alerta para inscripción sin datos médicos", () => {
      const inscripciones = [
        {
          id_inscripcion: 100,
          clientes: { nombre: "Juan", apellido: "Pérez" },
          tiene_datos_medicos: false,
          tiene_actividad_fisica: true,
          tiene_emergencia: true,
        },
      ];

      const reglas = getInscripcionesIncompletasRules(inscripciones);

      const sinDatos = reglas.find((r) => r.tipo === NOTIFICACION_TIPOS.INSCRIPCION_SIN_DATOS_MEDICOS);
      expect(sinDatos).toBeDefined();
      expect(sinDatos?.dedupeKey).toBe("INSCRIPCION_SIN_DATOS_MEDICOS:100");
    });

    it("debe generar alerta para inscripción sin actividad física", () => {
      const inscripciones = [
        {
          id_inscripcion: 101,
          clientes: { nombre: "María", apellido: "Gómez" },
          tiene_datos_medicos: true,
          tiene_actividad_fisica: false,
          tiene_emergencia: true,
        },
      ];

      const reglas = getInscripcionesIncompletasRules(inscripciones);

      const sinActividad = reglas.find((r) => r.tipo === NOTIFICACION_TIPOS.INSCRIPCION_SIN_ACTIVIDAD_FISICA);
      expect(sinActividad).toBeDefined();
    });

    it("debe generar alerta para inscripción sin contacto de emergencia", () => {
      const inscripciones = [
        {
          id_inscripcion: 102,
          clientes: { nombre: "Pedro", apellido: "López" },
          tiene_datos_medicos: true,
          tiene_actividad_fisica: true,
          tiene_emergencia: false,
        },
      ];

      const reglas = getInscripcionesIncompletasRules(inscripciones);

      const sinEmergencia = reglas.find((r) => r.tipo === NOTIFICACION_TIPOS.INSCRIPCION_SIN_EMERGENCIA);
      expect(sinEmergencia).toBeDefined();
    });

    it("no debe generar alertas cuando la inscripción está completa", () => {
      const inscripciones = [
        {
          id_inscripcion: 103,
          clientes: { nombre: "Ana", apellido: "Martínez" },
          tiene_datos_medicos: true,
          tiene_actividad_fisica: true,
          tiene_emergencia: true,
        },
      ];

      const reglas = getInscripcionesIncompletasRules(inscripciones);

      expect(reglas.length).toBe(0);
    });
  });

  describe("dedupe key", () => {
    it("debe generar dedupe keys únicos para cada tipo", () => {
      const expedicion = {
        id_expedicion: 10,
        estado: "Activa",
        fecha_salida: new Date("2026-06-15"),
        cupos_disponibles: 10,
        cupos_ocupados: 10,
        presupuesto_valido_hasta: new Date("2026-07-01"),
        servicios: { nombre: "Test" },
      };

      const reglas = getNotificacionesRules([expedicion], []);

      const dedupeKeys = reglas.nuevas.map((r) => r.dedupeKey);
      const uniqueKeys = new Set(dedupeKeys);

      expect(uniqueKeys.size).toBe(dedupeKeys.length);
    });
  });
});