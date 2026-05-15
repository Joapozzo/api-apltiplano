import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.roles.upsert({
    where: { codigo: "USER" },
    create: { codigo: "USER", nombre: "Usuario" },
    update: { nombre: "Usuario" },
  });
  await prisma.roles.upsert({
    where: { codigo: "ADMIN" },
    create: { codigo: "ADMIN", nombre: "Administrador" },
    update: { nombre: "Administrador" },
  });
  console.log("Roles: USER, ADMIN listos.");

  const dificultadesSeed = [
    { id: 1, nivel: "Moderada" },
    { id: 2, nivel: "Media-alta" },
    { id: 3, nivel: "Exigente" },
  ] as const;
  for (const { id, nivel } of dificultadesSeed) {
    await prisma.dificultades.upsert({
      where: { id_dificultad: id },
      create: { id_dificultad: id, nivel },
      update: { nivel },
    });
  }
  console.log("Dificultades: Moderada, Media-alta, Exigente (ids 1–3).");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
