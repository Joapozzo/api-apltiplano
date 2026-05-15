import { ItemsServicioService, } from "../services/items-servicio.service.js";
export class ItemsServicioController {
    static async getAll(req, res) {
        try {
            const filters = {
                activo: req.query.activo
                    ? req.query.activo === "true"
                    : undefined,
                es_adicional: req.query.es_adicional
                    ? req.query.es_adicional === "true"
                    : undefined,
                categoria: req.query.categoria,
                search: req.query.search,
                page: req.query.page ? parseInt(req.query.page) : 1,
                limit: req.query.limit ? parseInt(req.query.limit) : 50,
            };
            const result = await ItemsServicioService.getAll(filters);
            res.json(result);
        }
        catch (error) {
            const errorResponse = {
                success: false,
                error: error.message || "Error al obtener items de servicio",
            };
            res.status(500).json(errorResponse);
        }
    }
    static async getById(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                const errorResponse = {
                    success: false,
                    error: "ID es requerido",
                };
                return res.status(400).json(errorResponse);
            }
            const result = await ItemsServicioService.getById(parseInt(id));
            res.json(result);
        }
        catch (error) {
            const errorResponse = {
                success: false,
                error: error.message || "Error al obtener item",
            };
            const status = error.message === "Item de servicio no encontrado" ? 404 : 500;
            res.status(status).json(errorResponse);
        }
    }
    static async getSuggestions(req, res) {
        try {
            const search = req.query.search;
            const result = await ItemsServicioService.getSuggestions(search);
            res.json(result);
        }
        catch (error) {
            const errorResponse = {
                success: false,
                error: error.message || "Error al obtener sugerencias",
            };
            res.status(500).json(errorResponse);
        }
    }
    static async create(req, res) {
        try {
            const result = await ItemsServicioService.create(req.body);
            res.status(201).json(result);
        }
        catch (error) {
            const errorResponse = {
                success: false,
                error: error.message || "Error al crear item",
            };
            res.status(500).json(errorResponse);
        }
    }
    static async update(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                const errorResponse = {
                    success: false,
                    error: "ID es requerido",
                };
                return res.status(400).json(errorResponse);
            }
            const result = await ItemsServicioService.update(parseInt(id), req.body);
            res.json(result);
        }
        catch (error) {
            const errorResponse = {
                success: false,
                error: error.message || "Error al actualizar item",
            };
            const status = error.message === "Item de servicio no encontrado" ? 404 : 500;
            res.status(status).json(errorResponse);
        }
    }
    static async delete(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                const errorResponse = {
                    success: false,
                    error: "ID es requerido",
                };
                return res.status(400).json(errorResponse);
            }
            const result = await ItemsServicioService.delete(parseInt(id));
            res.json(result);
        }
        catch (error) {
            const errorResponse = {
                success: false,
                error: error.message || "Error al eliminar item",
            };
            const status = error.message?.includes("no encontrado") || error.message?.includes("usado") ? 400 : 500;
            res.status(status).json(errorResponse);
        }
    }
}
//# sourceMappingURL=items-servicio.controller.js.map