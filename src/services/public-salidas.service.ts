import { prisma } from "../database/prisma.js";
import { expedicionEstaActivaPublica } from "../utils/expedicion-estado.js";
import type { ApiPaginatedResponse, ApiSuccessResponse } from "../types/api.types.js";
import type {
  PublicCatalogQuery,
  SalidaCalendarioItem,
  SalidaPublicaPar,
  SalidaPublicaCalendarioResponse,
  SalidasCalendarioQuery,
} from "../types/public-salidas.dto.js";
import type { Prisma } from "@prisma/client";
import { publicExpedicionDetailInclude, publicServicioDetailInclude } from "./public-includes.js";
import { buildServicioPublicWhere } from "../utils/public-filters.js";
import { buildSalidaPar, normalizeExpedicionPublic, normalizeServicioPublic } from "../utils/public-serializers.js";
import { sortSalidaPares } from "../utils/public-sort.js";
import { findServicioActivoPorSlugIdentificador } from "../utils/find-servicio-public.js";

function startOfTodayLocal(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

const listaExpedicionSelect = {
  id_expedicion: true,
  id_servicio: true,
  fecha_salida: true,
  fecha_fin: true,
  cupos_disponibles: true,
  cupos_ocupados: true,
  estado: true,
  expedicion_precios: {
    select: { nombre_paquete: true, precio: true, moneda: true },
  },
  servicios: {
    select: {
      id_servicio: true,
      slug: true,
      nombre: true,
      id_lugar: true,
      id_actividad: true,
      id_dificultad: true,
      exigencia_fisica: true,
      dificultad_tecnica: true,
      url_foto: true,
      urls_fotos: true,
      foto_focal_x: true,
      foto_focal_y: true,
      fotos_focal: true,
      desc_resumen: true,
      descripcion_completa: true,
      destacado: true,
      activo: true,
      duracion_dias: true,
      duracion_noches: true,
      altura_maxima: true,
      cupos_maximos: true,
      servicios_adicionales_disponibles: true,
      dificultades: { select: { id_dificultad: true, nivel: true } },
    },
  },
} satisfies Prisma.expedicionesSelect;

function whereExpedicionesPublicas(query: PublicCatalogQuery): Prisma.expedicionesWhereInput {
  const hoy = startOfTodayLocal();
  const filtroServicio = buildServicioPublicWhere(
    query.q,
    query.dificultad,
    query.exigencia_fisica,
    query.dificultad_tecnica,
  );

  return {
    OR: [{ estado: "A" }, { estado: "Activa" }],
    fecha_salida: { gte: hoy },
    servicios: {
      activo: true,
      ...(query.destacado === true ? { destacado: true } : {}),
      ...filtroServicio,
    },
  };
}

function serializeDetalleUnificado(
  expedicion: Prisma.expedicionesGetPayload<{ include: typeof publicExpedicionDetailInclude }>,
): ApiSuccessResponse<{
  servicio: ReturnType<typeof normalizeServicioPublic>;
  expedicion: ReturnType<typeof normalizeExpedicionPublic>;
}> {
  const { servicios, expedicion_precios, ...rest } = expedicion;
  const expedicionNorm = normalizeExpedicionPublic({
    ...rest,
    expedicion_precios,
  });
  const servicioNorm = normalizeServicioPublic(servicios);

  return {
    success: true,
    data: {
      servicio: servicioNorm,
      expedicion: expedicionNorm,
    },
  };
}

export class PublicSalidasService {
  /** Expediciones futuras con servicio/expedición alineados al front. */
  static async list(query: PublicCatalogQuery): Promise<ApiPaginatedResponse<SalidaPublicaPar>> {
    const where = whereExpedicionesPublicas(query);

    const [total, rows] = await Promise.all([
      prisma.expediciones.count({ where }),
      prisma.expediciones.findMany({
        where,
        select: listaExpedicionSelect,
      }),
    ]);

    const pares: SalidaPublicaPar[] = rows.map((row) => {
      const { servicios, ...expRest } = row;
      const par = buildSalidaPar(servicios, expRest);
      if (!par.expedicion) {
        throw new Error("Inconsistencia: expedición sin datos");
      }
      return {
        servicio: par.servicio as SalidaPublicaPar["servicio"],
        expedicion: par.expedicion as SalidaPublicaPar["expedicion"],
      };
    });

    const sorted = sortSalidaPares(pares, query.orden);
    const page = query.page;
    const limit = query.limit;
    const skip = (page - 1) * limit;
    const data = sorted.slice(skip, skip + limit);

    return {
      success: true,
      data: {
        data,
        total,
        page,
        limit,
        pages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  static async calendarioPorAnio(
    query: SalidasCalendarioQuery,
  ): Promise<ApiSuccessResponse<SalidaPublicaCalendarioResponse>> {
    const year = query.year;
    const startYear = new Date(year, 0, 1);
    const endYear = new Date(year, 11, 31, 23, 59, 59, 999);
    const hoy = startOfTodayLocal();
    const rangeStart = hoy.getTime() > startYear.getTime() ? hoy : startYear;

    const where: Prisma.expedicionesWhereInput = {
      OR: [{ estado: "A" }, { estado: "Activa" }],
      fecha_salida: {
        gte: rangeStart,
        lte: endYear,
      },
      servicios: {
        activo: true,
      },
    };

    const rows = await prisma.expediciones.findMany({
      where,
      select: listaExpedicionSelect,
      orderBy: { fecha_salida: "asc" },
    });

    const salidas: SalidaCalendarioItem[] = rows.map((row) => {
      const { servicios, ...expRest } = row;
      const par = buildSalidaPar(servicios, expRest);
      if (!par.expedicion) {
        throw new Error("Inconsistencia calendario");
      }
      return {
        servicio: par.servicio as SalidaPublicaPar["servicio"],
        expedicion: par.expedicion as SalidaPublicaPar["expedicion"],
        fechaInicio: par.expedicion.fecha_salida,
        fechaFin: par.expedicion.fecha_fin,
      };
    });

    return {
      success: true,
      data: { year, salidas },
    };
  }

  static async getDetalle(identificador: string, idExpedicionOpcional?: number) {
    const esIdNumerico = /^\d+$/.test(identificador);

    if (esIdNumerico) {
      const id = parseInt(identificador, 10);
      return PublicSalidasService.getDetallePorExpedicionId(id);
    }

    return PublicSalidasService.getDetallePorSlugServicio(identificador, idExpedicionOpcional);
  }

  private static async getDetallePorExpedicionId(id_expedicion: number) {
    const expedicion = await prisma.expediciones.findFirst({
      where: {
        id_expedicion,
        servicios: { activo: true },
      },
      include: publicExpedicionDetailInclude,
    });

    if (!expedicion || !expedicionEstaActivaPublica(expedicion.estado)) {
      throw new Error("Salida no encontrada");
    }

    return serializeDetalleUnificado(expedicion);
  }

  private static async getDetallePorSlugServicio(slug: string, idExpedicionOpcional?: number) {
    const servicioRow = await findServicioActivoPorSlugIdentificador(slug);

    if (!servicioRow) {
      throw new Error("Salida no encontrada");
    }

    if (idExpedicionOpcional !== undefined) {
      const expedicion = await prisma.expediciones.findFirst({
        where: {
          id_expedicion: idExpedicionOpcional,
          id_servicio: servicioRow.id_servicio,
          OR: [{ estado: "A" }, { estado: "Activa" }],
        },
        include: publicExpedicionDetailInclude,
      });

      if (!expedicion) {
        throw new Error("Salida no encontrada");
      }

      return serializeDetalleUnificado(expedicion);
    }

    const hoy = startOfTodayLocal();

    const expedicion = await prisma.expediciones.findFirst({
      where: {
        id_servicio: servicioRow.id_servicio,
        OR: [{ estado: "A" }, { estado: "Activa" }],
        fecha_salida: { gte: hoy },
      },
      include: publicExpedicionDetailInclude,
      orderBy: { fecha_salida: "asc" },
    });

    if (expedicion) {
      return serializeDetalleUnificado(expedicion);
    }

    const servicio = await prisma.servicios.findFirst({
      where: { id_servicio: servicioRow.id_servicio, activo: true },
      include: publicServicioDetailInclude,
    });

    if (!servicio) {
      throw new Error("Salida no encontrada");
    }

    const servicioNorm = normalizeServicioPublic(servicio);

    return {
      success: true,
      data: {
        servicio: servicioNorm,
        expedicion: null,
      },
    } satisfies ApiSuccessResponse<{
      servicio: typeof servicioNorm;
      expedicion: null;
    }>;
  }
}
