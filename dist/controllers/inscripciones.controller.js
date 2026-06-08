import { z } from "zod";
import { issueCsrfToken } from "../middlewares/csrf.js";
import { InscripcionesService } from "../services/inscripciones.service.js";
import { encryptInscripcionPii } from "../utils/data-protection.js";
import { parseParamId, parseParamIdOptional } from "../utils/express-helpers.js";
import { asyncHandler } from "../middlewares/error-handler.js";
import { AppError } from "../utils/app-error.js";
const usuarioSchema = z.object({
    nombre: z.string().min(1, "El nombre es requerido").max(100),
    apellido: z.string().min(1, "El apellido es requerido").max(100),
    dni: z.string().min(5, "DNI muy corto").max(20),
    fecha_nacimiento: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Fecha de nacimiento inválida",
    }),
    email: z.string().email("Email inválido"),
    telefono: z.string().max(20).optional(),
    provincia: z.string().max(100).optional(),
    emergencia_nombre: z.string().max(200).optional(),
    emergencia_telefono: z.string().max(20).optional(),
});
const datosMedicosSchema = z.object({
    cobertura_medica: z.string().max(200).optional(),
    grupo_sanguineo: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "DESCONOCIDO"]).optional(),
    alergias: z.boolean(),
    alergias_detalle: z.string().max(500).optional(),
    diabetes: z.boolean(),
    asma: z.boolean(),
    hipertension: z.boolean(),
    otros_antecedentes: z.string().max(500).optional(),
});
const actividadFisicaSchema = z.object({
    realiza_entrenamiento: z.boolean(),
    tipo_entrenamiento: z.string().max(100).optional(),
    frecuencia_semanal: z.number().int().min(0).max(7).optional(),
    experiencia_trekking: z.boolean(),
    altura_cm: z.number().int().min(50).max(250).optional(),
    peso_kg: z.number().int().min(30).max(300).optional(),
});
const submitInscripcionSchema = z.object({
    token: z.string().min(1, "Token es requerido"),
    usuario: usuarioSchema,
    datos_medicos: datosMedicosSchema.optional(),
    actividad_fisica: actividadFisicaSchema.optional(),
});
function parseIdNumber(value, fieldName) {
    const num = typeof value === "string" ? parseInt(value, 10) : Number(value);
    if (isNaN(num))
        throw new AppError(`${fieldName} debe ser un número válido`, 400);
    return num;
}
export class InscripcionesController {
    static generateLink = asyncHandler(async (req, res) => {
        const { id_expedicion, id_cliente, expires_in_days } = req.body;
        if (!id_expedicion)
            throw new AppError("id_expedicion es requerido", 400);
        const idExpedicionNumber = parseIdNumber(id_expedicion, "id_expedicion");
        let idClienteNumber = null;
        if (id_cliente !== undefined && id_cliente !== null && id_cliente !== "") {
            idClienteNumber = parseIdNumber(id_cliente, "id_cliente");
        }
        const result = await InscripcionesService.generateLink(idExpedicionNumber, idClienteNumber, expires_in_days || 7);
        res.json(result);
    });
    static validateToken = asyncHandler(async (req, res) => {
        const token = parseParamIdOptional(req.params.token);
        if (!token)
            throw new AppError("Token es requerido", 400);
        const result = await InscripcionesService.validateToken(token);
        if (!result.valid) {
            res.status(400).json({
                success: false,
                error: result.error || "Token inválido",
            });
            return;
        }
        const csrfToken = issueCsrfToken(req, res);
        res.json({ success: true, data: result, csrfToken });
    });
    static submit = asyncHandler(async (req, res) => {
        const parsed = submitInscripcionSchema.parse(req.body);
        const data = parsed;
        const inscripcionPii = encryptInscripcionPii({
            dni: data.usuario.dni,
            telefono: data.usuario.telefono ?? "",
            provincia: data.usuario.provincia ?? "",
            emergencia_nombre: data.usuario.emergencia_nombre ?? "",
            emergencia_telefono: data.usuario.emergencia_telefono ?? "",
        });
        const usuario = {
            nombre: data.usuario.nombre,
            apellido: data.usuario.apellido,
            dni: inscripcionPii.dni,
            fecha_nacimiento: data.usuario.fecha_nacimiento,
            email: data.usuario.email,
            telefono: inscripcionPii.telefono || undefined,
            provincia: inscripcionPii.provincia || undefined,
            emergencia_nombre: inscripcionPii.emergencia_nombre || undefined,
            emergencia_telefono: inscripcionPii.emergencia_telefono || undefined,
        };
        const datosMedicos = data.datos_medicos;
        let actividadFisica = undefined;
        if (data.actividad_fisica) {
            actividadFisica = {
                realiza_entrenamiento: data.actividad_fisica.realiza_entrenamiento,
                tipo_entrenamiento: data.actividad_fisica.tipo_entrenamiento ?? "",
                frecuencia_semanal: data.actividad_fisica.frecuencia_semanal ?? 0,
                experiencia_trekking: data.actividad_fisica.experiencia_trekking,
                altura_cm: data.actividad_fisica.altura_cm ?? 0,
                peso_kg: data.actividad_fisica.peso_kg ?? 0,
            };
        }
        const result = await InscripcionesService.submitInscripcion({
            token: data.token,
            usuario,
            ...(datosMedicos !== undefined ? { datos_medicos: datosMedicos } : {}),
            ...(actividadFisica !== undefined ? { actividad_fisica: actividadFisica } : {}),
        });
        res.json({ success: true, data: result });
    });
    static list = asyncHandler(async (req, res) => {
        const filters = {
            page: req.query.page ? parseInt(req.query.page) : 1,
            limit: req.query.limit ? parseInt(req.query.limit) : 10,
        };
        if (req.query.estado)
            filters.estado = req.query.estado;
        if (req.query.expedicion)
            filters.expedicion = parseInt(req.query.expedicion);
        if (req.query.cliente)
            filters.cliente = parseInt(req.query.cliente);
        if (req.query.activas === "true")
            filters.activas = true;
        if (req.query.detalle === "true")
            filters.detalle = true;
        if (req.query.search)
            filters.search = req.query.search;
        const result = await InscripcionesService.listInscripciones(filters);
        res.json({ success: true, data: result });
    });
    static getById = asyncHandler(async (req, res) => {
        const id = parseParamId(req.params.id);
        if (!id)
            throw new AppError("ID es requerido", 400);
        const inscripcion = await InscripcionesService.getInscripcionById(parseInt(id));
        if (!inscripcion)
            throw new AppError("Inscripción no encontrada", 404);
        res.json({ success: true, data: inscripcion });
    });
    static update = asyncHandler(async (req, res) => {
        const id = parseParamId(req.params.id);
        if (!id)
            throw new AppError("ID es requerido", 400);
        const inscripcion = await InscripcionesService.updateInscripcion(parseInt(id), req.body);
        res.json({ success: true, data: inscripcion });
    });
    static reembolsar = asyncHandler(async (req, res) => {
        const id = parseParamId(req.params.id);
        if (!id)
            throw new AppError("ID es requerido", 400);
        const inscripcion = await InscripcionesService.reembolsarInscripcion(parseInt(id));
        res.json({
            success: true,
            data: inscripcion,
            message: "Inscripción reembolsada, cupo liberado y registro eliminado",
        });
    });
    static delete = asyncHandler(async (req, res) => {
        const id = parseParamId(req.params.id);
        if (!id)
            throw new AppError("ID es requerido", 400);
        await InscripcionesService.deleteInscripcion(parseInt(id));
        res.json({ success: true, data: { message: "Inscripción eliminada" } });
    });
    static listTokens = asyncHandler(async (req, res) => {
        const filters = {
            page: req.query.page ? parseInt(req.query.page) : 1,
            limit: req.query.limit ? parseInt(req.query.limit) : 20,
        };
        if (req.query.id_expedicion)
            filters.id_expedicion = parseInt(req.query.id_expedicion);
        if (req.query.usado === "true" || req.query.usado === "false")
            filters.usado = req.query.usado === "true";
        if (req.query.expirado === "true" || req.query.expirado === "false")
            filters.expirado = req.query.expirado === "true";
        const result = await InscripcionesService.listTokens(filters);
        res.json({ success: true, data: result });
    });
    static disableToken = asyncHandler(async (req, res) => {
        const id = parseParamId(req.params.id);
        if (!id)
            throw new AppError("ID es requerido", 400);
        const result = await InscripcionesService.disableToken(parseInt(id));
        res.json({ success: true, data: result });
    });
}
//# sourceMappingURL=inscripciones.controller.js.map