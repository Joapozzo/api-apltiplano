import { z } from "zod";

export const respuestaNivelSchema = z.object({
  codigo_pregunta: z.string().trim().min(1).max(80),
  codigo_opcion: z.string().trim().min(1).max(80),
});

export const evaluarNivelSchema = z.object({
  nombre: z.string().trim().min(1, "El nombre es obligatorio").max(200),
  email: z.string().trim().email("Email inválido").max(254),
  respuestas: z.array(respuestaNivelSchema).min(1, "Completá todas las preguntas"),
});

export const previewNivelSchema = z.object({
  respuestas: z.array(respuestaNivelSchema).min(1),
});

export const updatePreguntaNivelSchema = z.object({
  enunciado: z.string().trim().min(1).max(500).optional(),
  orden: z.coerce.number().int().min(0).optional(),
  grupo: z.string().trim().max(80).optional().nullable(),
  obligatoria: z.boolean().optional(),
  activa: z.boolean().optional(),
});

export const updateOpcionNivelSchema = z.object({
  texto: z.string().trim().min(1).max(500).optional(),
  puntos: z.coerce.number().int().min(0).max(100).optional(),
  orden: z.coerce.number().int().min(0).optional(),
  activa: z.boolean().optional(),
});

export const createOpcionNivelSchema = z.object({
  codigo: z
    .string()
    .trim()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9_]+$/, "Código: solo minúsculas, números y _"),
  texto: z.string().trim().min(1).max(500),
  puntos: z.coerce.number().int().min(0).max(100).default(0),
  orden: z.coerce.number().int().min(0).optional(),
  activa: z.boolean().optional(),
});

export const createPreguntaNivelSchema = z.object({
  codigo: z
    .string()
    .trim()
    .min(1)
    .max(80)
    .regex(/^[a-z0-9_]+$/, "Código: solo minúsculas, números y _"),
  enunciado: z.string().trim().min(1).max(500),
  orden: z.coerce.number().int().min(0).optional(),
  grupo: z.string().trim().max(80).optional().nullable(),
  obligatoria: z.boolean().optional(),
  activa: z.boolean().optional(),
});

export const evaluacionesListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  email: z.string().trim().max(254).optional(),
});

export type EvaluarNivelBody = z.infer<typeof evaluarNivelSchema>;
export type PreviewNivelBody = z.infer<typeof previewNivelSchema>;
