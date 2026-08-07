import { formatDateOnly } from "./dates.js";
import { normalizeFocal, parseFotosFocalMap, publicIdFromImageUrl, resolveFocalForUrl, } from "./fotos-focal.js";
/**
 * Servicio público alineado al front: `fotos[]`, `desc` (texto card), focals.
 */
export function normalizeServicioPublic(raw) {
    const urls = Array.isArray(raw.urls_fotos) ? raw.urls_fotos : [];
    const fotos = [raw.url_foto, ...urls].filter((x) => Boolean(x && String(x).trim()));
    const desc = (raw.desc_resumen || raw.descripcion_completa || "").trim();
    const fotoFocal = normalizeFocal({
        x: raw.foto_focal_x ?? 0.5,
        y: raw.foto_focal_y ?? 0.5,
    });
    const focals = fotos.map((url, index) => resolveFocalForUrl(url, raw.foto_focal_x, raw.foto_focal_y, raw.fotos_focal, index === 0));
    // Keep DB map out of the public payload; expose parallel array instead.
    const { fotos_focal: _dbMap, ...rest } = raw;
    return {
        ...rest,
        fotos,
        desc: desc || "",
        foto_focal: focals[0] ?? fotoFocal,
        fotos_focal: focals,
    };
}
/**
 * Expedición pública: fechas de calendario `YYYY-MM-DD` + `precios` (sin `expedicion_precios`).
 */
export function normalizeExpedicionPublic(raw) {
    const { expedicion_precios, ...rest } = raw;
    const fechaSalida = formatDateOnly(raw.fecha_salida) ?? String(raw.fecha_salida).slice(0, 10);
    const fechaFin = formatDateOnly(raw.fecha_fin) ?? String(raw.fecha_fin).slice(0, 10);
    const presupuestoValidoHasta = raw.presupuesto_valido_hasta == null || raw.presupuesto_valido_hasta === ""
        ? null
        : formatDateOnly(raw.presupuesto_valido_hasta);
    const precios = expedicion_precios.map((p) => ({
        nombre_paquete: p.nombre_paquete,
        precio: Number(p.precio),
        moneda: p.moneda,
    }));
    return {
        ...rest,
        fecha_salida: fechaSalida,
        fecha_fin: fechaFin,
        ...(raw.presupuesto_valido_hasta !== undefined
            ? { presupuesto_valido_hasta: presupuestoValidoHasta }
            : {}),
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
/** Re-export helpers used by admin when promoting principal. */
export { parseFotosFocalMap, publicIdFromImageUrl, resolveFocalForUrl };
//# sourceMappingURL=public-serializers.js.map