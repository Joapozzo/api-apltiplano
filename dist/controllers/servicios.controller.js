import { ServiciosService } from "../services/servicios.service.js";
import { parseParamId } from "../utils/express-helpers.js";
export class ServiciosController {
    static async getAll(req, res) {
        try {
            const filters = {
                activo: req.query.activo
                    ? req.query.activo === "true"
                    : undefined,
                destacado: req.query.destacado
                    ? req.query.destacado === "true"
                    : undefined,
                lugar: req.query.lugar
                    ? parseInt(req.query.lugar)
                    : undefined,
                actividad: req.query.actividad
                    ? parseInt(req.query.actividad)
                    : undefined,
                dificultad: req.query.dificultad
                    ? parseInt(req.query.dificultad)
                    : undefined,
                search: req.query.search,
                page: req.query.page ? parseInt(req.query.page) : 1,
                limit: req.query.limit ? parseInt(req.query.limit) : 50,
            };
            const result = await ServiciosService.getAll(filters);
            res.json(result);
        }
        catch (error) {
            const errorResponse = {
                success: false,
                error: error.message || "Error al obtener servicios",
            };
            res.status(500).json(errorResponse);
        }
    }
    static async getById(req, res) {
        try {
            const id = parseParamId(req.params.id);
            if (!id) {
                const errorResponse = {
                    success: false,
                    error: "ID es requerido",
                };
                return res.status(400).json(errorResponse);
            }
            const result = await ServiciosService.getById(parseInt(id));
            res.json(result);
        }
        catch (error) {
            const errorResponse = {
                success: false,
                error: error.message || "Error al obtener servicio",
            };
            const status = error.message === "Servicio no encontrado" ? 404 : 500;
            res.status(status).json(errorResponse);
        }
    }
    static async getActive(req, res) {
        try {
            const result = await ServiciosService.getActive();
            res.json(result);
        }
        catch (error) {
            const errorResponse = {
                success: false,
                error: error.message || "Error al obtener servicios activos",
            };
            res.status(500).json(errorResponse);
        }
    }
    static async create(req, res) {
        try {
            const result = await ServiciosService.create(req.body);
            res.status(201).json(result);
        }
        catch (error) {
            const errorResponse = {
                success: false,
                error: error.message || "Error al crear servicio",
            };
            res.status(500).json(errorResponse);
        }
    }
    static async update(req, res) {
        try {
            const id = parseParamId(req.params.id);
            if (!id) {
                const errorResponse = {
                    success: false,
                    error: "ID es requerido",
                };
                return res.status(400).json(errorResponse);
            }
            const result = await ServiciosService.update(parseInt(id), req.body);
            res.json(result);
        }
        catch (error) {
            const errorResponse = {
                success: false,
                error: error.message || "Error al actualizar servicio",
            };
            const status = error.message === "Servicio no encontrado" ? 404 : 500;
            res.status(status).json(errorResponse);
        }
    }
    static async delete(req, res) {
        try {
            const id = parseParamId(req.params.id);
            if (!id) {
                const errorResponse = {
                    success: false,
                    error: "ID es requerido",
                };
                return res.status(400).json(errorResponse);
            }
            const result = await ServiciosService.delete(parseInt(id));
            res.json(result);
        }
        catch (error) {
            const errorResponse = {
                success: false,
                error: error.message || "Error al eliminar servicio",
            };
            const status = error.message?.includes("no encontrado") ? 404 : 500;
            res.status(status).json(errorResponse);
        }
    }
    static async toggleActivo(req, res) {
        try {
            const id = parseParamId(req.params.id);
            if (!id) {
                const errorResponse = {
                    success: false,
                    error: "ID es requerido",
                };
                return res.status(400).json(errorResponse);
            }
            const result = await ServiciosService.toggleActivo(parseInt(id));
            res.json(result);
        }
        catch (error) {
            const errorResponse = {
                success: false,
                error: error.message || "Error al actualizar estado",
            };
            const status = error.message === "Servicio no encontrado" ? 404 : 500;
            res.status(status).json(errorResponse);
        }
    }
    static async toggleDestacado(req, res) {
        try {
            const id = parseParamId(req.params.id);
            if (!id) {
                const errorResponse = {
                    success: false,
                    error: "ID es requerido",
                };
                return res.status(400).json(errorResponse);
            }
            const result = await ServiciosService.toggleDestacado(parseInt(id));
            res.json(result);
        }
        catch (error) {
            const errorResponse = {
                success: false,
                error: error.message || "Error al actualizar destacado",
            };
            const status = error.message === "Servicio no encontrado" ? 404 : 500;
            res.status(status).json(errorResponse);
        }
    }
}
//# sourceMappingURL=servicios.controller.js.map