import { z } from "zod";
/**
 * Cuerpos para crear entradas de catálogo desde el admin (alta rápida).
 */
export const createUbicacionSchema = z.object({
    pais: z.string().trim().min(1, "El país es obligatorio"),
    provincia: z.string().trim().min(1, "La provincia es obligatoria"),
    zona: z.string().trim().min(1, "La zona es obligatoria"),
    orden: z.coerce.number().int().min(0).optional(),
});
export const createLugarSchema = z.object({
    nombre: z.string().trim().min(1, "El nombre es obligatorio"),
    id_ubicacion: z.coerce.number().int().positive().optional(),
    tipo_lugar: z.string().trim().min(1).optional(),
    altitud: z.coerce.number().int().min(0).optional(),
    descripcion: z.string().trim().optional().nullable(),
    orden: z.coerce.number().int().min(0).optional(),
});
export const createActividadSchema = z.object({
    nombre: z.string().trim().min(1, "El nombre es obligatorio"),
    descripcion: z.string().trim().optional().nullable(),
    orden: z.coerce.number().int().min(0).optional(),
});
export const createDificultadSchema = z.object({
    nivel: z.string().trim().min(1, "El nivel es obligatorio"),
    descripcion: z.string().trim().optional().nullable(),
    orden: z.coerce.number().int().min(0).optional(),
});
//# sourceMappingURL=catalogos.dto.js.map