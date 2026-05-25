import { ExpedicionesService } from "../services/expediciones.service.js";
import { parseParamId } from "../utils/express-helpers.js";
import { asyncHandler } from "../middlewares/error-handler.js";
import { AppError } from "../utils/app-error.js";
export class ExpedicionesController {
    static getAll = asyncHandler(async (req, res) => {
        const filters = {
            estado: req.query.estado,
            servicio: req.query.servicio ? parseInt(req.query.servicio) : undefined,
            fecha_desde: req.query.fecha_desde,
            fecha_hasta: req.query.fecha_hasta,
            search: req.query.search,
            page: req.query.page ? parseInt(req.query.page) : 1,
            limit: req.query.limit ? parseInt(req.query.limit) : 50,
        };
        const result = await ExpedicionesService.getAll(filters);
        res.json(result);
    });
    static getById = asyncHandler(async (req, res) => {
        const id = parseParamId(req.params.id);
        if (!id)
            throw new AppError("ID es requerido", 400);
        const result = await ExpedicionesService.getById(parseInt(id));
        res.json(result);
    });
    static getActive = asyncHandler(async (_req, res) => {
        const result = await ExpedicionesService.getActive();
        res.json(result);
    });
    static create = asyncHandler(async (req, res) => {
        const data = req.body;
        if (!data.id_servicio)
            throw new AppError("El servicio es requerido", 400);
        if (!data.fecha_salida || !data.fecha_fin)
            throw new AppError("Las fechas de salida y fin son requeridas", 400);
        if (!data.cupos_disponibles || data.cupos_disponibles < 1)
            throw new AppError("Los cupos disponibles deben ser al menos 1", 400);
        if (!data.precios || data.precios.length === 0)
            throw new AppError("Debe agregar al menos un precio", 400);
        const result = await ExpedicionesService.create(data);
        res.status(201).json(result);
    });
    static update = asyncHandler(async (req, res) => {
        const id = parseParamId(req.params.id);
        const data = req.body;
        if (!id)
            throw new AppError("ID es requerido", 400);
        if (!data.id_servicio)
            throw new AppError("El servicio es requerido", 400);
        if (!data.fecha_salida || !data.fecha_fin)
            throw new AppError("Las fechas de salida y fin son requeridas", 400);
        const result = await ExpedicionesService.update(parseInt(id), data);
        res.json(result);
    });
    static delete = asyncHandler(async (req, res) => {
        const id = parseParamId(req.params.id);
        if (!id)
            throw new AppError("ID es requerido", 400);
        const result = await ExpedicionesService.delete(parseInt(id));
        res.json(result);
    });
    static changeEstado = asyncHandler(async (req, res) => {
        const id = parseParamId(req.params.id);
        const { estado } = req.body;
        if (!id)
            throw new AppError("ID es requerido", 400);
        if (!estado)
            throw new AppError("El estado es requerido", 400);
        const result = await ExpedicionesService.changeEstado(parseInt(id), estado);
        res.json(result);
    });
    static recalcularCupos = asyncHandler(async (req, res) => {
        const id = parseParamId(req.params.id);
        if (!id)
            throw new AppError("ID es requerido", 400);
        const result = await ExpedicionesService.recalcularCupos(parseInt(id));
        res.json({
            success: true,
            data: result,
            message: "Cupos recalculados exitosamente",
        });
    });
}
//# sourceMappingURL=expediciones.controller.js.map