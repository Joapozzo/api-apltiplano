import type { Request, Response } from "express";
import { z } from "zod";
import { UsuariosService, UsuariosServiceError } from "../services/usuarios.service.js";

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

function handleError(error: unknown, res: Response, fallbackMessage: string) {
  if (error instanceof z.ZodError) {
    return res.status(400).json({
      success: false,
      error: error.issues[0]?.message ?? "Datos invAlidos",
      code: "INVALID_PAYLOAD",
    });
  }

  if (error instanceof UsuariosServiceError) {
    return res.status(error.status).json({
      success: false,
      error: error.message,
      code: error.code,
    });
  }

  return res.status(500).json({
    success: false,
    error: fallbackMessage,
  });
}

export class UsuariosController {
  static async getAll(req: Request, res: Response) {
    try {
      const filters = listQuerySchema.parse(req.query);
      const result = await UsuariosService.getAll(filters);
      return res.json(result);
    } catch (error) {
      return handleError(error, res, "Error al obtener usuarios");
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = userIdParamSchema.parse(req.params);
      const result = await UsuariosService.getById(id);
      return res.json(result);
    } catch (error) {
      return handleError(error, res, "Error al obtener usuario");
    }
  }

  static async getMe(req: Request, res: Response) {
    try {
      if (!req.auth) {
        return res.status(401).json({
          success: false,
          error: "La solicitud no estA autenticada",
          code: "UNAUTHENTICATED",
        });
      }

      const result = await UsuariosService.getMe(req.auth.id_usuario);
      return res.json(result);
    } catch (error) {
      return handleError(error, res, "Error al obtener el perfil");
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const payload = createUserSchema.parse(req.body);
      const result = await UsuariosService.create(payload);
      return res.status(201).json(result);
    } catch (error) {
      return handleError(error, res, "Error al crear usuario");
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = userIdParamSchema.parse(req.params);
      const payload = updateUserSchema.parse(req.body);
      const result = await UsuariosService.update(id, payload);
      return res.json(result);
    } catch (error) {
      return handleError(error, res, "Error al actualizar usuario");
    }
  }

  static async updateMe(req: Request, res: Response) {
    try {
      if (!req.auth) {
        return res.status(401).json({
          success: false,
          error: "La solicitud no estA autenticada",
          code: "UNAUTHENTICATED",
        });
      }

      const payload = updateUserSchema.parse(req.body);
      const result = await UsuariosService.updateMe(req.auth.id_usuario, payload);
      return res.json(result);
    } catch (error) {
      return handleError(error, res, "Error al actualizar el perfil");
    }
  }

  static async updateActivo(req: Request, res: Response) {
    try {
      const { id } = userIdParamSchema.parse(req.params);
      const payload = updateActivoSchema.parse(req.body);
      const result = await UsuariosService.setActivo(id, payload.activo);
      return res.json(result);
    } catch (error) {
      return handleError(error, res, "Error al actualizar el estado del usuario");
    }
  }

  static async updateRol(req: Request, res: Response) {
    try {
      const { id } = userIdParamSchema.parse(req.params);
      const payload = updateRoleSchema.parse(req.body);
      const result = await UsuariosService.setRole(id, payload.rol);
      return res.json(result);
    } catch (error) {
      return handleError(error, res, "Error al actualizar el rol del usuario");
    }
  }
}
