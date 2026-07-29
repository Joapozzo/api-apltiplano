/** Legacy msnm slugs → id_dificultad (seed: Inicial=4, Moderada=1, Media-alta=2, Exigente=3). */
const LEGACY_DIFICULTAD_TO_ID = {
    inicial: 4,
    medio: 1,
    avanzado: 3,
};
/**
 * Filtro público: búsqueda + dificultad por id_dificultad (fuente de verdad = catálogo dificultades).
 * Acepta: "todas" | id numérico | slug legacy (inicial|medio|avanzado).
 */
export function buildServicioPublicWhere(q, dificultad = "todas") {
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
    return where;
}
//# sourceMappingURL=public-filters.js.map