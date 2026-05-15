import type { Prisma } from "@prisma/client";
import { prisma } from "../database/prisma.js";
import { AppError } from "../utils/app-error.js";

export interface NotasCalendarioFiltros {
  id_usuario: number;
  fecha_desde?: Date;
  fecha_hasta?: Date;
  tipo?: string;
  completada?: boolean;
}

export interface CreateNotaDTO {
  titulo: string;
  descripcion?: string;
  fecha: Date;
  fecha_fin?: Date;
  tipo: "nota" | "recordatorio" | "tarea";
  color?: string;
  todo_el_dia?: boolean;
}

export interface UpdateNotaDTO extends Partial<CreateNotaDTO> {}

function buildWhereNotas(filtros: NotasCalendarioFiltros): Prisma.notas_calendarioWhereInput {
  const where: Prisma.notas_calendarioWhereInput = {
    id_usuario: filtros.id_usuario,
  };

  if (filtros.tipo) {
    where.tipo = filtros.tipo;
  }

  if (typeof filtros.completada === "boolean") {
    where.completada = filtros.completada;
  }

  if (filtros.fecha_desde || filtros.fecha_hasta) {
    where.fecha = {};

    if (filtros.fecha_desde) {
      where.fecha.gte = filtros.fecha_desde;
    }

    if (filtros.fecha_hasta) {
      where.fecha.lte = filtros.fecha_hasta;
    }
  }

  return where;
}

export async function getNotas(filtros: NotasCalendarioFiltros) {
  return prisma.notas_calendario.findMany({
    where: buildWhereNotas(filtros),
    orderBy: [
      { fecha: "asc" },
      { id_nota: "asc" },
    ],
  });
}

export async function getNotasByMes(anio: number, mes: number, id_usuario: number) {
  const fechaDesde = new Date(Date.UTC(anio, mes - 1, 1, 0, 0, 0, 0));
  const fechaHasta = new Date(Date.UTC(anio, mes, 0, 23, 59, 59, 999));

  return getNotas({
    id_usuario,
    fecha_desde: fechaDesde,
    fecha_hasta: fechaHasta,
  });
}

export async function getNotaById(id: number, id_usuario: number) {
  const nota = await prisma.notas_calendario.findFirst({
    where: {
      id_nota: id,
      id_usuario,
    },
  });

  if (!nota) {
    throw new AppError("Nota no encontrada", 404);
  }

  return nota;
}

export async function createNota(data: CreateNotaDTO, id_usuario: number) {
  return prisma.notas_calendario.create({
    data: {
      id_usuario,
      titulo: data.titulo,
      descripcion: data.descripcion ?? null,
      fecha: data.fecha,
      fecha_fin: data.fecha_fin ?? null,
      tipo: data.tipo,
      color: data.color ?? null,
      todo_el_dia: data.todo_el_dia ?? true,
    },
  });
}

export async function updateNota(id: number, data: UpdateNotaDTO, id_usuario: number) {
  await getNotaById(id, id_usuario);

  const updateData: Prisma.notas_calendarioUpdateInput = {};

  if (data.titulo !== undefined) {
    updateData.titulo = data.titulo;
  }

  if (data.descripcion !== undefined) {
    updateData.descripcion = data.descripcion;
  }

  if (data.fecha !== undefined) {
    updateData.fecha = data.fecha;
  }

  if (data.fecha_fin !== undefined) {
    updateData.fecha_fin = data.fecha_fin;
  }

  if (data.tipo !== undefined) {
    updateData.tipo = data.tipo;
  }

  if (data.color !== undefined) {
    updateData.color = data.color;
  }

  if (data.todo_el_dia !== undefined) {
    updateData.todo_el_dia = data.todo_el_dia;
  }

  return prisma.notas_calendario.update({
    where: {
      id_nota: id,
    },
    data: updateData,
  });
}

export async function toggleCompletada(id: number, id_usuario: number) {
  const nota = await getNotaById(id, id_usuario);

  return prisma.notas_calendario.update({
    where: {
      id_nota: id,
    },
    data: {
      completada: !nota.completada,
    },
  });
}

export async function deleteNota(id: number, id_usuario: number) {
  await getNotaById(id, id_usuario);

  await prisma.notas_calendario.delete({
    where: {
      id_nota: id,
    },
  });

  return {
    success: true,
  };
}
