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

  const configSettings = [
    { clave: "sistema.moneda_default", valor: "ARS", tipo: "string", grupo: "sistema", etiqueta: "Moneda por defecto", editable: true },
    { clave: "sistema.upload_max_por_mes", valor: "50", tipo: "number", grupo: "sistema", etiqueta: "Uploads máximos por mes", editable: true },
    { clave: "sistema.inscripcion_token_dias", valor: "7", tipo: "number", grupo: "sistema", etiqueta: "Días de validez del token de inscripción", editable: true },
    { clave: "sistema.presupuesto_dias_validez", valor: "15", tipo: "number", grupo: "sistema", etiqueta: "Días de validez del presupuesto", editable: true },
    { clave: "sistema.expedicion_estado_inicial", valor: "Activa", tipo: "string", grupo: "sistema", etiqueta: "Estado inicial de expediciones", editable: true },
    { clave: "sistema.inscripcion_estado_inicial", valor: "Inscripto", tipo: "string", grupo: "inscripcion", etiqueta: "Estado inicial de inscripciones", editable: true },
    { clave: "contacto.whatsapp", valor: "", tipo: "string", grupo: "contacto", etiqueta: "WhatsApp", editable: true },
    { clave: "contacto.email", valor: "", tipo: "string", grupo: "contacto", etiqueta: "Email de contacto", editable: true },
    { clave: "contacto.telefono", valor: "", tipo: "string", grupo: "contacto", etiqueta: "Teléfono", editable: true },
    { clave: "inscripcion.texto_confidencialidad", valor: "Los datos médicos son confidenciales y solo se usarán en caso de emergencia.", tipo: "string", grupo: "inscripcion", etiqueta: "Texto de confidencialidad (Step 3)", editable: true },
    { clave: "branding.nombre_empresa", valor: "Altiplano", tipo: "string", grupo: "branding", etiqueta: "Nombre de la empresa", editable: true },
    { clave: "notificaciones.umbral_cupos_criticos", valor: "2", tipo: "number", grupo: "notificaciones", etiqueta: "Umbral de cupos críticos", editable: true },
    { clave: "notificaciones.dias_presupuesto_aviso", valor: "7", tipo: "number", grupo: "notificaciones", etiqueta: "Días de aviso para presupuesto", editable: true },
    { clave: "notificaciones.dias_salida_proxima", valor: "7", tipo: "number", grupo: "notificaciones", etiqueta: "Días para notificación de salida próxima", editable: true },
    { clave: "notificaciones.dias_salida_urgente", valor: "3", tipo: "number", grupo: "notificaciones", etiqueta: "Días para notificación de salida urgente", editable: true },
    { clave: "notificaciones.dias_retencion", valor: "90", tipo: "number", grupo: "notificaciones", etiqueta: "Días de retención de notificaciones", editable: true },
  ];

  for (const setting of configSettings) {
    await prisma.configuracion_sistema.upsert({
      where: { clave: setting.clave },
      update: { valor: setting.valor },
      create: setting,
    });
  }
  console.log("Configuración del sistema insertada.");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
