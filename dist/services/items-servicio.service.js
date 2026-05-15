import { prisma } from "../database/prisma.js";
export class ItemsServicioService {
    /**
     * Obtener todos los items de servicio con filtros opcionales
     */
    static async getAll(filters = {}) {
        const page = filters.page || 1;
        const limit = filters.limit || 50;
        const skip = (page - 1) * limit;
        const where = {};
        if (filters.activo !== undefined) {
            where.activo = filters.activo;
        }
        if (filters.es_adicional !== undefined) {
            where.es_adicional = filters.es_adicional;
        }
        if (filters.categoria) {
            where.categoria = filters.categoria;
        }
        if (filters.search) {
            where.OR = [
                { nombre: { contains: filters.search, mode: "insensitive" } },
                { descripcion: { contains: filters.search, mode: "insensitive" } },
            ];
        }
        const [items, total] = await Promise.all([
            prisma.items_servicio.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    nombre: "asc",
                },
            }),
            prisma.items_servicio.count({ where }),
        ]);
        return {
            success: true,
            data: {
                data: items,
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        };
    }
    /**
     * Obtener item por ID
     */
    static async getById(id) {
        const item = await prisma.items_servicio.findUnique({
            where: { id_item_servicio: id },
        });
        if (!item) {
            throw new Error("Item de servicio no encontrado");
        }
        return {
            success: true,
            data: item,
        };
    }
    /**
     * Obtener sugerencias para autocompletado
     */
    static async getSuggestions(search) {
        const where = {
            activo: true,
        };
        if (search) {
            where.nombre = { contains: search, mode: "insensitive" };
        }
        const items = await prisma.items_servicio.findMany({
            where,
            select: {
                nombre: true,
            },
            take: 10,
            orderBy: {
                nombre: "asc",
            },
        });
        return {
            success: true,
            data: items.map((item) => item.nombre),
        };
    }
    /**
     * Crear nuevo item
     */
    static async create(data) {
        const item = await prisma.items_servicio.create({
            data: {
                nombre: data.nombre,
                descripcion: data.descripcion || null,
                categoria: data.categoria,
                es_adicional: data.es_adicional !== undefined ? data.es_adicional : false,
                activo: data.activo !== undefined ? data.activo : true,
            },
        });
        return {
            success: true,
            data: item,
        };
    }
    /**
     * Actualizar item
     */
    static async update(id, data) {
        const item = await prisma.items_servicio.update({
            where: { id_item_servicio: id },
            data: {
                nombre: data.nombre,
                descripcion: data.descripcion !== undefined ? data.descripcion : null,
                categoria: data.categoria,
                es_adicional: data.es_adicional !== undefined ? data.es_adicional : false,
                activo: data.activo !== undefined ? data.activo : true,
            },
        });
        return {
            success: true,
            data: item,
        };
    }
    /**
     * Eliminar item
     */
    static async delete(id) {
        // Verificar si el item está siendo usado
        const itemUsado = await prisma.servicio_items.findFirst({
            where: { id_item_servicio: id },
        });
        if (itemUsado) {
            throw new Error("No se puede eliminar el item porque está siendo usado en servicios");
        }
        await prisma.items_servicio.delete({
            where: { id_item_servicio: id },
        });
        return {
            success: true,
            data: { id },
        };
    }
}
//# sourceMappingURL=items-servicio.service.js.map