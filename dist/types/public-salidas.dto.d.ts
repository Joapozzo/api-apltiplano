import { z } from "zod";
/** Query compartido: listados públicos (servicios / salidas). */
export declare const publicCatalogQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    destacado: z.ZodPipe<z.ZodOptional<z.ZodEnum<{
        true: "true";
        false: "false";
    }>>, z.ZodTransform<boolean | undefined, "true" | "false" | undefined>>;
    q: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<string | undefined, string | undefined>>;
    dificultad: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        todas: "todas";
        inicial: "inicial";
        medio: "medio";
        avanzado: "avanzado";
    }>>>;
    orden: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        nombre: "nombre";
        precio: "precio";
        dificultad: "dificultad";
        fecha: "fecha";
    }>>>;
}, z.core.$strip>;
export type PublicCatalogQuery = z.infer<typeof publicCatalogQuerySchema>;
/** @deprecated usar publicCatalogQuerySchema */
export declare const salidasListQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    destacado: z.ZodPipe<z.ZodOptional<z.ZodEnum<{
        true: "true";
        false: "false";
    }>>, z.ZodTransform<boolean | undefined, "true" | "false" | undefined>>;
    q: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<string | undefined, string | undefined>>;
    dificultad: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        todas: "todas";
        inicial: "inicial";
        medio: "medio";
        avanzado: "avanzado";
    }>>>;
    orden: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        nombre: "nombre";
        precio: "precio";
        dificultad: "dificultad";
        fecha: "fecha";
    }>>>;
}, z.core.$strip>;
export type SalidasListQuery = PublicCatalogQuery;
/** Catálogo de servicios: default limit más alto */
export declare const serviciosCatalogQuerySchema: z.ZodObject<{
    destacado: z.ZodPipe<z.ZodOptional<z.ZodEnum<{
        true: "true";
        false: "false";
    }>>, z.ZodTransform<boolean | undefined, "true" | "false" | undefined>>;
    q: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<string | undefined, string | undefined>>;
    dificultad: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        todas: "todas";
        inicial: "inicial";
        medio: "medio";
        avanzado: "avanzado";
    }>>>;
    orden: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        nombre: "nombre";
        precio: "precio";
        dificultad: "dificultad";
        fecha: "fecha";
    }>>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export type ServiciosCatalogQuery = z.infer<typeof serviciosCatalogQuerySchema>;
/** Query GET /api/user/salidas/calendario */
export declare const salidasCalendarioQuerySchema: z.ZodObject<{
    year: z.ZodCoercedNumber<unknown>;
}, z.core.$strip>;
export type SalidasCalendarioQuery = z.infer<typeof salidasCalendarioQuerySchema>;
/** Query GET /api/user/salidas/:identificador */
export declare const salidaDetalleQuerySchema: z.ZodObject<{
    id_expedicion: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export type SalidaDetalleQuery = z.infer<typeof salidaDetalleQuerySchema>;
/** Param :identificador — slug kebab-case o id numérico de expedición */
export declare const salidaIdentificadorParamSchema: z.ZodString;
/** Pareja alineada al front (servicio con fotos/desc, expedición con precios). */
export type SalidaPublicaPar = {
    servicio: Record<string, unknown> & {
        fotos: string[];
        desc: string;
    };
    expedicion: Record<string, unknown> & {
        precios: Array<{
            nombre_paquete: string;
            precio: number;
            moneda: string;
        }>;
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
//# sourceMappingURL=public-salidas.dto.d.ts.map