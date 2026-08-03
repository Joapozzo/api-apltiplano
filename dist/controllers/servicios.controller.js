import { ServiciosService } from "../services/servicios.service.js";
import { parseParamId } from "../utils/express-helpers.js";
import { asyncHandler } from "../middlewares/error-handler.js";
import { AppError } from "../utils/app-error.js";
import { servicioBodyPartialSchema } from "../types/servicios.dto.js";
function parseServicioBody(body) {
    const parsed = servicioBodyPartialSchema.safeParse(body);
    if (!parsed.success) {
        const first = parsed.error.issues[0];
        throw new AppError(first?.message ?? "Datos inválidos", 400);
    }
    return parsed.data;
}
export class ServiciosController {
    static getAll = asyncHandler(async (req, res) => {
        const filters = {
            activo: req.query.activo ? req.query.activo === "true" : undefined,
            destacado: req.query.destacado ? req.query.destacado === "true" : undefined,
            lugar: req.query.lugar ? parseInt(req.query.lugar) : undefined,
            actividad: req.query.actividad ? parseInt(req.query.actividad) : undefined,
            dificultad: req.query.dificultad ? parseInt(req.query.dificultad) : undefined,
            search: req.query.search,
            page: req.query.page ? parseInt(req.query.page) : 1,
            limit: req.query.limit ? parseInt(req.query.limit) : 50,
        };
        const result = await ServiciosService.getAll(filters);
        res.json(result);
    });
    static getById = asyncHandler(async (req, res) => {
        const id = parseParamId(req.params.id);
        if (!id)
            throw new AppError("ID es requerido", 400);
        const result = await ServiciosService.getById(parseInt(id));
        res.json(result);
    });
    static getActive = asyncHandler(async (_req, res) => {
        const result = await ServiciosService.getActive();
        res.json(result);
    });
    static create = asyncHandler(async (req, res) => {
        const body = parseServicioBody(req.body);
        const result = await ServiciosService.create(body);
        res.status(201).json(result);
    });
    static update = asyncHandler(async (req, res) => {
        const id = parseParamId(req.params.id);
        if (!id)
            throw new AppError("ID es requerido", 400);
        const body = parseServicioBody(req.body);
        const result = await ServiciosService.update(parseInt(id), body);
        res.json(result);
    });
    static delete = asyncHandler(async (req, res) => {
        const id = parseParamId(req.params.id);
        if (!id)
            throw new AppError("ID es requerido", 400);
        const result = await ServiciosService.delete(parseInt(id));
        res.json(result);
    });
    static toggleActivo = asyncHandler(async (req, res) => {
        const id = parseParamId(req.params.id);
        if (!id)
            throw new AppError("ID es requerido", 400);
        const result = await ServiciosService.toggleActivo(parseInt(id));
        res.json(result);
    });
    static toggleDestacado = asyncHandler(async (req, res) => {
        const id = parseParamId(req.params.id);
        if (!id)
            throw new AppError("ID es requerido", 400);
        const result = await ServiciosService.toggleDestacado(parseInt(id));
        res.json(result);
    });
    static updateItinerarios = asyncHandler(async (req, res) => {
        const id = parseParamId(req.params.id);
        if (!id)
            throw new AppError("ID es requerido", 400);
        const result = await ServiciosService.updateItinerarios(parseInt(id), req.body);
        res.json(result);
    });
}
//# sourceMappingURL=servicios.controller.js.map