import type { Prisma } from "@prisma/client";

/**
 * Elimina una inscripción y sus dependencias que bloquean el borrado en BD.
 */
export async function removeInscripcionRecord(
  tx: Prisma.TransactionClient,
  id_inscripcion: number,
): Promise<void> {
  await tx.pagos.deleteMany({ where: { id_inscripcion } });
  await tx.inscripcion_tokens.updateMany({
    where: { id_inscripcion },
    data: { id_inscripcion: null },
  });
  await tx.inscripciones.delete({ where: { id_inscripcion } });
}
