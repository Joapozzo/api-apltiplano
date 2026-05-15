import type { Prisma } from "@prisma/client";
/** Precios como espera el front (`precios`, no `expedicion_precios`). */
export type PublicPrecioItem = {
    nombre_paquete: string;
    precio: number;
    moneda: string;
};
/**
 * Servicio público alineado al front: `fotos[]`, `desc` (texto card).
 */
export declare function normalizeServicioPublic<T extends {
    url_foto?: string | null;
    urls_fotos?: string[];
    desc_resumen?: string | null;
    descripcion_completa?: string | null;
}>(raw: T): T & {
    fotos: string[];
    desc: string;
};
/**
 * Expedición pública: fechas ISO string + `precios` (sin `expedicion_precios`).
 */
export declare function normalizeExpedicionPublic<T extends {
    fecha_salida: Date | string;
    fecha_fin: Date | string;
    expedicion_precios: Array<{
        nombre_paquete: string;
        precio: Prisma.Decimal | number | string;
        moneda: string;
    }>;
}>(raw: T): Omit<T, "expedicion_precios"> & {
    fecha_salida: string;
    fecha_fin: string;
    precios: PublicPrecioItem[];
};
/** Pareja servicio + expedición para listados y calendario. */
export declare function buildSalidaPar(servicioRaw: Parameters<typeof normalizeServicioPublic>[0], expedicionRaw: Parameters<typeof normalizeExpedicionPublic>[0] | null): {
    servicio: {
        url_foto?: string | null;
        urls_fotos?: string[];
        desc_resumen?: string | null;
        descripcion_completa?: string | null;
    } & {
        fotos: string[];
        desc: string;
    };
    expedicion: null;
} | {
    servicio: {
        url_foto?: string | null;
        urls_fotos?: string[];
        desc_resumen?: string | null;
        descripcion_completa?: string | null;
    } & {
        fotos: string[];
        desc: string;
    };
    expedicion: Omit<{
        fecha_salida: Date | string;
        fecha_fin: Date | string;
        expedicion_precios: Array<{
            nombre_paquete: string;
            precio: Prisma.Decimal | number | string;
            moneda: string;
        }>;
    }, "expedicion_precios"> & {
        fecha_salida: string;
        fecha_fin: string;
        precios: PublicPrecioItem[];
    };
};
//# sourceMappingURL=public-serializers.d.ts.map