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
  orden: z.enum(["fecha", "dificultad", "precio", "nombre"]).optional().default("fecha"),
});

export type PublicCatalogQuery = z.infer<typeof publicCatalogQuerySchema>;

/** @deprecated usar publicCatalogQuerySchema */
export const salidasListQuerySchema = publicCatalogQuerySchema;
export type SalidasListQuery = PublicCatalogQuery;

/** Catálogo de servicios: default limit más alto */
export const serviciosCatalogQuerySchema = publicCatalogQuerySchema.extend({
  limit: z.coerce.number().int().min(1).max(100).default(50),
  page: z.coerce.number().int().min(1).default(1),
});

export type ServiciosCatalogQuery = z.infer<typeof serviciosCatalogQuerySchema>;

/** Query GET /api/user/salidas/calendario */
export const salidasCalendarioQuerySchema = z.object({
  year: z.coerce.number().int().min(2000).max(2100),
});

export type SalidasCalendarioQuery = z.infer<typeof salidasCalendarioQuerySchema>;

/** Query GET /api/user/salidas/:identificador */
export const salidaDetalleQuerySchema = z.object({
  id_expedicion: z.coerce.number().int().positive().optional(),
});

export type SalidaDetalleQuery = z.infer<typeof salidaDetalleQuerySchema>;

/** Param :identificador — slug kebab-case o id numérico de expedición */
export const salidaIdentificadorParamSchema = z
  .string()
  .min(1)
  .max(200)
  .refine((s) => /^\d+$/.test(s) || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s), "Identificador inválido");

/** Pareja alineada al front (servicio con fotos/desc, expedición con precios). */
export type SalidaPublicaPar = {
  servicio: Record<string, unknown> & { fotos: string[]; desc: string };
  expedicion: Record<string, unknown> & {
    precios: Array<{ nombre_paquete: string; precio: number; moneda: string }>;
    fecha_salida: string;
    fecha_fin: string;
  };
};

/** Catálogo: servicio siempre; expedición solo si hay próxima salida. */
export type CatalogoServicioPar = {
  servicio: SalidaPublicaPar["servicio"];
  expedicion: SalidaPublicaPar["expedicion"] | null;
};

export type SalidaCalendarioItem = SalidaPublicaPar & {
  fechaInicio: string;
  fechaFin: string;
};

export interface SalidaPublicaCalendarioResponse {
  year: number;
  salidas: SalidaCalendarioItem[];
}
