/**
 * Repara registros donde nombre/apellido quedaron cifrados en clientes/usuarios.
 * Los campos PII de inscripciones (dni, teléfono, etc.) se mantienen cifrados en DB;
 * la API los desencripta al leer.
 *
 * Uso: pnpm exec tsx scripts/backfill-decrypt-client-names.ts
 */
import "dotenv/config";
import { prisma } from "../src/database/prisma.js";
import {
  isEncryptedValue,
  isEncryptionEnabled,
  maybeDecrypt,
} from "../src/utils/data-protection.js";

async function main() {
  if (!isEncryptionEnabled()) {
    console.error("ENCRYPTION_KEY no configurada (64 hex). Abortando.");
    process.exit(1);
  }

  let clientesFixed = 0;
  let usuariosFixed = 0;

  const clientes = await prisma.clientes.findMany({
    select: {
      id_cliente: true,
      id_usuario: true,
      nombre: true,
      apellido: true,
      email: true,
    },
  });

  for (const cliente of clientes) {
    const nombre = maybeDecrypt(cliente.nombre) ?? cliente.nombre;
    const apellido = maybeDecrypt(cliente.apellido) ?? cliente.apellido;

    const nombreChanged = nombre !== cliente.nombre;
    const apellidoChanged = apellido !== cliente.apellido;

    if (nombreChanged || apellidoChanged) {
      await prisma.clientes.update({
        where: { id_cliente: cliente.id_cliente },
        data: { nombre, apellido },
      });
      clientesFixed++;
      console.log(
        `[cliente #${cliente.id_cliente}] ${cliente.email}: "${cliente.nombre}" → "${nombre}"`
      );
    }

    const usuario = await prisma.usuarios.findUnique({
      where: { id_usuario: cliente.id_usuario },
      select: { id_usuario: true, nombre: true, apellido: true, email: true },
    });

    if (!usuario) continue;

    const uNombre = maybeDecrypt(usuario.nombre) ?? usuario.nombre;
    const uApellido = maybeDecrypt(usuario.apellido) ?? usuario.apellido;

    if (uNombre !== usuario.nombre || uApellido !== usuario.apellido) {
      await prisma.usuarios.update({
        where: { id_usuario: usuario.id_usuario },
        data: { nombre: uNombre, apellido: uApellido },
      });
      usuariosFixed++;
      console.log(
        `[usuario #${usuario.id_usuario}] ${usuario.email}: nombre/apellido restaurados`
      );
    }
  }

  const inscripciones = await prisma.inscripciones.findMany({
    select: {
      id_inscripcion: true,
      dni: true,
      telefono: true,
      provincia: true,
      emergencia_nombre: true,
      emergencia_telefono: true,
    },
  });

  let inscripcionesEncrypted = 0;
  for (const ins of inscripciones) {
    const encryptedFields = (
      ["dni", "telefono", "provincia", "emergencia_nombre", "emergencia_telefono"] as const
    ).filter((field) => {
      const value = ins[field];
      return typeof value === "string" && isEncryptedValue(value);
    });

    if (encryptedFields.length > 0) {
      inscripcionesEncrypted++;
      console.log(
        `[inscripción #${ins.id_inscripcion}] campos cifrados en DB (OK, se desencriptan al leer): ${encryptedFields.join(", ")}`
      );
    }
  }

  console.log("\n--- Resumen ---");
  console.log(`Clientes reparados: ${clientesFixed}`);
  console.log(`Usuarios reparados: ${usuariosFixed}`);
  console.log(
    `Inscripciones con PII cifrado en DB: ${inscripcionesEncrypted} (sin cambios, desencriptación en API)`
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
