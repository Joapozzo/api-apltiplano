/** Filtro por nombre/resumen y por franjas de altura (como el mock del front). */
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
        if (dificultad === "inicial") {
            where.altura_maxima = { lte: 4500 };
        }
        else if (dificultad === "medio") {
            where.altura_maxima = { gt: 4500, lte: 5500 };
        }
        else if (dificultad === "avanzado") {
            where.altura_maxima = { gt: 6000 };
        }
    }
    return where;
}
//# sourceMappingURL=public-filters.js.map