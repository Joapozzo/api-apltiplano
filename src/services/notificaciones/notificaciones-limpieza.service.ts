import { prisma } from "../../database/prisma.js";

export async function limpiarNotificacionesAntiguas(diasRetencion = 90): Promise<{ eliminadas: number; archivadas: number }> {
  const fechaCorte = new Date();
  fechaCorte.setDate(fechaCorte.getDate() - diasRetencion);

  const [eliminadas, archivadas] = await prisma.$transaction([
    prisma.notificaciones_admin.deleteMany({
      where: {
        created_at: { lt: fechaCorte },
        leida: true,
      },
    }),
    prisma.notificaciones_admin.updateMany({
      where: {
        created_at: { lt: fechaCorte },
        leida: false,
      },
      data: { archivada: true },
    }),
  ]);

  return {
    eliminadas: eliminadas.count,
    archivadas: archivadas.count,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  limpiarNotificacionesAntiguas(90)
    .then((result) => {
      console.log(`Limpieza completada: ${result.eliminadas} eliminadas, ${result.archivadas} archivadas`);
      process.exit(0);
    })
    .catch((err) => {
      console.error("Error en limpieza:", err);
      process.exit(1);
    });
}