import { z } from "zod";
import {
  DIFICULTAD_TECNICA_VALUES,
  EXIGENCIA_FISICA_VALUES,
} from "../constants/servicio-nivel.js";

/** Campo opcional de listado de equipo (texto plano). */
export const equipoRequeridoSchema = z
  .string()
  .max(5000, "El listado de equipo requerido no puede superar 5000 caracteres")
  .optional()
  .nullable();

const exigenciaFisicaSchema = z.preprocess(
  (v) => (v === "" || v === undefined ? null : v),
  z.enum(EXIGENCIA_FISICA_VALUES).nullable().optional(),
);

const dificultadTecnicaSchema = z.preprocess(
  (v) => (v === "" || v === undefined ? null : v),
  z.enum(DIFICULTAD_TECNICA_VALUES).nullable().optional(),
);

/**
 * Valida campos de texto nuevos sin bloquear el resto del body del servicio.
 * Ampliar acá a medida que se migre create/update a Zod completo.
 */
export const servicioBodyPartialSchema = z
  .object({
    equipo_requerido: equipoRequeridoSchema,
    exigencia_fisica: exigenciaFisicaSchema,
    dificultad_tecnica: dificultadTecnicaSchema,
  })
  .passthrough();

export type ServicioBodyPartial = z.infer<typeof servicioBodyPartialSchema>;
