import { prisma } from "../../database/prisma.js";
import { AppError } from "../../utils/app-error.js";
import {
  calcularRangosEquidistantes,
  resolverNivel,
  sumarPuntos,
} from "./nivel-scoring.service.js";
import type { EvaluarNivelBody, PreviewNivelBody } from "../../types/nivel.dto.js";
import { CUESTIONARIO_NIVEL_CODIGO } from "./nivel.constants.js";

export class NivelServiceError extends Error {
  status: number;
  code: string;

  constructor(message: string, status: number, code: string) {
    super(message);
    this.name = "NivelServiceError";
    this.status = status;
    this.code = code;
  }
}

async function getCuestionarioActivo() {
  const cuestionario = await prisma.cuestionarios_nivel.findFirst({
    where: { codigo: CUESTIONARIO_NIVEL_CODIGO, activo: true },
    include: {
      preguntas: {
        where: { activa: true },
        orderBy: { orden: "asc" },
        include: {
          opciones: {
            where: { activa: true },
            orderBy: { orden: "asc" },
          },
        },
      },
    },
  });
  if (!cuestionario) {
    throw new NivelServiceError("Cuestionario no disponible", 404, "CUESTIONARIO_NOT_FOUND");
  }
  return cuestionario;
}

/** Public schema without points. */
export async function getCuestionarioPublico() {
  const c = await getCuestionarioActivo();
  return {
    success: true as const,
    data: {
      id_cuestionario: c.id_cuestionario,
      codigo: c.codigo,
      version: c.version,
      titulo: c.titulo,
      descripcion: c.descripcion,
      preguntas: c.preguntas.map((p) => ({
        id_pregunta: p.id_pregunta,
        codigo: p.codigo,
        enunciado: p.enunciado,
        orden: p.orden,
        grupo: p.grupo,
        obligatoria: p.obligatoria,
        opciones: p.opciones.map((o) => ({
          id_opcion: o.id_opcion,
          codigo: o.codigo,
          texto: o.texto,
          orden: o.orden,
        })),
      })),
    },
  };
}

/** Admin: full schema including points. */
export async function getCuestionarioAdmin() {
  const c = await prisma.cuestionarios_nivel.findFirst({
    where: { codigo: CUESTIONARIO_NIVEL_CODIGO },
    include: {
      preguntas: {
        orderBy: { orden: "asc" },
        include: {
          opciones: { orderBy: { orden: "asc" } },
        },
      },
    },
  });
  if (!c) {
    throw new NivelServiceError("Cuestionario no encontrado", 404, "CUESTIONARIO_NOT_FOUND");
  }
  return { success: true as const, data: c };
}

type RespuestaIn = { codigo_pregunta: string; codigo_opcion: string };

async function resolverRespuestas(respuestas: RespuestaIn[]) {
  const cuestionario = await getCuestionarioActivo();
  const obligatorias = cuestionario.preguntas.filter((p) => p.obligatoria);
  const porCodigo = new Map(cuestionario.preguntas.map((p) => [p.codigo, p]));

  const codigosVistos = new Set<string>();
  const seleccionadas: Array<{
    id_pregunta: number;
    codigo_pregunta: string;
    id_opcion: number;
    codigo_opcion: string;
    puntos: number;
    texto_opcion: string;
  }> = [];

  for (const r of respuestas) {
    if (codigosVistos.has(r.codigo_pregunta)) {
      throw new NivelServiceError(
        `Respuesta duplicada para ${r.codigo_pregunta}`,
        400,
        "DUPLICATE_ANSWER",
      );
    }
    codigosVistos.add(r.codigo_pregunta);

    const pregunta = porCodigo.get(r.codigo_pregunta);
    if (!pregunta) {
      throw new NivelServiceError(`Pregunta inválida: ${r.codigo_pregunta}`, 400, "INVALID_QUESTION");
    }
    const opcion = pregunta.opciones.find((o) => o.codigo === r.codigo_opcion);
    if (!opcion) {
      throw new NivelServiceError(
        `Opción inválida para ${r.codigo_pregunta}`,
        400,
        "INVALID_OPTION",
      );
    }
    seleccionadas.push({
      id_pregunta: pregunta.id_pregunta,
      codigo_pregunta: pregunta.codigo,
      id_opcion: opcion.id_opcion,
      codigo_opcion: opcion.codigo,
      puntos: opcion.puntos,
      texto_opcion: opcion.texto,
    });
  }

  for (const p of obligatorias) {
    if (!codigosVistos.has(p.codigo)) {
      throw new NivelServiceError(`Falta responder: ${p.codigo}`, 400, "MISSING_ANSWER");
    }
  }

  const puntaje_total = sumarPuntos(seleccionadas);
  const dificultades = await prisma.dificultades.findMany({
    where: { activo: true },
    orderBy: [{ orden: "asc" }, { id_dificultad: "asc" }],
  });
  const nivel = resolverNivel(puntaje_total, dificultades);
  if (!nivel) {
    throw new NivelServiceError("No hay niveles de dificultad configurados", 500, "NO_DIFICULTADES");
  }

  return { cuestionario, seleccionadas, puntaje_total, nivel };
}

export async function evaluarNivel(body: EvaluarNivelBody) {
  const { cuestionario, seleccionadas, puntaje_total, nivel } = await resolverRespuestas(
    body.respuestas,
  );

  const evaluacion = await prisma.evaluaciones_nivel.create({
    data: {
      id_cuestionario: cuestionario.id_cuestionario,
      version: cuestionario.version,
      nombre: body.nombre.trim(),
      email: body.email.trim().toLowerCase(),
      puntaje_total,
      id_dificultad: nivel.id_dificultad,
      respuestas: seleccionadas.map((s) => ({
        codigo_pregunta: s.codigo_pregunta,
        codigo_opcion: s.codigo_opcion,
        puntos: s.puntos,
      })),
    },
  });

  return {
    success: true as const,
    data: {
      evaluacion_id: evaluacion.id_evaluacion,
      puntaje_total,
      nivel: {
        id_dificultad: nivel.id_dificultad,
        nivel: nivel.nivel,
        descripcion: nivel.descripcion,
      },
    },
  };
}

export async function previewNivel(body: PreviewNivelBody) {
  const { puntaje_total, nivel } = await resolverRespuestas(body.respuestas);
  return {
    success: true as const,
    data: {
      puntaje_total,
      nivel: {
        id_dificultad: nivel.id_dificultad,
        nivel: nivel.nivel,
        descripcion: nivel.descripcion,
      },
    },
  };
}

export async function scoreMaxActivo(): Promise<number> {
  const c = await getCuestionarioActivo();
  return c.preguntas.reduce((acc, p) => {
    const maxOpt = p.opciones.reduce((m, o) => Math.max(m, o.puntos), 0);
    return acc + maxOpt;
  }, 0);
}

export async function recalcularRangosDificultades() {
  const max = await scoreMaxActivo();
  const dificultades = await prisma.dificultades.findMany({
    where: { activo: true },
    orderBy: [{ orden: "asc" }, { id_dificultad: "asc" }],
  });
  const rangos = calcularRangosEquidistantes(
    max,
    dificultades.map((d) => ({ id_dificultad: d.id_dificultad })),
  );
  for (const r of rangos) {
    await prisma.dificultades.update({
      where: { id_dificultad: r.id_dificultad },
      data: { puntaje_min: r.puntaje_min, puntaje_max: r.puntaje_max },
    });
  }
  return getCuestionarioAdmin().then(async () => {
    const updated = await prisma.dificultades.findMany({
      orderBy: [{ orden: "asc" }, { id_dificultad: "asc" }],
    });
    return { success: true as const, data: updated };
  });
}

// ---- Admin CRUD preguntas / opciones ----

export async function updatePregunta(
  id: number,
  data: {
    enunciado?: string;
    orden?: number;
    grupo?: string | null;
    obligatoria?: boolean;
    activa?: boolean;
  },
) {
  const existing = await prisma.preguntas_nivel.findUnique({ where: { id_pregunta: id } });
  if (!existing) throw new NivelServiceError("Pregunta no encontrada", 404, "NOT_FOUND");
  const updated = await prisma.preguntas_nivel.update({
    where: { id_pregunta: id },
    data: {
      ...(data.enunciado !== undefined ? { enunciado: data.enunciado } : {}),
      ...(data.orden !== undefined ? { orden: data.orden } : {}),
      ...(data.grupo !== undefined ? { grupo: data.grupo } : {}),
      ...(data.obligatoria !== undefined ? { obligatoria: data.obligatoria } : {}),
      ...(data.activa !== undefined ? { activa: data.activa } : {}),
    },
    include: { opciones: { orderBy: { orden: "asc" } } },
  });
  return { success: true as const, data: updated };
}

export async function createPregunta(data: {
  codigo: string;
  enunciado: string;
  orden?: number;
  grupo?: string | null;
  obligatoria?: boolean;
  activa?: boolean;
}) {
  const c = await getCuestionarioActivo();
  try {
    const created = await prisma.preguntas_nivel.create({
      data: {
        id_cuestionario: c.id_cuestionario,
        codigo: data.codigo,
        enunciado: data.enunciado,
        orden: data.orden ?? 0,
        grupo: data.grupo ?? null,
        obligatoria: data.obligatoria ?? true,
        activa: data.activa ?? true,
      },
      include: { opciones: true },
    });
    return { success: true as const, data: created };
  } catch {
    throw new NivelServiceError("No se pudo crear la pregunta (código duplicado?)", 409, "DUPLICATE");
  }
}

export async function updateOpcion(
  id: number,
  data: { texto?: string; puntos?: number; orden?: number; activa?: boolean },
) {
  const existing = await prisma.opciones_nivel.findUnique({ where: { id_opcion: id } });
  if (!existing) throw new NivelServiceError("Opción no encontrada", 404, "NOT_FOUND");
  const updated = await prisma.opciones_nivel.update({
    where: { id_opcion: id },
    data: {
      ...(data.texto !== undefined ? { texto: data.texto } : {}),
      ...(data.puntos !== undefined ? { puntos: data.puntos } : {}),
      ...(data.orden !== undefined ? { orden: data.orden } : {}),
      ...(data.activa !== undefined ? { activa: data.activa } : {}),
    },
  });
  return { success: true as const, data: updated };
}

export async function createOpcion(
  idPregunta: number,
  data: { codigo: string; texto: string; puntos?: number; orden?: number; activa?: boolean },
) {
  const pregunta = await prisma.preguntas_nivel.findUnique({ where: { id_pregunta: idPregunta } });
  if (!pregunta) throw new NivelServiceError("Pregunta no encontrada", 404, "NOT_FOUND");
  try {
    const created = await prisma.opciones_nivel.create({
      data: {
        id_pregunta: idPregunta,
        codigo: data.codigo,
        texto: data.texto,
        puntos: data.puntos ?? 0,
        orden: data.orden ?? 0,
        activa: data.activa ?? true,
      },
    });
    return { success: true as const, data: created };
  } catch {
    throw new NivelServiceError("No se pudo crear la opción (código duplicado?)", 409, "DUPLICATE");
  }
}

export async function listEvaluaciones(opts: { page: number; limit: number; email?: string }) {
  const where = opts.email
    ? { email: { contains: opts.email.toLowerCase(), mode: "insensitive" as const } }
    : {};
  const skip = (opts.page - 1) * opts.limit;
  const [total, rows] = await Promise.all([
    prisma.evaluaciones_nivel.count({ where }),
    prisma.evaluaciones_nivel.findMany({
      where,
      orderBy: { created_at: "desc" },
      skip,
      take: opts.limit,
      include: {
        dificultad: { select: { id_dificultad: true, nivel: true } },
      },
    }),
  ]);
  return {
    success: true as const,
    data: {
      items: rows.map((r) => ({
        id_evaluacion: r.id_evaluacion,
        nombre: r.nombre,
        email: r.email,
        puntaje_total: r.puntaje_total,
        nivel: r.dificultad.nivel,
        id_dificultad: r.id_dificultad,
        version: r.version,
        created_at: r.created_at,
      })),
      page: opts.page,
      limit: opts.limit,
      total,
      totalPages: Math.ceil(total / opts.limit) || 1,
    },
  };
}

/** Re-export AppError mapping helper for controllers */
export function toHttpError(error: unknown): { status: number; message: string; code?: string } {
  if (error instanceof NivelServiceError) {
    return { status: error.status, message: error.message, code: error.code };
  }
  if (error instanceof AppError) {
    return { status: error.statusCode, message: error.message };
  }
  throw error;
}
