import { CatalogosService } from "../services/catalogos.service.js";
export class CatalogosController {
    static async getLugares(req, res) {
        try {
            const result = await CatalogosService.getLugares();
            res.json(result);
        }
        catch (error) {
            const errorResponse = {
                success: false,
                error: error.message || "Error al obtener lugares",
            };
            res.status(500).json(errorResponse);
        }
    }
    static async getActividades(req, res) {
        try {
            const result = await CatalogosService.getActividades();
            res.json(result);
        }
        catch (error) {
            const errorResponse = {
                success: false,
                error: error.message || "Error al obtener actividades",
            };
            res.status(500).json(errorResponse);
        }
    }
    static async getDificultades(req, res) {
        try {
            const result = await CatalogosService.getDificultades();
            res.json(result);
        }
        catch (error) {
            const errorResponse = {
                success: false,
                error: error.message || "Error al obtener dificultades",
            };
            res.status(500).json(errorResponse);
        }
    }
    static async getAll(req, res) {
        try {
            const [lugares, actividades, dificultades] = await Promise.all([
                CatalogosService.getLugares(),
                CatalogosService.getActividades(),
                CatalogosService.getDificultades(),
            ]);
            res.json({
                success: true,
                data: {
                    lugares: lugares.data,
                    actividades: actividades.data,
                    dificultades: dificultades.data,
                },
            });
        }
        catch (error) {
            const errorResponse = {
                success: false,
                error: error.message || "Error al obtener catálogos",
            };
            res.status(500).json(errorResponse);
        }
    }
    static async createLugar(req, res) {
        try {
            const result = await CatalogosService.createLugar(req.body);
            res.status(201).json(result);
        }
        catch (error) {
            const errorResponse = {
                success: false,
                error: error.message || "Error al crear lugar",
            };
            const status = error.message?.includes("obligatorio") ? 400 : 500;
            res.status(status).json(errorResponse);
        }
    }
    static async createActividad(req, res) {
        try {
            const result = await CatalogosService.createActividad(req.body);
            res.status(201).json(result);
        }
        catch (error) {
            const errorResponse = {
                success: false,
                error: error.message || "Error al crear actividad",
            };
            const status = error.message?.includes("obligatorio") ? 400 : 500;
            res.status(status).json(errorResponse);
        }
    }
}
//# sourceMappingURL=catalogos.controller.js.map