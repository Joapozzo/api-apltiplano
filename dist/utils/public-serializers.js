/**
 * Servicio público alineado al front: `fotos[]`, `desc` (texto card).
 */
export function normalizeServicioPublic(raw) {
    const urls = Array.isArray(raw.urls_fotos) ? raw.urls_fotos : [];
    const fotos = [raw.url_foto, ...urls].filter((x) => Boolean(x && String(x).trim()));
    const desc = (raw.desc_resumen ||
        raw.descripcion_completa ||
        "").trim();
    return {
        ...raw,
        fotos,
        desc: desc || "",
    };
}
/**
 * Expedición pública: fechas ISO string + `precios` (sin `expedicion_precios`).
 */
export function normalizeExpedicionPublic(raw) {
    const { expedicion_precios, ...rest } = raw;
    const fechaSalida = raw.fecha_salida instanceof Date
        ? raw.fecha_salida.toISOString()
        : String(raw.fecha_salida);
    const fechaFin = raw.fecha_fin instanceof Date ? raw.fecha_fin.toISOString() : String(raw.fecha_fin);
    const precios = expedicion_precios.map((p) => ({
        nombre_paquete: p.nombre_paquete,
        precio: Number(p.precio),
        moneda: p.moneda,
    }));
    return {
        ...rest,
        fecha_salida: fechaSalida,
        fecha_fin: fechaFin,
        precios,
    };
}
/** Pareja servicio + expedición para listados y calendario. */
export function buildSalidaPar(servicioRaw, expedicionRaw) {
    const servicio = normalizeServicioPublic(servicioRaw);
    if (!expedicionRaw) {
        return { servicio, expedicion: null };
    }
    const expedicion = normalizeExpedicionPublic(expedicionRaw);
    return { servicio, expedicion };
}
//# sourceMappingURL=public-serializers.js.map