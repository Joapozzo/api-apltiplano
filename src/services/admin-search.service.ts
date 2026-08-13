import { prisma } from "../database/prisma.js";
import { decryptClientePii } from "../utils/data-protection.js";
import { formatCalendarDateAR } from "../utils/dates.js";

export type AdminSearchResultType = "cliente" | "servicio" | "salida";

export interface AdminSearchHit {
  type: AdminSearchResultType;
  id: number;
  title: string;
  subtitle: string;
}

export interface AdminSearchParams {
  q: string;
  limit?: number;
}

export class AdminSearchService {
  static async search(params: { q: string; limit?: number }): Promise<AdminSearchHit[]> {
    const q = params.q.trim();
    const limit = Math.min(params.limit ?? 5, 10);

    if (q.length < 2) {
      return [];
    }

    const isNumeric = /^\d+$/.test(q);

    const [clientes, servicios, salidas] = await Promise.all([
      this.searchClientes(q, limit),
      this.searchServicios(q, limit),
      this.searchSalidas(q, limit, isNumeric),
    ]);

    return [...clientes, ...servicios, ...salidas];
  }

  private static async searchClientes(q: string, limit: number): Promise<AdminSearchHit[]> {
    const clientes = await prisma.usuarios.findMany({
      where: {
        OR: [
          { nombre: { contains: q, mode: "insensitive" } },
          { apellido: { contains: q, mode: "insensitive" } },
          { email: { contains: q, mode: "insensitive" } },
          { username: { contains: q, mode: "insensitive" } },
        ],
        activo: true,
      },
      select: {
        id_usuario: true,
        nombre: true,
        apellido: true,
        email: true,
      },
      take: limit,
      orderBy: { id_usuario: "desc" },
    });

    return clientes.map((c) => {
      const decrypted = decryptClientePii(c);
      return {
        type: "cliente" as const,
        id: c.id_usuario,
        title: `${decrypted.nombre} ${decrypted.apellido}`.trim(),
        subtitle: decrypted.email as string,
      };
    });
  }

  private static async searchServicios(q: string, limit: number): Promise<AdminSearchHit[]> {
    const servicios = await prisma.servicios.findMany({
      where: {
        OR: [
          { nombre: { contains: q, mode: "insensitive" } },
          { descripcion_completa: { contains: q, mode: "insensitive" } },
        ],
        activo: true,
      },
      select: {
        id_servicio: true,
        nombre: true,
        lugares: {
          select: {
            nombre: true,
          },
        },
      },
      take: limit,
      orderBy: { nombre: "asc" },
    });

    return servicios.map((s) => ({
      type: "servicio" as const,
      id: s.id_servicio,
      title: s.nombre,
      subtitle: s.lugares?.nombre || "",
    }));
  }

  private static async searchSalidas(q: string, limit: number, isNumeric: boolean): Promise<AdminSearchHit[]> {
    const where: any = {
      servicios: {
        activo: true,
      },
    };

    if (isNumeric) {
      where.OR = [{ id_expedicion: parseInt(q, 10) }, { servicios: { nombre: { contains: q, mode: "insensitive" } } }];
    } else {
      where.servicios = {
        ...where.servicios,
        nombre: { contains: q, mode: "insensitive" },
      };
    }

    const salidas = await prisma.expediciones.findMany({
      where,
      select: {
        id_expedicion: true,
        fecha_salida: true,
        estado: true,
        cupos_disponibles: true,
        cupos_ocupados: true,
        servicios: {
          select: {
            nombre: true,
          },
        },
      },
      take: limit,
      orderBy: { fecha_salida: "desc" },
    });

    return salidas.map((s) => {
      const fecha = formatCalendarDateAR(s.fecha_salida, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      const cupos = s.cupos_disponibles - s.cupos_ocupados;
      return {
        type: "salida" as const,
        id: s.id_expedicion,
        title: `${s.servicios.nombre} · ${fecha}`,
        subtitle: `${s.estado} · ${cupos} cupos`,
      };
    });
  }
}
