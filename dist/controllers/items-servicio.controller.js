import { ItemsServicioService } from "../services/items-servicio.service.js";
import { parseParamId } from "../utils/express-helpers.js";
import { asyncHandler } from "../middlewares/error-handler.js";
import { AppError } from "../utils/app-error.js";
export class ItemsServicioController {
    static getAll = asyncHandler(async (req, res) => {
        const filters = {
            activo: req.query.activo ? req.query.activo === "true" : undefined,
            es_adicional: req.query.es_adicional ? req.query.es_adicional === "true" : undefined,
            categoria: req.query.categoria,
            search: req.query.search,
            page: req.query.page ? parseInt(req.query.page) : 1,
            limit: req.query.limit ? parseInt(req.query.limit) : 50,
        };
        const result = await ItemsServicioService.getAll(filters);
        res.json(result);
    });
    static getById = asyncHandler(async (req, res) => {
        const id = parseParamId(req.params.id);
        if (!id)
            throw new AppError("ID es requerido", 400);
        const result = await ItemsServicioService.getById(parseInt(id));
        res.json(result);
    });
    static getSuggestions = asyncHandler(async (req, res) => {
        const search = req.query.search;
        const result = await ItemsServicioService.getSuggestions(search);
        res.json(result);
    });
    static create = asyncHandler(async (req, res) => {
        const result = await ItemsServicioService.create(req.body);
        res.status(201).json(result);
    });
    static update = asyncHandler(async (req, res) => {
        const id = parseParamId(req.params.id);
        if (!id)
            throw new AppError("ID es requerido", 400);
        const result = await ItemsServicioService.update(parseInt(id), req.body);
        res.json(result);
    });
    static delete = asyncHandler(async (req, res) => {
        const id = parseParamId(req.params.id);
        if (!id)
            throw new AppError("ID es requerido", 400);
        const result = await ItemsServicioService.delete(parseInt(id));
        res.json(result);
    });
}
//# sourceMappingURL=items-servicio.controller.js.map