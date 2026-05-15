/** Servicio completo para ficha pública (hero, galería, itinerario, etc.) */
export declare const publicServicioDetailInclude: {
    lugares: {
        include: {
            ubicaciones: true;
        };
    };
    actividades: true;
    dificultades: true;
    itinerarios: {
        orderBy: {
            dia: "asc";
        };
    };
    servicio_items: {
        include: {
            items_servicio: true;
        };
    };
};
export declare const publicExpedicionDetailInclude: {
    servicios: {
        include: {
            lugares: {
                include: {
                    ubicaciones: true;
                };
            };
            actividades: true;
            dificultades: true;
            itinerarios: {
                orderBy: {
                    dia: "asc";
                };
            };
            servicio_items: {
                include: {
                    items_servicio: true;
                };
            };
        };
    };
    expedicion_precios: true;
};
//# sourceMappingURL=public-includes.d.ts.map