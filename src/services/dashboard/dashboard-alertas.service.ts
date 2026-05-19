import { prisma } from "../../database/prisma.js";
import { syncAlertasOperativas } from "../notificaciones/notificaciones-sync.service.js";

export interface DashboardAlertas {
  expediciones_cupos_criticos: Array<{
    id_expedicion: number;
    nombre_servicio: string;
    fecha_salida: Date;
    cupos_disponibles: number;
  }>;
  tokens_vencidos_sin_usar: Array<{
    id: number;
    expires_at: Date;
    cliente: {
      nombre: string;
      apellido: string;
    };
    expedicion: {
      nombre_servicio: string;
      fecha_salida: Date;
    };
  }>;
  inscripciones_sin_datos_medicos: Array<{
    id_inscripcion: number;
    cliente: {
      nombre: string;
      apellido: string;
    };
    expedicion: {
      nombre_servicio: string;
    };
  }>;
  presupuestos_por_vencer: Array<{
    id_expedicion: number;
    nombre_servicio: string;
    presupuesto_valido_hasta: Date;
  }>;
}

export async function getDashboardAlertas(): Promise<DashboardAlertas> {
  await syncAlertasOperativas(true);

  const notificaciones = await prisma.notificaciones_admin.findMany({
    where: {
      archivada: false,
      leida: false,
    },
    orderBy: { created_at: "desc" },
  });

  const cuposCriticos = notificaciones.filter(
    (n) => n.tipo === "SALIDA_CUPOS_CRITICOS"
  );
  const sinDatosMedicos = notificaciones.filter(
    (n) => n.tipo === "INSCRIPCION_SIN_DATOS_MEDICOS"
  );
  const presupuestos = notificaciones.filter(
    (n) => n.tipo === "SALIDA_PRESUPUESTO_POR_VENCER" || n.tipo === "SALIDA_PRESUPUESTO_VENCIDO"
  );

  const expedicionesCuposCriticos = cuposCriticos.map((n) => {
    const meta = n.metadata as { id_expedicion?: number };
    return {
      id_expedicion: meta?.id_expedicion || 0,
      nombre_servicio: n.mensaje,
      fecha_salida: n.created_at,
      cupos_disponibles: 0,
    };
  });

  const inscripcionesSinDatosMedicos = sinDatosMedicos.map((n) => {
    const meta = n.metadata as { id_inscripcion?: number };
    return {
      id_inscripcion: meta?.id_inscripcion || 0,
      cliente: {
        nombre: n.mensaje.split(" — ")[0] || "",
        apellido: "",
      },
      expedicion: {
        nombre_servicio: "",
      },
    };
  });

  const presupuestosPorVencer = presupuestos.map((n) => {
    const meta = n.metadata as { id_expedicion?: number };
    return {
      id_expedicion: meta?.id_expedicion || 0,
      nombre_servicio: n.mensaje.split(" — ")[0] || "",
      presupuesto_valido_hasta: n.created_at,
    };
  });

  const hoy = new Date();
  const tokensVencidosSinUsar = await prisma.inscripcion_tokens.findMany({
    where: {
      expires_at: { lt: hoy },
      usado: false,
    },
    select: {
      id: true,
      expires_at: true,
      clientes: {
        select: { nombre: true, apellido: true },
      },
      expediciones: {
        select: {
          servicios: { select: { nombre: true } },
          fecha_salida: true,
        },
      },
    },
  });

  return {
    expediciones_cupos_criticos: expedicionesCuposCriticos,
    tokens_vencidos_sin_usar: tokensVencidosSinUsar.map((t) => ({
      id: t.id,
      expires_at: t.expires_at,
      cliente: t.clientes,
      expedicion: {
        nombre_servicio: t.expediciones?.servicios?.nombre || "",
        fecha_salida: t.expediciones?.fecha_salida || new Date(),
      },
    })),
    inscripciones_sin_datos_medicos: inscripcionesSinDatosMedicos,
    presupuestos_por_vencer: presupuestosPorVencer,
  };
}