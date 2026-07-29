import { getAllUbicaciones, getUbicacionById, createUbicacion, updateUbicacion, toggleUbicacionActivo, deleteUbicacion, getAllLugares, getLugarById, createLugar, updateLugar, toggleLugarActivo, deleteLugar, getAllActividades, getActividadById, createActividad, updateActividad, toggleActividadActivo, deleteActividad, getAllDificultades, getDificultadById, createDificultad, updateDificultad, toggleDificultadActivo, deleteDificultad, getCatalogosCompletos, } from "../services/catalogos.service.js";
import { createActividadSchema, createDificultadSchema, createLugarSchema, createUbicacionSchema, } from "../types/catalogos.dto.js";
import { AppError } from "../utils/app-error.js";
import { asyncHandler } from "../middlewares/error-handler.js";
import { parseParamId } from "../utils/express-helpers.js";
function parseIdParam(req) {
    const idParam = parseParamId(req.params.id);
    if (!idParam)
        throw new AppError("ID requerido", 400);
    const id = parseInt(idParam);
    if (isNaN(id))
        throw new AppError("ID inválido", 400);
    return id;
}
export class CatalogosController {
    static getAll = asyncHandler(async (_req, res) => {
        const result = await getCatalogosCompletos();
        res.json(result);
    });
    // ============ UBICACIONES ============
    static getUbicaciones = asyncHandler(async (req, res) => {
        const activo = req.query.activo === "true" ? true : req.query.activo === "false" ? false : undefined;
        const result = await getAllUbicaciones(activo);
        res.json(result);
    });
    static getUbicacionById = asyncHandler(async (req, res) => {
        const id = parseIdParam(req);
        const result = await getUbicacionById(id);
        res.json(result);
    });
    static createUbicacion = asyncHandler(async (req, res) => {
        const payload = createUbicacionSchema.parse(req.body);
        const result = await createUbicacion({
            pais: payload.pais,
            provincia: payload.provincia,
            zona: payload.zona,
            ...(payload.orden !== undefined ? { orden: payload.orden } : {}),
        });
        res.status(201).json(result);
    });
    static updateUbicacion = asyncHandler(async (req, res) => {
        const id = parseIdParam(req);
        const data = req.body;
        const updateData = {};
        if (typeof data.pais === "string")
            updateData.pais = data.pais;
        if (typeof data.provincia === "string")
            updateData.provincia = data.provincia;
        if (typeof data.zona === "string")
            updateData.zona = data.zona;
        if (typeof data.orden === "number")
            updateData.orden = data.orden;
        if (typeof data.activo === "boolean")
            updateData.activo = data.activo;
        const result = await updateUbicacion(id, updateData);
        res.json(result);
    });
    static toggleUbicacionActivo = asyncHandler(async (req, res) => {
        const id = parseIdParam(req);
        const result = await toggleUbicacionActivo(id);
        res.json(result);
    });
    static deleteUbicacion = asyncHandler(async (req, res) => {
        const id = parseIdParam(req);
        const result = await deleteUbicacion(id);
        res.json(result);
    });
    // ============ LUGARES ============
    static getLugares = asyncHandler(async (req, res) => {
        const activo = req.query.activo === "true" ? true : req.query.activo === "false" ? false : undefined;
        const id_ubicacion = req.query.id_ubicacion ? parseInt(req.query.id_ubicacion) : undefined;
        const result = await getAllLugares(activo, id_ubicacion);
        res.json(result);
    });
    static getLugarById = asyncHandler(async (req, res) => {
        const id = parseIdParam(req);
        const result = await getLugarById(id);
        res.json(result);
    });
    static createLugar = asyncHandler(async (req, res) => {
        const payload = createLugarSchema.parse(req.body);
        const result = await createLugar({
            nombre: payload.nombre,
            ...(payload.id_ubicacion !== undefined ? { id_ubicacion: payload.id_ubicacion } : {}),
            ...(payload.tipo_lugar !== undefined ? { tipo_lugar: payload.tipo_lugar } : {}),
            ...(payload.altitud !== undefined ? { altitud: payload.altitud } : {}),
            ...(payload.descripcion !== undefined ? { descripcion: payload.descripcion } : {}),
            ...(payload.orden !== undefined ? { orden: payload.orden } : {}),
        });
        res.status(201).json(result);
    });
    static updateLugar = asyncHandler(async (req, res) => {
        const id = parseIdParam(req);
        const data = req.body;
        const updateData = {};
        if (typeof data.nombre === "string")
            updateData.nombre = data.nombre;
        if (typeof data.id_ubicacion === "number")
            updateData.id_ubicacion = data.id_ubicacion;
        if (typeof data.tipo_lugar === "string")
            updateData.tipo_lugar = data.tipo_lugar;
        if (typeof data.altitud === "number")
            updateData.altitud = data.altitud;
        if (typeof data.descripcion === "string")
            updateData.descripcion = data.descripcion;
        if (typeof data.orden === "number")
            updateData.orden = data.orden;
        if (typeof data.activo === "boolean")
            updateData.activo = data.activo;
        const result = await updateLugar(id, updateData);
        res.json(result);
    });
    static toggleLugarActivo = asyncHandler(async (req, res) => {
        const id = parseIdParam(req);
        const result = await toggleLugarActivo(id);
        res.json(result);
    });
    static deleteLugar = asyncHandler(async (req, res) => {
        const id = parseIdParam(req);
        const result = await deleteLugar(id);
        res.json(result);
    });
    // ============ ACTIVIDADES ============
    static getActividades = asyncHandler(async (req, res) => {
        const activo = req.query.activo === "true" ? true : req.query.activo === "false" ? false : undefined;
        const result = await getAllActividades(activo);
        res.json(result);
    });
    static getActividadById = asyncHandler(async (req, res) => {
        const id = parseIdParam(req);
        const result = await getActividadById(id);
        res.json(result);
    });
    static createActividad = asyncHandler(async (req, res) => {
        const payload = createActividadSchema.parse(req.body);
        const result = await createActividad({
            nombre: payload.nombre,
            ...(payload.descripcion !== undefined ? { descripcion: payload.descripcion } : {}),
            ...(payload.orden !== undefined ? { orden: payload.orden } : {}),
        });
        res.status(201).json(result);
    });
    static updateActividad = asyncHandler(async (req, res) => {
        const id = parseIdParam(req);
        const data = req.body;
        const updateData = {};
        if (typeof data.nombre === "string")
            updateData.nombre = data.nombre;
        if (typeof data.descripcion === "string")
            updateData.descripcion = data.descripcion;
        if (typeof data.orden === "number")
            updateData.orden = data.orden;
        if (typeof data.activo === "boolean")
            updateData.activo = data.activo;
        const result = await updateActividad(id, updateData);
        res.json(result);
    });
    static toggleActividadActivo = asyncHandler(async (req, res) => {
        const id = parseIdParam(req);
        const result = await toggleActividadActivo(id);
        res.json(result);
    });
    static deleteActividad = asyncHandler(async (req, res) => {
        const id = parseIdParam(req);
        const result = await deleteActividad(id);
        res.json(result);
    });
    // ============ DIFICULTADES ============
    static getDificultades = asyncHandler(async (req, res) => {
        const activo = req.query.activo === "true" ? true : req.query.activo === "false" ? false : undefined;
        const result = await getAllDificultades(activo);
        res.json(result);
    });
    static getDificultadById = asyncHandler(async (req, res) => {
        const id = parseIdParam(req);
        const result = await getDificultadById(id);
        res.json(result);
    });
    static createDificultad = asyncHandler(async (req, res) => {
        const payload = createDificultadSchema.parse(req.body);
        const result = await createDificultad({
            nivel: payload.nivel,
            ...(payload.descripcion !== undefined ? { descripcion: payload.descripcion } : {}),
            ...(payload.orden !== undefined ? { orden: payload.orden } : {}),
            ...(payload.puntaje_min !== undefined ? { puntaje_min: payload.puntaje_min } : {}),
            ...(payload.puntaje_max !== undefined ? { puntaje_max: payload.puntaje_max } : {}),
            ...(payload.recalcular_rangos !== undefined ? { recalcular_rangos: payload.recalcular_rangos } : {}),
        });
        res.status(201).json(result);
    });
    static updateDificultad = asyncHandler(async (req, res) => {
        const id = parseIdParam(req);
        const data = req.body;
        const updateData = {};
        if (typeof data.nivel === "string")
            updateData.nivel = data.nivel;
        if (typeof data.descripcion === "string")
            updateData.descripcion = data.descripcion;
        if (typeof data.orden === "number")
            updateData.orden = data.orden;
        if (typeof data.activo === "boolean")
            updateData.activo = data.activo;
        if (typeof data.puntaje_min === "number")
            updateData.puntaje_min = data.puntaje_min;
        if (typeof data.puntaje_max === "number")
            updateData.puntaje_max = data.puntaje_max;
        const result = await updateDificultad(id, updateData);
        res.json(result);
    });
    static toggleDificultadActivo = asyncHandler(async (req, res) => {
        const id = parseIdParam(req);
        const result = await toggleDificultadActivo(id);
        res.json(result);
    });
    static deleteDificultad = asyncHandler(async (req, res) => {
        const id = parseIdParam(req);
        const result = await deleteDificultad(id);
        res.json(result);
    });
}
//# sourceMappingURL=catalogos.controller.js.map