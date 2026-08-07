import { z } from "zod";
import { issueCsrfToken } from "../middlewares/csrf.js";
import { InscripcionesService } from "../services/inscripciones.service.js";
import { encryptInscripcionPii, encryptDatosMedicosFields, } from "../utils/data-protection.js";
import { parseParamId, parseParamIdOptional } from "../utils/express-helpers.js";
import { asyncHandler } from "../middlewares/error-handler.js";
import { AppError } from "../utils/app-error.js";
const usuarioSchema = z.object({
    nombre: z.string().min(1, "El nombre es requerido").max(100),
    apellido: z.string().min(1, "El apellido es requerido").max(100),
    dni: z.string().min(5, "Documento muy corto").max(20),
    fecha_nacimiento: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Fecha de nacimiento inválida",
    }),
    email: z.string().email("Email inválido"),
    telefono: z.string().min(8, "El teléfono debe tener al menos 8 caracteres").max(20),
    provincia: z.string().min(1, "La provincia es requerida").max(100),
    localidad: z.string().min(1, "La localidad es requerida").max(100),
    nacionalidad: z.string().min(1, "La nacionalidad es requerida").max(100),
    emergencia_nombre: z.string().min(2, "El nombre del contacto es requerido").max(200),
    emergencia_telefono: z.string().min(8, "El teléfono de emergencia es requerido").max(20),
    emergencia_vinculo: z.string().min(1, "El vínculo es requerido").max(100),
});
const datosMedicosSchema = z
    .object({
    cobertura_medica: z.string().max(200).optional(),
    grupo_sanguineo: z
        .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "DESCONOCIDO", ""])
        .optional(),
    alergias: z.boolean(),
    alergias_detalle: z.string().max(500).optional(),
    diabetes: z.boolean(),
    asma: z.boolean(),
    hipertension: z.boolean(),
    otros_antecedentes: z.string().max(500).optional(),
    toma_medicacion: z.boolean(),
    medicacion_detalle: z.string().max(500).optional(),
    tratamiento_medico: z.boolean(),
    usa_lentes: z.boolean(),
    lentes_detalle: z.string().max(500).optional(),
    estado_salud: z.string().max(500).optional(),
    restricciones_alimentarias: z.string().min(1, "Indicá restricciones alimentarias o 'No'").max(500),
    celiaquia: z.boolean(),
    epilepsia: z.boolean(),
    corazon: z.boolean(),
    convulsiones: z.boolean(),
    hepatitis: z.boolean(),
    problemas_respiratorios: z.boolean(),
    enfermedades_sangre: z.boolean(),
    problemas_auditivos: z.boolean(),
    fuma: z.boolean(),
    vertigo: z.boolean(),
    ataques_panico: z.boolean(),
    antecedentes_detalle: z.string().max(1000).optional(),
    operaciones: z.string().min(1, "Indicá operaciones o 'No'").max(500),
    lesiones: z.string().min(1, "Indicá lesiones o 'No'").max(500),
    limitante_fisica: z.boolean(),
})
    .superRefine((data, ctx) => {
    if (data.toma_medicacion && !data.medicacion_detalle?.trim()) {
        ctx.addIssue({
            code: "custom",
            path: ["medicacion_detalle"],
            message: "Indicá medicación y dosis",
        });
    }
    if (data.usa_lentes && !data.lentes_detalle?.trim()) {
        ctx.addIssue({
            code: "custom",
            path: ["lentes_detalle"],
            message: "Indicá el tipo de lentes",
        });
    }
    const antecedentesKeys = [
        "alergias",
        "celiaquia",
        "asma",
        "diabetes",
        "epilepsia",
        "corazon",
        "convulsiones",
        "hipertension",
        "hepatitis",
        "problemas_respiratorios",
        "enfermedades_sangre",
        "problemas_auditivos",
        "fuma",
        "vertigo",
        "ataques_panico",
    ];
    const hasSi = antecedentesKeys.some((k) => data[k] === true);
    if (hasSi && !data.antecedentes_detalle?.trim()) {
        ctx.addIssue({
            code: "custom",
            path: ["antecedentes_detalle"],
            message: "Detallá las afecciones marcadas como Sí",
        });
    }
});
const actividadFisicaSchema = z
    .object({
    realiza_entrenamiento: z.boolean(),
    tipo_entrenamiento: z.string().max(100).optional(),
    frecuencia_semanal: z.number().int().min(1).max(7).optional(),
    experiencia_trekking: z.boolean(),
    experiencia_trekking_detalle: z.string().max(500).optional(),
    altura_cm: z.number().int().min(50).max(250),
    peso_kg: z.number().int().min(20).max(300),
    talle: z.string().min(1, "El talle es requerido").max(50),
})
    .superRefine((data, ctx) => {
    if (data.realiza_entrenamiento && !data.tipo_entrenamiento?.trim()) {
        ctx.addIssue({
            code: "custom",
            path: ["tipo_entrenamiento"],
            message: "Indicá el tipo de entrenamiento",
        });
    }
    if (data.realiza_entrenamiento && data.frecuencia_semanal == null) {
        ctx.addIssue({
            code: "custom",
            path: ["frecuencia_semanal"],
            message: "Indicá la frecuencia semanal",
        });
    }
    if (data.experiencia_trekking && !data.experiencia_trekking_detalle?.trim()) {
        ctx.addIssue({
            code: "custom",
            path: ["experiencia_trekking_detalle"],
            message: "Indicá qué actividades y cuándo",
        });
    }
});
const submitInscripcionSchema = z.object({
    token: z.string().min(1, "Token es requerido"),
    usuario: usuarioSchema,
    datos_medicos: datosMedicosSchema,
    actividad_fisica: actividadFisicaSchema,
    como_nos_conociste: z.enum(["internet", "redes", "recomendacion"], {
        message: "Seleccioná cómo nos conociste",
    }),
    acepta_riesgo: z.literal(true, {
        message: "Debés aceptar la declaración de responsabilidad",
    }),
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
        const data = submitInscripcionSchema.parse(req.body);
        const inscripcionPii = encryptInscripcionPii({
            dni: data.usuario.dni,
            telefono: data.usuario.telefono,
            provincia: data.usuario.provincia,
            localidad: data.usuario.localidad,
            nacionalidad: data.usuario.nacionalidad,
            emergencia_nombre: data.usuario.emergencia_nombre,
            emergencia_telefono: data.usuario.emergencia_telefono,
            emergencia_vinculo: data.usuario.emergencia_vinculo,
        });
        const datosMedicosEncrypted = encryptDatosMedicosFields({
            ...data.datos_medicos,
            grupo_sanguineo: data.datos_medicos.grupo_sanguineo || undefined,
        });
        const usuario = {
            nombre: data.usuario.nombre,
            apellido: data.usuario.apellido,
            dni: inscripcionPii.dni,
            fecha_nacimiento: data.usuario.fecha_nacimiento,
            email: data.usuario.email,
            telefono: inscripcionPii.telefono,
            provincia: inscripcionPii.provincia,
            localidad: inscripcionPii.localidad,
            nacionalidad: inscripcionPii.nacionalidad,
            emergencia_nombre: inscripcionPii.emergencia_nombre,
            emergencia_telefono: inscripcionPii.emergencia_telefono,
            emergencia_vinculo: inscripcionPii.emergencia_vinculo,
        };
        const dm = datosMedicosEncrypted;
        const af = data.actividad_fisica;
        const result = await InscripcionesService.submitInscripcion({
            token: data.token,
            usuario,
            datos_medicos: {
                alergias: data.datos_medicos.alergias,
                diabetes: data.datos_medicos.diabetes,
                asma: data.datos_medicos.asma,
                hipertension: data.datos_medicos.hipertension,
                toma_medicacion: data.datos_medicos.toma_medicacion,
                tratamiento_medico: data.datos_medicos.tratamiento_medico,
                usa_lentes: data.datos_medicos.usa_lentes,
                celiaquia: data.datos_medicos.celiaquia,
                epilepsia: data.datos_medicos.epilepsia,
                corazon: data.datos_medicos.corazon,
                convulsiones: data.datos_medicos.convulsiones,
                hepatitis: data.datos_medicos.hepatitis,
                problemas_respiratorios: data.datos_medicos.problemas_respiratorios,
                enfermedades_sangre: data.datos_medicos.enfermedades_sangre,
                problemas_auditivos: data.datos_medicos.problemas_auditivos,
                fuma: data.datos_medicos.fuma,
                vertigo: data.datos_medicos.vertigo,
                ataques_panico: data.datos_medicos.ataques_panico,
                limitante_fisica: data.datos_medicos.limitante_fisica,
                restricciones_alimentarias: dm.restricciones_alimentarias ?? data.datos_medicos.restricciones_alimentarias,
                operaciones: dm.operaciones ?? data.datos_medicos.operaciones,
                lesiones: dm.lesiones ?? data.datos_medicos.lesiones,
                ...(typeof dm.cobertura_medica === "string" ? { cobertura_medica: dm.cobertura_medica } : {}),
                ...(typeof dm.grupo_sanguineo === "string" && dm.grupo_sanguineo
                    ? { grupo_sanguineo: dm.grupo_sanguineo }
                    : {}),
                ...(typeof dm.alergias_detalle === "string" ? { alergias_detalle: dm.alergias_detalle } : {}),
                ...(typeof dm.otros_antecedentes === "string"
                    ? { otros_antecedentes: dm.otros_antecedentes }
                    : {}),
                ...(typeof dm.medicacion_detalle === "string"
                    ? { medicacion_detalle: dm.medicacion_detalle }
                    : {}),
                ...(typeof dm.lentes_detalle === "string" ? { lentes_detalle: dm.lentes_detalle } : {}),
                ...(typeof dm.estado_salud === "string" ? { estado_salud: dm.estado_salud } : {}),
                ...(typeof dm.antecedentes_detalle === "string"
                    ? { antecedentes_detalle: dm.antecedentes_detalle }
                    : {}),
            },
            actividad_fisica: {
                realiza_entrenamiento: af.realiza_entrenamiento,
                experiencia_trekking: af.experiencia_trekking,
                altura_cm: af.altura_cm,
                peso_kg: af.peso_kg,
                talle: af.talle,
                ...(af.tipo_entrenamiento ? { tipo_entrenamiento: af.tipo_entrenamiento } : {}),
                ...(af.frecuencia_semanal != null ? { frecuencia_semanal: af.frecuencia_semanal } : {}),
                ...(af.experiencia_trekking_detalle
                    ? { experiencia_trekking_detalle: af.experiencia_trekking_detalle }
                    : {}),
            },
            como_nos_conociste: data.como_nos_conociste,
            acepta_riesgo: true,
        });
        res.json({ success: true, data: result });
    });
    static list = asyncHandler(async (req, res) => {
        const filters = {
            page: req.query.page ? parseInt(req.query.page, 10) : 1,
            limit: req.query.limit ? parseInt(req.query.limit, 10) : 10,
        };
        if (req.query.estado)
            filters.estado = req.query.estado;
        if (req.query.expedicion)
            filters.expedicion = parseInt(req.query.expedicion, 10);
        if (req.query.cliente)
            filters.cliente = parseInt(req.query.cliente, 10);
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