import { PrismaClient } from "@prisma/client";
import {
  CUESTIONARIO_NIVEL_META,
  PREGUNTAS_NIVEL_SEED,
} from "./seed-nivel-cuestionario.js";

const prisma = new PrismaClient();

async function seedCuestionarioNivel() {
  const cuestionario = await prisma.cuestionarios_nivel.upsert({
    where: { codigo: CUESTIONARIO_NIVEL_META.codigo },
    create: {
      codigo: CUESTIONARIO_NIVEL_META.codigo,
      version: CUESTIONARIO_NIVEL_META.version,
      activo: CUESTIONARIO_NIVEL_META.activo,
      titulo: CUESTIONARIO_NIVEL_META.titulo,
      descripcion: CUESTIONARIO_NIVEL_META.descripcion,
    },
    update: {
      version: CUESTIONARIO_NIVEL_META.version,
      activo: CUESTIONARIO_NIVEL_META.activo,
      titulo: CUESTIONARIO_NIVEL_META.titulo,
      descripcion: CUESTIONARIO_NIVEL_META.descripcion,
    },
  });

  for (const pregunta of PREGUNTAS_NIVEL_SEED) {
    const existing = await prisma.preguntas_nivel.findUnique({
      where: {
        id_cuestionario_codigo: {
          id_cuestionario: cuestionario.id_cuestionario,
          codigo: pregunta.codigo,
        },
      },
    });

    const preguntaRow = existing
      ? await prisma.preguntas_nivel.update({
          where: { id_pregunta: existing.id_pregunta },
          data: {
            enunciado: pregunta.enunciado,
            orden: pregunta.orden,
            grupo: pregunta.grupo,
            obligatoria: true,
            activa: true,
          },
        })
      : await prisma.preguntas_nivel.create({
          data: {
            id_cuestionario: cuestionario.id_cuestionario,
            codigo: pregunta.codigo,
            enunciado: pregunta.enunciado,
            orden: pregunta.orden,
            grupo: pregunta.grupo,
            obligatoria: true,
            activa: true,
          },
        });

    for (const opcion of pregunta.opciones) {
      const existingOpt = await prisma.opciones_nivel.findUnique({
        where: {
          id_pregunta_codigo: {
            id_pregunta: preguntaRow.id_pregunta,
            codigo: opcion.codigo,
          },
        },
      });

      if (existingOpt) {
        await prisma.opciones_nivel.update({
          where: { id_opcion: existingOpt.id_opcion },
          data: {
            texto: opcion.texto,
            puntos: opcion.puntos,
            orden: opcion.orden,
            activa: true,
          },
        });
      } else {
        await prisma.opciones_nivel.create({
          data: {
            id_pregunta: preguntaRow.id_pregunta,
            codigo: opcion.codigo,
            texto: opcion.texto,
            puntos: opcion.puntos,
            orden: opcion.orden,
            activa: true,
          },
        });
      }
    }
  }

  console.log(
    `Cuestionario nivel: ${CUESTIONARIO_NIVEL_META.codigo} v${CUESTIONARIO_NIVEL_META.version} (${PREGUNTAS_NIVEL_SEED.length} preguntas).`,
  );
}

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
    {
      id: 4,
      nivel: "Inicial",
      orden: 0,
      puntaje_min: 0,
      puntaje_max: 40,
      descripcion: "Ideal para quienes se inician en la montaña o tienen poca experiencia en altura.",
      activo: true,
    },
    {
      id: 1,
      nivel: "Intermedio",
      orden: 1,
      puntaje_min: 41,
      puntaje_max: 70,
      descripcion: "Requiere buena condición física y experiencia previa en trekking / altura.",
      activo: true,
    },
    {
      id: 2,
      nivel: "Avanzado",
      orden: 2,
      puntaje_min: 71,
      puntaje_max: 94,
      descripcion: "Para montañistas con trayectoria sólida en altura y carga.",
      activo: true,
    },
    {
      id: 3,
      nivel: "Exigente (legacy)",
      orden: 99,
      puntaje_min: 0,
      puntaje_max: 0,
      descripcion: "Nivel legacy unificado en Avanzado. No usar.",
      activo: false,
    },
  ] as const;

  for (const d of dificultadesSeed) {
    await prisma.dificultades.upsert({
      where: { id_dificultad: d.id },
      create: {
        id_dificultad: d.id,
        nivel: d.nivel,
        orden: d.orden,
        puntaje_min: d.puntaje_min,
        puntaje_max: d.puntaje_max,
        descripcion: d.descripcion,
        activo: d.activo,
      },
      update: {
        nivel: d.nivel,
        orden: d.orden,
        puntaje_min: d.puntaje_min,
        puntaje_max: d.puntaje_max,
        descripcion: d.descripcion,
        activo: d.activo,
      },
    });
  }
  console.log("Dificultades: Inicial (0–40), Intermedio (41–70), Avanzado (71–94); Exigente legacy inactivo.");

  await seedCuestionarioNivel();

  const configSettings = [
    { clave: "sistema.moneda_default", valor: "ARS", tipo: "string", grupo: "sistema", etiqueta: "Moneda por defecto", editable: true },
    { clave: "sistema.upload_max_por_mes", valor: "50", tipo: "number", grupo: "sistema", etiqueta: "Uploads máximos por mes", editable: true },
    { clave: "sistema.inscripcion_token_dias", valor: "7", tipo: "number", grupo: "sistema", etiqueta: "Días de validez del token de inscripción", editable: true },
    { clave: "sistema.presupuesto_dias_validez", valor: "15", tipo: "number", grupo: "sistema", etiqueta: "Días de validez del presupuesto", editable: true },
    { clave: "sistema.expedicion_estado_inicial", valor: "Activa", tipo: "string", grupo: "sistema", etiqueta: "Estado inicial de expediciones", editable: true },
    { clave: "sistema.inscripcion_estado_inicial", valor: "Inscripto", tipo: "string", grupo: "inscripcion", etiqueta: "Estado inicial de inscripciones", editable: true },
    { clave: "contacto.whatsapp", valor: "+54 9 3837 49-8552", tipo: "string", grupo: "contacto", etiqueta: "WhatsApp", editable: true },
    { clave: "contacto.email", valor: "info@altiplano.com", tipo: "string", grupo: "contacto", etiqueta: "Email de contacto", editable: true },
    { clave: "contacto.telefono", valor: "+54 9 3837 49-8552", tipo: "string", grupo: "contacto", etiqueta: "Teléfono", editable: true },
    { clave: "inscripcion.texto_confidencialidad", valor: "Los datos médicos son confidenciales y solo se usarán en caso de emergencia.", tipo: "string", grupo: "inscripcion", etiqueta: "Texto de confidencialidad (Step 3)", editable: true },
    { clave: "branding.nombre_empresa", valor: "Altiplano", tipo: "string", grupo: "branding", etiqueta: "Nombre de la empresa", editable: true },
    { clave: "notificaciones.umbral_cupos_criticos", valor: "2", tipo: "number", grupo: "notificaciones", etiqueta: "Umbral de cupos críticos", editable: true },
    { clave: "notificaciones.dias_presupuesto_aviso", valor: "7", tipo: "number", grupo: "notificaciones", etiqueta: "Días de aviso para presupuesto", editable: true },
    { clave: "notificaciones.dias_salida_proxima", valor: "7", tipo: "number", grupo: "notificaciones", etiqueta: "Días para notificación de salida próxima", editable: true },
    { clave: "notificaciones.dias_salida_urgente", valor: "3", tipo: "number", grupo: "notificaciones", etiqueta: "Días para notificación de salida urgente", editable: true },
    { clave: "notificaciones.dias_retencion", valor: "90", tipo: "number", grupo: "notificaciones", etiqueta: "Días de retención de notificaciones", editable: true },
    {
      clave: "contenido.tips",
      valor: JSON.stringify({
        enabled: true,
        tips: [
          {
            id: 1,
            icon: "Calendar",
            categoria: "Planificación",
            titulo: "Días Extra = Tranquilidad",
            contenido:
              "Disponé de 2 días extras. El clima en montaña es cambiante y más tiempo te permitirá modificar el plan.",
            color: "from-blue-500 to-blue-600",
            activo: true,
            orden: 1,
          },
          {
            id: 2,
            icon: "MapPin",
            categoria: "Investigación",
            titulo: "Conocé tu Destino",
            contenido:
              "Investigá el lugar para combinar el viaje con otras experiencias y conocer costumbres locales.",
            color: "from-green-500 to-green-600",
            activo: true,
            orden: 2,
          },
          {
            id: 3,
            icon: "Thermometer",
            categoria: "Equipamiento",
            titulo: "Preparate para el Clima",
            contenido:
              "Invierno: cadenas, mantas térmicas. Verano: agua extra, sombrero y protector solar.",
            color: "from-orange-500 to-red-500",
            activo: true,
            orden: 3,
          },
          {
            id: 4,
            icon: "Droplets",
            categoria: "Hidratación",
            titulo: "Hidratación Constante",
            contenido:
              "En altura, tomá agua cada 15-20 min. Evitá alcohol 48hs antes de la expedición.",
            color: "from-cyan-500 to-blue-500",
            activo: true,
            orden: 4,
          },
          {
            id: 5,
            icon: "Heart",
            categoria: "Preparación",
            titulo: "Entrenamiento Previo",
            contenido:
              "Comenzá 6 semanas antes. Enfocate en cardio y piernas. Caminatas con mochila son ideales.",
            color: "from-pink-500 to-rose-500",
            activo: true,
            orden: 5,
          },
          {
            id: 6,
            icon: "FileText",
            categoria: "Documentación",
            titulo: "Permisos y Seguros",
            contenido:
              "Verificá DNI vigente, contratá un seguro de viaje y consultá permisos especiales.",
            color: "from-purple-500 to-indigo-500",
            activo: true,
            orden: 6,
          },
        ],
      }),
      tipo: "json",
      grupo: "contenido",
      etiqueta: "Tips de experiencia (widget flotante)",
      editable: true,
    },
  ];

  for (const setting of configSettings) {
    await prisma.configuracion_sistema.upsert({
      where: { clave: setting.clave },
      update: {
        tipo: setting.tipo,
        grupo: setting.grupo,
        etiqueta: setting.etiqueta,
        editable: setting.editable,
      },
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
