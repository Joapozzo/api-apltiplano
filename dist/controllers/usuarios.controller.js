import { z } from "zod";
import { UsuariosService } from "../services/usuarios.service.js";
import { asyncHandler } from "../middlewares/error-handler.js";
import { AppError } from "../utils/app-error.js";
const listQuerySchema = z.object({
    search: z.string().trim().min(1).optional(),
    role: z.enum(["USER", "ADMIN"]).optional(),
    activo: z
        .enum(["true", "false"])
        .transform((value) => value === "true")
        .optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
});
const userIdParamSchema = z.object({
    id: z.coerce.number().int().positive(),
});
const createUserSchema = z.object({
    email: z.string().trim().email("Email inválido"),
    nombre: z.string().trim().min(1, "El nombre es obligatorio"),
    apellido: z.string().trim().min(1, "El apellido es obligatorio"),
    username: z.string().trim().min(1).optional(),
    rol: z.enum(["USER", "ADMIN"]).optional(),
    crear_perfil_cliente: z.boolean().optional(),
    password: z.string().trim().min(8, "La contraseña debe tener al menos 8 caracteres").optional(),
    activo: z.boolean().optional(),
});
const updateUserSchema = z
    .object({
    nombre: z.string().trim().min(1).optional(),
    apellido: z.string().trim().min(1).optional(),
    username: z.string().trim().min(1).nullable().optional(),
})
    .refine((data) => Object.keys(data).length > 0, {
    message: "DebEs enviar al menos un campo para actualizar",
});
const updateActivoSchema = z.object({
    activo: z.boolean(),
});
const updateRoleSchema = z.object({
    rol: z.enum(["USER", "ADMIN"]),
});
export class UsuariosController {
    static getAll = asyncHandler(async (req, res) => {
        const filters = listQuerySchema.parse(req.query);
        const result = await UsuariosService.getAll(filters);
        res.json(result);
    });
    static getById = asyncHandler(async (req, res) => {
        const { id } = userIdParamSchema.parse(req.params);
        const result = await UsuariosService.getById(id);
        res.json(result);
    });
    static getMe = asyncHandler(async (req, res) => {
        if (!req.auth)
            throw new AppError("La solicitud no estA autenticada", 401);
        const result = await UsuariosService.getMe(req.auth.id_usuario);
        res.json(result);
    });
    static create = asyncHandler(async (req, res) => {
        const payload = createUserSchema.parse(req.body);
        const result = await UsuariosService.create(payload);
        res.status(201).json(result);
    });
    static update = asyncHandler(async (req, res) => {
        const { id } = userIdParamSchema.parse(req.params);
        const payload = updateUserSchema.parse(req.body);
        const result = await UsuariosService.update(id, payload);
        res.json(result);
    });
    static updateMe = asyncHandler(async (req, res) => {
        if (!req.auth)
            throw new AppError("La solicitud no estA autenticada", 401);
        const payload = updateUserSchema.parse(req.body);
        const result = await UsuariosService.updateMe(req.auth.id_usuario, payload);
        res.json(result);
    });
    static updateActivo = asyncHandler(async (req, res) => {
        const { id } = userIdParamSchema.parse(req.params);
        const payload = updateActivoSchema.parse(req.body);
        const result = await UsuariosService.setActivo(id, payload.activo);
        res.json(result);
    });
    static updateRol = asyncHandler(async (req, res) => {
        const { id } = userIdParamSchema.parse(req.params);
        const payload = updateRoleSchema.parse(req.body);
        const result = await UsuariosService.setRole(id, payload.rol);
        res.json(result);
    });
}
//# sourceMappingURL=usuarios.controller.js.map