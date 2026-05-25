import { Prisma } from "@prisma/client";
import { prisma } from "../database/prisma.js";
import { assertUbicacionDeletable, assertLugarDeletable, assertActividadDeletable, assertDificultadDeletable, CatalogosServiceError, } from "../utils/catalog-referential.js";
const DEFAULT_UBICACION = {
    pais: "Argentina",
    provincia: "General",
    zona: "Sin especificar",
};
function mapCatalogosWriteError(error, entityLabel) {
    if (error instanceof CatalogosServiceError) {
        throw error;
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
            throw new CatalogosServiceError(`Ya existe un/a ${entityLabel} con esos datos`, 409, "DUPLICATE_ENTRY");
        }
        if (error.code === "P2003") {
            throw new CatalogosServiceError("La ubicación seleccionada no existe", 400, "INVALID_UBICACION");
        }
    }
    throw error;
}
async function resolveUbicacionIdForLugar(id_ubicacion) {
    if (id_ubicacion !== undefined && Number.isFinite(id_ubicacion) && id_ubicacion > 0) {
        const ubicacion = await prisma.ubicaciones.findUnique({
            where: { id_ubicacion },
            select: { id_ubicacion: true },
        });
        if (!ubicacion) {
            throw new CatalogosServiceError("Ubicación no encontrada", 400, "UBICACION_NOT_FOUND");
        }
        return ubicacion.id_ubicacion;
    }
    const existing = await prisma.ubicaciones.findFirst({
        where: {
            pais: DEFAULT_UBICACION.pais,
            provincia: DEFAULT_UBICACION.provincia,
            zona: DEFAULT_UBICACION.zona,
        },
        select: { id_ubicacion: true },
    });
    if (existing) {
        return existing.id_ubicacion;
    }
    const created = await prisma.ubicaciones.create({
        data: {
            ...DEFAULT_UBICACION,
            activo: true,
            orden: 0,
        },
        select: { id_ubicacion: true },
    });
    return created.id_ubicacion;
}
// ============ UBICACIONES ============
export async function getAllUbicaciones(activo) {
    const where = activo !== undefined ? { activo } : {};
    const ubicaciones = await prisma.ubicaciones.findMany({
        where,
        orderBy: [{ orden: "asc" }, { pais: "asc" }, { provincia: "asc" }],
    });
    return { success: true, data: ubicaciones };
}
export async function getUbicacionById(id) {
    const ubicacion = await prisma.ubicaciones.findUnique({
        where: { id_ubicacion: id },
        include: { lugares: { select: { id_lugar: true, nombre: true, activo: true } } },
    });
    if (!ubicacion) {
        throw new CatalogosServiceError("Ubicación no encontrada", 404, "NOT_FOUND");
    }
    return { success: true, data: ubicacion };
}
export async function createUbicacion(data) {
    try {
        const created = await prisma.ubicaciones.create({
            data: {
                pais: data.pais.trim(),
                provincia: data.provincia.trim(),
                zona: data.zona.trim(),
                orden: data.orden ?? 0,
                activo: true,
            },
        });
        return { success: true, data: created };
    }
    catch (error) {
        mapCatalogosWriteError(error, "ubicación");
    }
}
export async function updateUbicacion(id, data) {
    const updateData = {};
    if (data.pais !== undefined)
        updateData.pais = data.pais.trim();
    if (data.provincia !== undefined)
        updateData.provincia = data.provincia.trim();
    if (data.zona !== undefined)
        updateData.zona = data.zona.trim();
    if (data.orden !== undefined)
        updateData.orden = data.orden;
    if (data.activo !== undefined)
        updateData.activo = data.activo;
    const updated = await prisma.ubicaciones.update({
        where: { id_ubicacion: id },
        data: updateData,
    });
    return { success: true, data: updated };
}
export async function toggleUbicacionActivo(id) {
    const existing = await prisma.ubicaciones.findUnique({
        where: { id_ubicacion: id },
        select: { activo: true },
    });
    if (!existing) {
        throw new CatalogosServiceError("Ubicación no encontrada", 404, "NOT_FOUND");
    }
    const updated = await prisma.ubicaciones.update({
        where: { id_ubicacion: id },
        data: { activo: !existing.activo },
    });
    return { success: true, data: updated };
}
export async function deleteUbicacion(id) {
    await assertUbicacionDeletable(id);
    await prisma.ubicaciones.delete({ where: { id_ubicacion: id } });
    return { success: true, data: { id } };
}
// ============ LUGARES ============
export async function getAllLugares(activo, id_ubicacion) {
    const where = {};
    if (activo !== undefined)
        where.activo = activo;
    if (id_ubicacion !== undefined)
        where.id_ubicacion = id_ubicacion;
    const lugares = await prisma.lugares.findMany({
        where,
        include: { ubicaciones: { select: { pais: true, provincia: true, zona: true } } },
        orderBy: [{ orden: "asc" }, { nombre: "asc" }],
    });
    return { success: true, data: lugares };
}
export async function getLugarById(id) {
    const lugar = await prisma.lugares.findUnique({
        where: { id_lugar: id },
        include: {
            ubicaciones: { select: { pais: true, provincia: true, zona: true, id_ubicacion: true } },
            servicios: { select: { id_servicio: true, nombre: true } },
        },
    });
    if (!lugar) {
        throw new CatalogosServiceError("Lugar no encontrado", 404, "NOT_FOUND");
    }
    return { success: true, data: lugar };
}
export async function createLugar(data) {
    try {
        const idUbicacion = await resolveUbicacionIdForLugar(data.id_ubicacion);
        const created = await prisma.lugares.create({
            data: {
                nombre: data.nombre.trim(),
                id_ubicacion: idUbicacion,
                tipo_lugar: data.tipo_lugar?.trim() ?? "sin_clasificar",
                altitud: data.altitud ?? 0,
                descripcion: data.descripcion?.trim() || null,
                orden: data.orden ?? 0,
                activo: true,
            },
            include: { ubicaciones: { select: { pais: true, provincia: true, zona: true } } },
        });
        return { success: true, data: created };
    }
    catch (error) {
        mapCatalogosWriteError(error, "lugar");
    }
}
export async function updateLugar(id, data) {
    const updateData = {};
    if (data.nombre !== undefined)
        updateData.nombre = data.nombre.trim();
    if (data.id_ubicacion !== undefined)
        updateData.id_ubicacion = data.id_ubicacion;
    if (data.tipo_lugar !== undefined)
        updateData.tipo_lugar = data.tipo_lugar.trim();
    if (data.altitud !== undefined)
        updateData.altitud = data.altitud;
    if (data.descripcion !== undefined)
        updateData.descripcion = data.descripcion?.trim() || null;
    if (data.orden !== undefined)
        updateData.orden = data.orden;
    if (data.activo !== undefined)
        updateData.activo = data.activo;
    const updated = await prisma.lugares.update({
        where: { id_lugar: id },
        data: updateData,
        include: { ubicaciones: { select: { pais: true, provincia: true, zona: true } } },
    });
    return { success: true, data: updated };
}
export async function toggleLugarActivo(id) {
    const existing = await prisma.lugares.findUnique({
        where: { id_lugar: id },
        select: { activo: true },
    });
    if (!existing) {
        throw new CatalogosServiceError("Lugar no encontrado", 404, "NOT_FOUND");
    }
    const updated = await prisma.lugares.update({
        where: { id_lugar: id },
        data: { activo: !existing.activo },
    });
    return { success: true, data: updated };
}
export async function deleteLugar(id) {
    await assertLugarDeletable(id);
    await prisma.lugares.delete({ where: { id_lugar: id } });
    return { success: true, data: { id } };
}
// ============ ACTIVIDADES ============
export async function getAllActividades(activo) {
    const where = activo !== undefined ? { activo } : {};
    const actividades = await prisma.actividades.findMany({
        where,
        orderBy: [{ orden: "asc" }, { nombre: "asc" }],
    });
    return { success: true, data: actividades };
}
export async function getActividadById(id) {
    const actividad = await prisma.actividades.findUnique({
        where: { id_actividad: id },
        include: { servicios: { select: { id_servicio: true, nombre: true } } },
    });
    if (!actividad) {
        throw new CatalogosServiceError("Actividad no encontrada", 404, "NOT_FOUND");
    }
    return { success: true, data: actividad };
}
export async function createActividad(data) {
    try {
        const created = await prisma.actividades.create({
            data: {
                nombre: data.nombre.trim(),
                descripcion: data.descripcion?.trim() || null,
                orden: data.orden ?? 0,
                activo: true,
            },
        });
        return { success: true, data: created };
    }
    catch (error) {
        mapCatalogosWriteError(error, "actividad");
    }
}
export async function updateActividad(id, data) {
    const updateData = {};
    if (data.nombre !== undefined)
        updateData.nombre = data.nombre.trim();
    if (data.descripcion !== undefined)
        updateData.descripcion = data.descripcion?.trim() || null;
    if (data.orden !== undefined)
        updateData.orden = data.orden;
    if (data.activo !== undefined)
        updateData.activo = data.activo;
    const updated = await prisma.actividades.update({
        where: { id_actividad: id },
        data: updateData,
    });
    return { success: true, data: updated };
}
export async function toggleActividadActivo(id) {
    const existing = await prisma.actividades.findUnique({
        where: { id_actividad: id },
        select: { activo: true },
    });
    if (!existing) {
        throw new CatalogosServiceError("Actividad no encontrada", 404, "NOT_FOUND");
    }
    const updated = await prisma.actividades.update({
        where: { id_actividad: id },
        data: { activo: !existing.activo },
    });
    return { success: true, data: updated };
}
export async function deleteActividad(id) {
    await assertActividadDeletable(id);
    await prisma.actividades.delete({ where: { id_actividad: id } });
    return { success: true, data: { id } };
}
// ============ DIFICULTADES ============
export async function getAllDificultades(activo) {
    const where = activo !== undefined ? { activo } : {};
    const dificultades = await prisma.dificultades.findMany({
        where,
        orderBy: [{ orden: "asc" }, { id_dificultad: "asc" }],
    });
    return { success: true, data: dificultades };
}
export async function getDificultadById(id) {
    const dificultad = await prisma.dificultades.findUnique({
        where: { id_dificultad: id },
        include: { servicios: { select: { id_servicio: true, nombre: true } } },
    });
    if (!dificultad) {
        throw new CatalogosServiceError("Dificultad no encontrada", 404, "NOT_FOUND");
    }
    return { success: true, data: dificultad };
}
export async function createDificultad(data) {
    try {
        const created = await prisma.dificultades.create({
            data: {
                nivel: data.nivel.trim(),
                descripcion: data.descripcion?.trim() || null,
                orden: data.orden ?? 0,
                activo: true,
            },
        });
        return { success: true, data: created };
    }
    catch (error) {
        mapCatalogosWriteError(error, "dificultad");
    }
}
export async function updateDificultad(id, data) {
    const updateData = {};
    if (data.nivel !== undefined)
        updateData.nivel = data.nivel.trim();
    if (data.descripcion !== undefined)
        updateData.descripcion = data.descripcion?.trim() || null;
    if (data.orden !== undefined)
        updateData.orden = data.orden;
    if (data.activo !== undefined)
        updateData.activo = data.activo;
    const updated = await prisma.dificultades.update({
        where: { id_dificultad: id },
        data: updateData,
    });
    return { success: true, data: updated };
}
export async function toggleDificultadActivo(id) {
    const existing = await prisma.dificultades.findUnique({
        where: { id_dificultad: id },
        select: { activo: true },
    });
    if (!existing) {
        throw new CatalogosServiceError("Dificultad no encontrada", 404, "NOT_FOUND");
    }
    const updated = await prisma.dificultades.update({
        where: { id_dificultad: id },
        data: { activo: !existing.activo },
    });
    return { success: true, data: updated };
}
export async function deleteDificultad(id) {
    await assertDificultadDeletable(id);
    await prisma.dificultades.delete({ where: { id_dificultad: id } });
    return { success: true, data: { id } };
}
// ============ CATÁLOGO COMPLETO ============
export async function getCatalogosCompletos() {
    const [ubicaciones, lugares, actividades, dificultades, items] = await Promise.all([
        prisma.ubicaciones.findMany({ where: { activo: true }, orderBy: { orden: "asc" } }),
        prisma.lugares.findMany({
            where: { activo: true },
            include: { ubicaciones: { select: { pais: true, provincia: true, zona: true } } },
            orderBy: { nombre: "asc" },
        }),
        prisma.actividades.findMany({ where: { activo: true }, orderBy: { nombre: "asc" } }),
        prisma.dificultades.findMany({ where: { activo: true }, orderBy: { id_dificultad: "asc" } }),
        prisma.items_servicio.findMany({ where: { activo: true }, orderBy: { nombre: "asc" }, take: 100 }),
    ]);
    return {
        success: true,
        data: {
            ubicaciones,
            lugares,
            actividades,
            dificultades,
            items_servicio_activos: items,
        },
    };
}
//# sourceMappingURL=catalogos.service.js.map