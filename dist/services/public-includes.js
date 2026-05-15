/** Servicio completo para ficha pública (hero, galería, itinerario, etc.) */
export const publicServicioDetailInclude = {
    lugares: {
        include: {
            ubicaciones: true,
        },
    },
    actividades: true,
    dificultades: true,
    itinerarios: {
        orderBy: { dia: "asc" },
    },
    servicio_items: {
        include: {
            items_servicio: true,
        },
    },
};
export const publicExpedicionDetailInclude = {
    servicios: {
        include: publicServicioDetailInclude,
    },
    expedicion_precios: true,
};
//# sourceMappingURL=public-includes.js.map