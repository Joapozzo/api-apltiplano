import { issueCsrfToken } from "../middlewares/csrf.js";
import { CoordinadoresService } from "../services/coordinadores.service.js";
import { z } from "zod";
import { parseParamId } from "../utils/express-helpers.js";
const createCoordinadorSchema = z.object({
    nombre: z.string().min(1, "El nombre es requerido"),
    apellido: z.string().min(1, "El apellido es requerido"),
    dni: z.string().min(1, "El DNI es requerido"),
    certificaciones: z.array(z.string()).optional(),
    especialidades: z.array(z.string()).optional(),
});
const updateCoordinadorSchema = z.object({
    nombre: z.string().min(1).optional(),
    apellido: z.string().min(1).optional(),
    dni: z.string().min(1).optional(),
    certificaciones: z.array(z.string()).optional(),
    especialidades: z.array(z.string()).optional(),
    activo: z.boolean().optional(),
});
const asignarExpedicionSchema = z.object({
    id_expedicion: z.number().int().positive("ID de expedición inválido"),
    rol: z.string().min(1, "El rol es requerido"),
});
export class CoordinadoresController {
    static async list(req, res) {
        try {
            const activo = req.query.activo === "true" ? true : req.query.activo === "false" ? false : undefined;
            const search = typeof req.query.search === "string" ? req.query.search : undefined;
            const filters = {};
            if (activo !== undefined)
                filters.activo = activo;
            if (search)
                filters.search = search;
            const result = await CoordinadoresService.list(filters);
            const csrfToken = issueCsrfToken(req, res);
            res.json({ ...result, csrfToken });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Error al listar coordinadores";
            const err = { success: false, error: message };
            res.status(500).json(err);
        }
    }
    static async getById(req, res) {
        try {
            const paramId = parseParamId(req.params.id);
            if (!paramId) {
                const err = { success: false, error: "ID inválido" };
                return res.status(400).json(err);
            }
            const id = parseInt(paramId, 10);
            if (isNaN(id)) {
                const err = { success: false, error: "ID inválido" };
                return res.status(400).json(err);
            }
            const result = await CoordinadoresService.getById(id);
            res.json(result);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Error al obtener coordinador";
            const err = { success: false, error: message };
            const status = message === "Coordinador no encontrado" ? 404 : 500;
            res.status(status).json(err);
        }
    }
    static async create(req, res) {
        try {
            const parsed = createCoordinadorSchema.safeParse(req.body);
            if (!parsed.success) {
                const err = {
                    success: false,
                    error: "Datos inválidos",
                    message: parsed.error.issues.map((i) => i.message).join("; "),
                };
                return res.status(400).json(err);
            }
            const createData = parsed.data;
            const result = await CoordinadoresService.create({
                nombre: createData.nombre,
                apellido: createData.apellido,
                dni: createData.dni,
                ...(createData.certificaciones !== undefined && { certificaciones: createData.certificaciones }),
                ...(createData.especialidades !== undefined && { especialidades: createData.especialidades }),
            });
            res.status(201).json(result);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Error al crear coordinador";
            const err = { success: false, error: message };
            const status = message.includes("Ya existe") ? 409 : 500;
            res.status(status).json(err);
        }
    }
    static async update(req, res) {
        try {
            const paramId = parseParamId(req.params.id);
            if (!paramId) {
                const err = { success: false, error: "ID inválido" };
                return res.status(400).json(err);
            }
            const id = parseInt(paramId, 10);
            if (isNaN(id)) {
                const err = { success: false, error: "ID inválido" };
                return res.status(400).json(err);
            }
            const parsed = updateCoordinadorSchema.safeParse(req.body);
            if (!parsed.success) {
                const err = {
                    success: false,
                    error: "Datos inválidos",
                    message: parsed.error.issues.map((i) => i.message).join("; "),
                };
                return res.status(400).json(err);
            }
            const updateData = parsed.data;
            const result = await CoordinadoresService.update(id, {
                ...(updateData.nombre !== undefined && { nombre: updateData.nombre }),
                ...(updateData.apellido !== undefined && { apellido: updateData.apellido }),
                ...(updateData.dni !== undefined && { dni: updateData.dni }),
                ...(updateData.certificaciones !== undefined && { certificaciones: updateData.certificaciones }),
                ...(updateData.especialidades !== undefined && { especialidades: updateData.especialidades }),
                ...(updateData.activo !== undefined && { activo: updateData.activo }),
            });
            res.json(result);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Error al actualizar coordinador";
            const err = { success: false, error: message };
            const status = message === "Coordinador no encontrado" ? 404 : message.includes("Ya existe") ? 409 : 500;
            res.status(status).json(err);
        }
    }
    static async delete(req, res) {
        try {
            const paramId = parseParamId(req.params.id);
            if (!paramId) {
                const err = { success: false, error: "ID inválido" };
                return res.status(400).json(err);
            }
            const id = parseInt(paramId, 10);
            if (isNaN(id)) {
                const err = { success: false, error: "ID inválido" };
                return res.status(400).json(err);
            }
            const result = await CoordinadoresService.delete(id);
            res.json(result);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Error al eliminar coordinador";
            const err = { success: false, error: message };
            const status = message === "Coordinador no encontrado" ? 404 : 500;
            res.status(status).json(err);
        }
    }
    static async asignarAExpedicion(req, res) {
        try {
            const paramId = parseParamId(req.params.id);
            if (!paramId) {
                const err = { success: false, error: "ID inválido" };
                return res.status(400).json(err);
            }
            const id = parseInt(paramId, 10);
            if (isNaN(id)) {
                const err = { success: false, error: "ID inválido" };
                return res.status(400).json(err);
            }
            const parsed = asignarExpedicionSchema.safeParse(req.body);
            if (!parsed.success) {
                const err = {
                    success: false,
                    error: "Datos inválidos",
                    message: parsed.error.issues.map((i) => i.message).join("; "),
                };
                return res.status(400).json(err);
            }
            const result = await CoordinadoresService.asignarAExpedicion(id, parsed.data);
            res.json(result);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Error al asignar coordinador";
            const err = { success: false, error: message };
            const status = message.includes("no encontrado") ? 404 : message.includes("ya está") ? 409 : 500;
            res.status(status).json(err);
        }
    }
    static async desasignarDeExpedicion(req, res) {
        try {
            const paramId = parseParamId(req.params.id);
            const paramIdExp = parseParamId(req.params.id_expedicion);
            if (!paramId || !paramIdExp) {
                const err = { success: false, error: "ID inválido" };
                return res.status(400).json(err);
            }
            const id = parseInt(paramId, 10);
            const id_expedicion = parseInt(paramIdExp, 10);
            if (isNaN(id) || isNaN(id_expedicion)) {
                const err = { success: false, error: "ID inválido" };
                return res.status(400).json(err);
            }
            const result = await CoordinadoresService.desasignarDeExpedicion(id, id_expedicion);
            res.json(result);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Error al desasignar coordinador";
            const err = { success: false, error: message };
            const status = message.includes("no encontrado") ? 404 : 500;
            res.status(status).json(err);
        }
    }
    static async getHistorial(req, res) {
        try {
            const paramId = parseParamId(req.params.id);
            if (!paramId) {
                const err = { success: false, error: "ID inválido" };
                return res.status(400).json(err);
            }
            const id = parseInt(paramId, 10);
            if (isNaN(id)) {
                const err = { success: false, error: "ID inválido" };
                return res.status(400).json(err);
            }
            const result = await CoordinadoresService.getHistorial(id);
            res.json(result);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Error al obtener historial";
            const err = { success: false, error: message };
            const status = message === "Coordinador no encontrado" ? 404 : 500;
            res.status(status).json(err);
        }
    }
}
//# sourceMappingURL=coordinadores.controller.js.map