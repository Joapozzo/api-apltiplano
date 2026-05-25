import type { Request, Response } from "express";
import { z } from "zod";
import { issueCsrfToken } from "../middlewares/csrf.js";
import { InscripcionesService } from "../services/inscripciones.service.js";
import { encryptInscripcionPii } from "../utils/data-protection.js";
import type { ApiErrorResponse } from "../types/api.types.js";
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
  static async generateLink(req: Request, res: Response) {
    try {
      const { id_expedicion, id_cliente, expires_in_days } = req.body;

      if (!id_expedicion) {
        const errorResponse: ApiErrorResponse = {
          success: false,
          error: "id_expedicion es requerido",
        };
        return res.status(400).json(errorResponse);
      }

      const idExpedicionNumber =
        typeof id_expedicion === "string"
          ? parseInt(id_expedicion, 10)
          : Number(id_expedicion);

      let idClienteNumber: number | null = null;
      if (id_cliente !== undefined && id_cliente !== null && id_cliente !== "") {
        idClienteNumber =
          typeof id_cliente === "string"
            ? parseInt(id_cliente, 10)
            : Number(id_cliente);

        if (isNaN(idClienteNumber)) {
          const errorResponse: ApiErrorResponse = {
            success: false,
            error: "id_cliente debe ser un número válido",
          };
          return res.status(400).json(errorResponse);
        }
      }

      if (isNaN(idExpedicionNumber)) {
        const errorResponse: ApiErrorResponse = {
          success: false,
          error: "id_expedicion debe ser un número válido",
        };
        return res.status(400).json(errorResponse);
      }

      const result = await InscripcionesService.generateLink(
        idExpedicionNumber,
        idClienteNumber,
        expires_in_days || 7
      );

      res.json(result);
    } catch (error: any) {
      console.log(error);
      const errorResponse: ApiErrorResponse = {
        success: false,
        error: error.message || "Error al generar el link",
      };
      res.status(400).json(errorResponse);
    }
  }

  static async validateToken(req: Request, res: Response) {
    try {
      const token = parseParamIdOptional(req.params.token);

      if (!token) {
        const errorResponse: ApiErrorResponse = {
          success: false,
          error: "Token es requerido",
        };
        return res.status(400).json(errorResponse);
      }

      const result = await InscripcionesService.validateToken(token);

      if (!result.valid) {
        const errorResponse: ApiErrorResponse = {
          success: false,
          error: result.error || "Token inválido",
        };
        return res.status(400).json(errorResponse);
      }

      const csrfToken = issueCsrfToken(req, res);

      res.json({
        success: true,
        data: result,
        csrfToken,
      });
    } catch (error: any) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        error: error.message || "Error al validar token",
      };
      res.status(500).json(errorResponse);
    }
  }

  static async submit(req: Request, res: Response) {
    try {
      const parsed = submitInscripcionSchema.safeParse(req.body);

      if (!parsed.success) {
        const errorResponse: ApiErrorResponse = {
          success: false,
          error: "Datos de inscripción inválidos",
          details: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`),
        };
        return res.status(400).json(errorResponse);
      }

      const data = parsed.data;

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
        dni: inscripcionPii.dni as string,
        fecha_nacimiento: data.usuario.fecha_nacimiento,
        email: data.usuario.email,
        telefono: (inscripcionPii.telefono as string) || undefined,
        provincia: (inscripcionPii.provincia as string) || undefined,
        emergencia_nombre: (inscripcionPii.emergencia_nombre as string) || undefined,
        emergencia_telefono: (inscripcionPii.emergencia_telefono as string) || undefined,
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

      const serviceData: any = {
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
    } catch (error: any) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        error: error.message || "Error al procesar inscripción",
      };
      res.status(400).json(errorResponse);
    }
  }

  static async list(req: Request, res: Response) {
    try {
      const filters: {
        estado?: string;
        expedicion?: number;
        cliente?: number;
        activas?: boolean;
        detalle?: boolean;
        search?: string;
        page?: number;
        limit?: number;
      } = {
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
      };

      if (req.query.estado) {
        filters.estado = req.query.estado as string;
      }
      if (req.query.expedicion) {
        filters.expedicion = parseInt(req.query.expedicion as string);
      }
      if (req.query.cliente) {
        filters.cliente = parseInt(req.query.cliente as string);
      }
      if (req.query.activas === "true") {
        filters.activas = true;
      }
      if (req.query.detalle === "true") {
        filters.detalle = true;
      }
      if (req.query.search) {
        filters.search = req.query.search as string;
      }

      const result = await InscripcionesService.listInscripciones(filters);

      res.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        error: error.message || "Error al obtener inscripciones",
      };
      res.status(500).json(errorResponse);
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const id = parseParamId(req.params.id);

      if (!id) {
        const errorResponse: ApiErrorResponse = {
          success: false,
          error: "ID es requerido",
        };
        return res.status(400).json(errorResponse);
      }

      const inscripcion = await InscripcionesService.getInscripcionById(
        parseInt(id)
      );

      if (!inscripcion) {
        const errorResponse: ApiErrorResponse = {
          success: false,
          error: "Inscripción no encontrada",
        };
        return res.status(404).json(errorResponse);
      }

      res.json({
        success: true,
        data: inscripcion,
      });
    } catch (error: any) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        error: error.message || "Error al obtener inscripción",
      };
      res.status(500).json(errorResponse);
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const id = parseParamId(req.params.id);
      const data = req.body;

      if (!id) {
        const errorResponse: ApiErrorResponse = {
          success: false,
          error: "ID es requerido",
        };
        return res.status(400).json(errorResponse);
      }

      const inscripcion = await InscripcionesService.updateInscripcion(
        parseInt(id),
        data
      );

      res.json({
        success: true,
        data: inscripcion,
      });
    } catch (error: any) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        error: error.message || "Error al actualizar inscripción",
      };
      res.status(400).json(errorResponse);
    }
  }

  static async reembolsar(req: Request, res: Response) {
    try {
      const id = parseParamId(req.params.id);

      if (!id) {
        const errorResponse: ApiErrorResponse = {
          success: false,
          error: "ID es requerido",
        };
        return res.status(400).json(errorResponse);
      }

      const inscripcion = await InscripcionesService.reembolsarInscripcion(parseInt(id));

      res.json({
        success: true,
        data: inscripcion,
        message: "Inscripción reembolsada y cupo liberado",
      });
    } catch (error: any) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        error: error.message || "Error al reembolsar inscripción",
      };
      res.status(400).json(errorResponse);
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const id = parseParamId(req.params.id);

      if (!id) {
        const errorResponse: ApiErrorResponse = {
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
    } catch (error: any) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        error: error.message || "Error al eliminar inscripción",
      };
      res.status(400).json(errorResponse);
    }
  }

  static async listTokens(req: Request, res: Response) {
    try {
      const filters: {
        id_expedicion?: number;
        usado?: boolean;
        expirado?: boolean;
        page: number;
        limit: number;
      } = {
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
      };
      if (req.query.id_expedicion) {
        filters.id_expedicion = parseInt(req.query.id_expedicion as string);
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
    } catch (error: any) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        error: error.message || "Error al obtener tokens",
      };
      res.status(500).json(errorResponse);
    }
  }

  static async disableToken(req: Request, res: Response) {
    try {
      const id = parseParamId(req.params.id);

      if (!id) {
        const errorResponse: ApiErrorResponse = {
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
    } catch (error: any) {
      const errorResponse: ApiErrorResponse = {
        success: false,
        error: error.message || "Error al deshabilitar token",
      };
      res.status(400).json(errorResponse);
    }
  }
}

