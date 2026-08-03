import { DIFICULTAD_TECNICA_VALUES, EXIGENCIA_FISICA_VALUES, } from "../constants/servicio-nivel.js";
/** Legacy msnm slugs → id_dificultad (seed: Inicial=4, Intermedio=1, Avanzado=2). */
const LEGACY_DIFICULTAD_TO_ID = {
    inicial: 4,
    medio: 1,
    intermedio: 1,
    avanzado: 2,
    // legacy aliases
    moderada: 1,
    "media-alta": 2,
    exigente: 2,
};
function isExigenciaFisica(v) {
    return EXIGENCIA_FISICA_VALUES.includes(v);
}
function isDificultadTecnica(v) {
    return DIFICULTAD_TECNICA_VALUES.includes(v);
}
/**
 * Filtro público: búsqueda + nivel (`id_dificultad`) + exigencia física + dificultad técnica.
 * Nivel acepta: "todas" | id numérico | slug legacy (inicial|medio|avanzado).
 */
export function buildServicioPublicWhere(q, dificultad = "todas", exigencia_fisica = "todas", dificultad_tecnica = "todas") {
    const where = {};
    if (q) {
        where.OR = [
            { nombre: { contains: q, mode: "insensitive" } },
            { desc_resumen: { contains: q, mode: "insensitive" } },
            { descripcion_completa: { contains: q, mode: "insensitive" } },
        ];
    }
    if (dificultad && dificultad !== "todas") {
        const asNum = Number.parseInt(String(dificultad), 10);
        if (Number.isFinite(asNum) && asNum > 0) {
            where.id_dificultad = asNum;
        }
        else {
            const legacyId = LEGACY_DIFICULTAD_TO_ID[String(dificultad).toLowerCase()];
            if (legacyId) {
                where.id_dificultad = legacyId;
            }
        }
    }
    if (exigencia_fisica && exigencia_fisica !== "todas" && isExigenciaFisica(exigencia_fisica)) {
        where.exigencia_fisica = exigencia_fisica;
    }
    if (dificultad_tecnica &&
        dificultad_tecnica !== "todas" &&
        isDificultadTecnica(dificultad_tecnica)) {
        where.dificultad_tecnica = dificultad_tecnica;
    }
    return where;
}
//# sourceMappingURL=public-filters.js.map