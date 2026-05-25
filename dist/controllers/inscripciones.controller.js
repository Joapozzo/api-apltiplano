import { z } from "zod";
import { InscripcionesService } from "../services/inscripciones.service.js";
import { encryptSensitiveData } from "../utils/data-protection.js";
import { parseParamId, parseParamIdOptional } from "../utils/express-helpers.js";
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
export class InscripcionesController {
    static async generateLink(req, res) {
        try {
            const { id_expedicion, id_cliente, expires_in_days } = req.body;
            if (!id_expedicion) {
                const errorResponse = {
                    success: false,
                    error: "id_expedicion es requerido",
                };
                return res.status(400).json(errorResponse);
            }
            if (!id_cliente) {
                const errorResponse = {
                    success: false,
                    error: "id_cliente es requerido",
                };
                return res.status(400).json(errorResponse);
            }
            const idExpedicionNumber = typeof id_expedicion === "string"
                ? parseInt(id_expedicion, 10)
                : Number(id_expedicion);
            const idClienteNumber = typeof id_cliente === "string"
                ? parseInt(id_cliente, 10)
                : Number(id_cliente);
            if (isNaN(idExpedicionNumber)) {
                const errorResponse = {
                    success: false,
                    error: "id_expedicion debe ser un número válido",
                };
                return res.status(400).json(errorResponse);
            }
            if (isNaN(idClienteNumber)) {
                const errorResponse = {
                    success: false,
                    error: "id_cliente debe ser un número válido",
                };
                return res.status(400).json(errorResponse);
            }
            const result = await InscripcionesService.generateLink(idExpedicionNumber, idClienteNumber, expires_in_days || 7);
            res.json(result);
        }
        catch (error) {
            console.log(error);
            const errorResponse = {
                success: false,
                error: error.message || "Error al generar el link",
            };
            res.status(400).json(errorResponse);
        }
    }
    static async validateToken(req, res) {
        try {
            const token = parseParamIdOptional(req.params.token);
            if (!token) {
                const errorResponse = {
                    success: false,
                    error: "Token es requerido",
                };
                return res.status(400).json(errorResponse);
            }
            const result = await InscripcionesService.validateToken(token);
            if (!result.valid) {
                const errorResponse = {
                    success: false,
                    error: result.error || "Token inválido",
                };
                return res.status(400).json(errorResponse);
            }
            res.json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            const errorResponse = {
                success: false,
                error: error.message || "Error al validar token",
            };
            res.status(500).json(errorResponse);
        }
    }
    static async submit(req, res) {
        try {
            const parsed = submitInscripcionSchema.safeParse(req.body);
            if (!parsed.success) {
                const errorResponse = {
                    success: false,
                    error: "Datos de inscripción inválidos",
                    details: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`),
                };
                return res.status(400).json(errorResponse);
            }
            const data = parsed.data;
            const usuario = encryptSensitiveData({
                nombre: data.usuario.nombre,
                apellido: data.usuario.apellido,
                dni: data.usuario.dni,
                fecha_nacimiento: data.usuario.fecha_nacimiento,
                email: data.usuario.email,
                telefono: data.usuario.telefono ?? "",
                provincia: data.usuario.provincia ?? "",
                emergencia_nombre: data.usuario.emergencia_nombre ?? "",
                emergencia_telefono: data.usuario.emergencia_telefono ?? "",
            });
            let datosMedicos = undefined;
            if (data.datos_medicos) {
                datosMedicos = encryptSensitiveData({
                    cobertura_medica: data.datos_medicos.cobertura_medica ?? "",
                    grupo_sanguineo: data.datos_medicos.grupo_sanguineo ?? "DESCONOCIDO",
                    alergias: data.datos_medicos.alergias,
                    alergias_detalle: data.datos_medicos.alergias_detalle ?? "",
                    diabetes: data.datos_medicos.diabetes,
                    asma: data.datos_medicos.asma,
                    hipertension: data.datos_medicos.hipertension,
                    otros_antecedentes: data.datos_medicos.otros_antecedentes ?? "",
                });
            }
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
            const serviceData = {
                token: data.token,
                usuario,
            };
            if (datosMedicos) {
                serviceData.datos_medicos = datosMedicos;
            }
            if (actividadFisica) {
                serviceData.actividad_fisica = actividadFisica;
            }
            const result = await InscripcionesService.submitInscripcion(serviceData);
            res.json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            const errorResponse = {
                success: false,
                error: error.message || "Error al procesar inscripción",
            };
            res.status(400).json(errorResponse);
        }
    }
    static async list(req, res) {
        try {
            const filters = {
                page: req.query.page ? parseInt(req.query.page) : 1,
                limit: req.query.limit ? parseInt(req.query.limit) : 10,
            };
            if (req.query.estado) {
                filters.estado = req.query.estado;
            }
            if (req.query.expedicion) {
                filters.expedicion = parseInt(req.query.expedicion);
            }
            if (req.query.search) {
                filters.search = req.query.search;
            }
            const result = await InscripcionesService.listInscripciones(filters);
            res.json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            const errorResponse = {
                success: false,
                error: error.message || "Error al obtener inscripciones",
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
            const inscripcion = await InscripcionesService.getInscripcionById(parseInt(id));
            if (!inscripcion) {
                const errorResponse = {
                    success: false,
                    error: "Inscripción no encontrada",
                };
                return res.status(404).json(errorResponse);
            }
            res.json({
                success: true,
                data: inscripcion,
            });
        }
        catch (error) {
            const errorResponse = {
                success: false,
                error: error.message || "Error al obtener inscripción",
            };
            res.status(500).json(errorResponse);
        }
    }
    static async update(req, res) {
        try {
            const id = parseParamId(req.params.id);
            const data = req.body;
            if (!id) {
                const errorResponse = {
                    success: false,
                    error: "ID es requerido",
                };
                return res.status(400).json(errorResponse);
            }
            const inscripcion = await InscripcionesService.updateInscripcion(parseInt(id), data);
            res.json({
                success: true,
                data: inscripcion,
            });
        }
        catch (error) {
            const errorResponse = {
                success: false,
                error: error.message || "Error al actualizar inscripción",
            };
            res.status(400).json(errorResponse);
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
            await InscripcionesService.deleteInscripcion(parseInt(id));
            res.json({
                success: true,
                data: { message: "Inscripción eliminada" },
            });
        }
        catch (error) {
            const errorResponse = {
                success: false,
                error: error.message || "Error al eliminar inscripción",
            };
            res.status(400).json(errorResponse);
        }
    }
    static async listTokens(req, res) {
        try {
            const filters = {
                page: req.query.page ? parseInt(req.query.page) : 1,
                limit: req.query.limit ? parseInt(req.query.limit) : 20,
            };
            if (req.query.id_expedicion) {
                filters.id_expedicion = parseInt(req.query.id_expedicion);
            }
            if (req.query.usado === "true" || req.query.usado === "false") {
                filters.usado = req.query.usado === "true";
            }
            if (req.query.expirado === "true" || req.query.expirado === "false") {
                filters.expirado = req.query.expirado === "true";
            }
            const result = await InscripcionesService.listTokens(filters);
            res.json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            const errorResponse = {
                success: false,
                error: error.message || "Error al obtener tokens",
            };
            res.status(500).json(errorResponse);
        }
    }
    static async disableToken(req, res) {
        try {
            const id = parseParamId(req.params.id);
            if (!id) {
                const errorResponse = {
                    success: false,
                    error: "ID es requerido",
                };
                return res.status(400).json(errorResponse);
            }
            const result = await InscripcionesService.disableToken(parseInt(id));
            res.json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            const errorResponse = {
                success: false,
                error: error.message || "Error al deshabilitar token",
            };
            res.status(400).json(errorResponse);
        }
    }
}
//# sourceMappingURL=inscripciones.controller.js.map