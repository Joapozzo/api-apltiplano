import { prisma } from "../database/prisma.js";
import { publicServicioDetailInclude } from "./public-includes.js";
import { buildServicioPublicWhere } from "../utils/public-filters.js";
import { normalizeExpedicionPublic, normalizeServicioPublic, } from "../utils/public-serializers.js";
import { sortCatalogoServicioPares } from "../utils/public-sort.js";
import { findServicioActivoPorSlugIdentificador } from "../utils/find-servicio-public.js";
function startOfTodayLocal() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}
export class PublicServiciosService {
    /**
     * Catálogo: todos los servicios activos (con o sin próxima salida), filtros y orden.
     */
    static async listCatalog(query) {
        const filtroExtra = buildServicioPublicWhere(query.q, query.dificultad);
        const where = {
            activo: true,
            ...(query.destacado === true ? { destacado: true } : {}),
            ...filtroExtra,
        };
        const catalogSelect = {
            id_servicio: true,
            slug: true,
            nombre: true,
            id_lugar: true,
            id_actividad: true,
            id_dificultad: true,
            url_foto: true,
            urls_fotos: true,
            desc_resumen: true,
            descripcion_completa: true,
            destacado: true,
            activo: true,
            duracion_dias: true,
            duracion_noches: true,
            altura_maxima: true,
            cupos_maximos: true,
            servicios_adicionales_disponibles: true,
            dificultades: { select: { id_dificultad: true, nivel: true } },
            expediciones: {
                where: {
                    OR: [{ estado: "A" }, { estado: "Activa" }],
                    fecha_salida: { gte: startOfTodayLocal() },
                },
                orderBy: { fecha_salida: "asc" },
                take: 1,
                select: {
                    id_expedicion: true,
                    id_servicio: true,
                    fecha_salida: true,
                    fecha_fin: true,
                    cupos_disponibles: true,
                    cupos_ocupados: true,
                    estado: true,
                    expedicion_precios: {
                        select: { nombre_paquete: true, precio: true, moneda: true },
                    },
                },
            },
        };
        const [total, rows] = await Promise.all([
            prisma.servicios.count({ where }),
            prisma.servicios.findMany({
                where,
                select: catalogSelect,
            }),
        ]);
        const items = rows.map((row) => {
            const { expediciones, ...servicioRaw } = row;
            const servicioNorm = normalizeServicioPublic(servicioRaw);
            const prox = expediciones[0];
            if (!prox) {
                return {
                    servicio: servicioNorm,
                    expedicion: null,
                };
            }
            const expedicionNorm = normalizeExpedicionPublic({
                ...prox,
                expedicion_precios: prox.expedicion_precios ?? [],
            });
            return {
                servicio: servicioNorm,
                expedicion: expedicionNorm,
            };
        });
        const sorted = sortCatalogoServicioPares(items, query.orden);
        const page = query.page;
        const limit = query.limit;
        const skip = (page - 1) * limit;
        const data = sorted.slice(skip, skip + limit);
        return {
            success: true,
            data: {
                data,
                total,
                page,
                limit,
                pages: Math.max(1, Math.ceil(total / limit)),
            },
        };
    }
    static async getByIdentificador(identificador) {
        const esId = /^\d+$/.test(identificador);
        const servicioBase = esId
            ? await prisma.servicios.findFirst({
                where: { id_servicio: parseInt(identificador, 10), activo: true },
            })
            : await findServicioActivoPorSlugIdentificador(identificador);
        if (!servicioBase) {
            throw new Error("Servicio no encontrado");
        }
        const servicio = await prisma.servicios.findFirst({
            where: { id_servicio: servicioBase.id_servicio, activo: true },
            include: {
                ...publicServicioDetailInclude,
                expediciones: {
                    where: {
                        OR: [{ estado: "A" }, { estado: "Activa" }],
                        fecha_salida: { gte: startOfTodayLocal() },
                    },
                    orderBy: { fecha_salida: "asc" },
                    take: 1,
                    include: {
                        expedicion_precios: true,
                    },
                },
            },
        });
        if (!servicio) {
            throw new Error("Servicio no encontrado");
        }
        const proxima = servicio.expediciones[0];
        const { expediciones: _exp, ...servicioRow } = servicio;
        const servicioNorm = normalizeServicioPublic(servicioRow);
        if (proxima) {
            const expedicionNorm = normalizeExpedicionPublic({
                ...proxima,
                expedicion_precios: proxima.expedicion_precios ?? [],
            });
            return {
                success: true,
                data: {
                    servicio: servicioNorm,
                    expedicion: expedicionNorm,
                },
            };
        }
        return {
            success: true,
            data: {
                servicio: servicioNorm,
                expedicion: null,
            },
        };
    }
}
//# sourceMappingURL=public-servicios.service.js.map