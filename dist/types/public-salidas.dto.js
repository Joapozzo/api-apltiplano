import { z } from "zod";
/** Query compartido: listados públicos (servicios / salidas). */
export const publicCatalogQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(12),
    destacado: z
        .enum(["true", "false"])
        .optional()
        .transform((v) => (v === undefined ? undefined : v === "true")),
    q: z
        .string()
        .max(200)
        .optional()
        .transform((v) => v?.trim() || undefined),
    dificultad: z
        .string()
        .trim()
        .optional()
        .default("todas")
        .transform((v) => (v && v.length > 0 ? v : "todas")),
    /** Exigencia física: "todas" | Moderada | Alta | Muy alta */
    exigencia_fisica: z
        .string()
        .trim()
        .optional()
        .default("todas")
        .transform((v) => (v && v.length > 0 ? v : "todas")),
    /** Dificultad técnica: "todas" | Nula | Básica | Intermedia | Avanzada */
    dificultad_tecnica: z
        .string()
        .trim()
        .optional()
        .default("todas")
        .transform((v) => (v && v.length > 0 ? v : "todas")),
    orden: z.enum(["fecha", "dificultad", "precio", "nombre"]).optional().default("fecha"),
});
/** @deprecated usar publicCatalogQuerySchema */
export const salidasListQuerySchema = publicCatalogQuerySchema;
/** Catálogo de servicios: default limit más alto */
export const serviciosCatalogQuerySchema = publicCatalogQuerySchema.extend({
    limit: z.coerce.number().int().min(1).max(100).default(50),
    page: z.coerce.number().int().min(1).default(1),
});
/** Query GET /api/user/salidas/calendario */
export const salidasCalendarioQuerySchema = z.object({
    year: z.coerce.number().int().min(2000).max(2100),
});
/** Query GET /api/user/salidas/:identificador */
export const salidaDetalleQuerySchema = z.object({
    id_expedicion: z.coerce.number().int().positive().optional(),
});
/** Param :identificador — slug kebab-case o id numérico de expedición */
export const salidaIdentificadorParamSchema = z
    .string()
    .min(1)
    .max(200)
    .refine((s) => /^\d+$/.test(s) || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s), "Identificador inválido");
//# sourceMappingURL=public-salidas.dto.js.map