/**
 * Seed data for mountain-level questionnaire (16 questions from Altiplano form).
 * Points are defaults editable in admin; codes are stable.
 */

export type OpcionSeed = { codigo: string; texto: string; puntos: number; orden: number };
export type PreguntaSeed = {
  codigo: string;
  enunciado: string;
  orden: number;
  grupo: string;
  opciones: OpcionSeed[];
};

export const CUESTIONARIO_NIVEL_CODIGO = "nivel_montana";

export const CUESTIONARIO_NIVEL_META = {
  codigo: CUESTIONARIO_NIVEL_CODIGO,
  version: 1,
  activo: true,
  titulo: "Cuestionario de Nivel de Montaña",
  descripcion:
    "Este cuestionario nos ayuda a comprender tu experiencia previa, tu relación con la montaña y el tipo de expedición más adecuada para vos hoy.",
};

/** Max score per question when picking strongest option = 5 → 16×5 = 80.
 * Umbrales de dificultad (Inicial/Intermedio/Avanzado) son configurables en admin;
 * seed inicial: 0–40 / 41–70 / 71–94 (tope nominal 94). */
export const PREGUNTAS_NIVEL_SEED: PreguntaSeed[] = [
  {
    codigo: "q01_actividad_fisica",
    enunciado: "¿Realizás actividad física regularmente?",
    orden: 1,
    grupo: "fisico",
    opciones: [
      { codigo: "entreno_4_plus", texto: "Entreno 4 o más veces por semana", puntos: 5, orden: 1 },
      { codigo: "entreno_2_3", texto: "Entreno 2 o 3 veces por semana", puntos: 4, orden: 2 },
      { codigo: "entreno_ocasional", texto: "Entreno ocasionalmente", puntos: 2, orden: 3 },
      { codigo: "no_entreno", texto: "Actualmente no entreno", puntos: 0, orden: 4 },
    ],
  },
  {
    codigo: "q02_tipo_actividad",
    enunciado: "¿Qué tipo de actividad representa mejor tu rutina?",
    orden: 2,
    grupo: "fisico",
    opciones: [
      { codigo: "trail_montana", texto: "Trail running / montañismo / escalada", puntos: 5, orden: 1 },
      { codigo: "running_fuerza", texto: "Running / ciclismo / entrenamiento fuerza y altas cargas", puntos: 4, orden: 2 },
      { codigo: "gimnasio", texto: "Gimnasio intenso / deportes ocasionales", puntos: 3, orden: 3 },
      { codigo: "leve", texto: "Actividad física leve o esporádica", puntos: 1, orden: 4 },
      { codigo: "ninguna", texto: "Ninguna", puntos: 0, orden: 5 },
    ],
  },
  {
    codigo: "q03_esfuerzos_largos",
    enunciado: "¿Cómo te sentís en esfuerzos físicos prolongados (+6hs)?",
    orden: 3,
    grupo: "fisico",
    opciones: [
      { codigo: "comodo", texto: "Cómodo/a y con buena recuperación", puntos: 5, orden: 1 },
      { codigo: "adapto", texto: "Me exige pero me adapto bien", puntos: 4, orden: 2 },
      { codigo: "cuesta", texto: "Me cuesta sostener el esfuerzo", puntos: 2, orden: 3 },
      { codigo: "poca_exp", texto: "Tengo poca experiencia en esfuerzos largos", puntos: 0, orden: 4 },
    ],
  },
  {
    codigo: "q04_experiencias_montana",
    enunciado: "¿Qué experiencias de montaña realizaste?",
    orden: 4,
    grupo: "altura",
    opciones: [
      { codigo: "asc_6000", texto: "Ascensos a cerros de 6000 m o más", puntos: 5, orden: 1 },
      { codigo: "asc_5000", texto: "Ascensos a cerros de 5000 m o más", puntos: 4, orden: 2 },
      { codigo: "asc_4000", texto: "Ascensos a cerros de 4000 m o más", puntos: 3, orden: 3 },
      { codigo: "ninguna", texto: "Ninguna", puntos: 0, orden: 4 },
    ],
  },
  {
    codigo: "q05_mayor_altura_dormida",
    enunciado: "¿Cuál es la mayor altura en la que dormiste?",
    orden: 5,
    grupo: "altura",
    opciones: [
      { codigo: "mas_5000", texto: "Más de 5000 m", puntos: 5, orden: 1 },
      { codigo: "4000_4999", texto: "Entre 4000 y 4999 m", puntos: 4, orden: 2 },
      { codigo: "3000_3999", texto: "Entre 3000 y 3999 m", puntos: 2, orden: 3 },
      { codigo: "nunca", texto: "Nunca dormí en montaña", puntos: 0, orden: 4 },
    ],
  },
  {
    codigo: "q06_noches_4000",
    enunciado: "¿Cuántas noches dormiste en montaña a 4000 msnm o más?",
    orden: 6,
    grupo: "altura",
    opciones: [
      { codigo: "mas_11", texto: "Más de 11 noches", puntos: 5, orden: 1 },
      { codigo: "6_10", texto: "Entre 6 y 10 noches", puntos: 4, orden: 2 },
      { codigo: "1_5", texto: "Entre 1 y 5 noches", puntos: 2, orden: 3 },
      { codigo: "ninguna", texto: "Ninguna", puntos: 0, orden: 4 },
    ],
  },
  {
    codigo: "q07_experiencia_altura",
    enunciado: "¿Tuviste experiencias en altura (4000 msnm o más)?",
    orden: 7,
    grupo: "altura",
    opciones: [
      { codigo: "varias_bien", texto: "Sí, en varias oportunidades. Aclimaté bien", puntos: 5, orden: 1 },
      { codigo: "algunas_bien", texto: "Sí, algunas veces y me adapté bien", puntos: 4, orden: 2 },
      { codigo: "algunas_costo", texto: "Sí, algunas veces y me costó aclimatar", puntos: 2, orden: 3 },
      { codigo: "muy_poca", texto: "Muy poca experiencia por encima de los 4000 m", puntos: 1, orden: 4 },
      { codigo: "nunca", texto: "Nunca estuve por encima de los 4000 m", puntos: 0, orden: 5 },
    ],
  },
  {
    codigo: "q08_ultima_experiencia_4000",
    enunciado: "¿Cuándo fue tu última experiencia a 4000 m o más?",
    orden: 8,
    grupo: "altura",
    opciones: [
      { codigo: "6_meses", texto: "En los últimos 6 meses", puntos: 5, orden: 1 },
      { codigo: "1_anio", texto: "En el último año", puntos: 4, orden: 2 },
      { codigo: "1_3_anios", texto: "Entre 1 y 3 años", puntos: 3, orden: 3 },
      { codigo: "3_5_anios", texto: "Entre 3 y 5 años", puntos: 2, orden: 4 },
      { codigo: "mas_5", texto: "Hace más de 5 años", puntos: 1, orden: 5 },
      { codigo: "nunca", texto: "Nunca tuve una experiencia significativa", puntos: 0, orden: 6 },
    ],
  },
  {
    codigo: "q09_jornadas_6hs_4000",
    enunciado: "¿Caminaste jornadas de más de 6 horas en montaña por encima de los 4000 msnm?",
    orden: 9,
    grupo: "altura",
    opciones: [
      { codigo: "muchas", texto: "Muchas veces", puntos: 5, orden: 1 },
      { codigo: "algunas", texto: "Algunas veces", puntos: 4, orden: 2 },
      { codigo: "muy_pocas", texto: "Muy pocas", puntos: 2, orden: 3 },
      { codigo: "nunca", texto: "Nunca", puntos: 0, orden: 4 },
    ],
  },
  {
    codigo: "q10_autonomia_equipo",
    enunciado: "¿Qué nivel de autonomía tenés para seleccionar, preparar y organizar tu equipo personal de montaña?",
    orden: 10,
    grupo: "autonomia",
    opciones: [
      { codigo: "total", texto: "Totalmente autónomo/a", puntos: 5, orden: 1 },
      { codigo: "mayormente", texto: "Mayormente autónomo/a, aunque ocasionalmente consulto", puntos: 4, orden: 2 },
      { codigo: "orientacion", texto: "Necesito orientación frecuente", puntos: 2, orden: 3 },
      { codigo: "dependo", texto: "Dependo completamente de otras personas", puntos: 0, orden: 4 },
    ],
  },
  {
    codigo: "q11_incomodidad",
    enunciado: "¿Cómo manejás la incomodidad en montaña?",
    orden: 11,
    grupo: "autonomia",
    opciones: [
      { codigo: "muy_bien", texto: "Me adapto muy bien", puntos: 5, orden: 1 },
      { codigo: "razonable", texto: "Lo tolero razonablemente", puntos: 4, orden: 2 },
      { codigo: "cuesta", texto: "Me cuesta bastante", puntos: 2, orden: 3 },
      { codigo: "sin_exp", texto: "No tengo experiencia suficiente para saberlo", puntos: 0, orden: 4 },
    ],
  },
  {
    codigo: "q12_experiencia_general",
    enunciado: "¿Cómo describirías tu experiencia general en montaña?",
    orden: 12,
    grupo: "autonomia",
    opciones: [
      { codigo: "autonomo", texto: "Me siento autónomo/a y con criterio", puntos: 5, orden: 1 },
      { codigo: "aprendiendo", texto: "Tengo experiencia pero sigo aprendiendo", puntos: 4, orden: 2 },
      { codigo: "comenzando", texto: "Estoy comenzando", puntos: 2, orden: 3 },
      { codigo: "nuevo", texto: "Sería algo completamente nuevo", puntos: 0, orden: 4 },
    ],
  },
  {
    codigo: "q13_incertidumbre",
    enunciado: "Frente a situaciones inciertas en montaña:",
    orden: 13,
    grupo: "autonomia",
    opciones: [
      { codigo: "calma", texto: "Mantengo la calma y me adapto", puntos: 5, orden: 1 },
      { codigo: "manejo", texto: "Me incomoda pero puedo manejarlo", puntos: 4, orden: 2 },
      { codigo: "afecta", texto: "Me afecta bastante", puntos: 2, orden: 3 },
      { codigo: "sin_exp", texto: "No tengo experiencia suficiente para saberlo", puntos: 0, orden: 4 },
    ],
  },
  {
    codigo: "q14_preparacion",
    enunciado: "¿Qué importancia tiene para vos la preparación previa de una expedición?",
    orden: 14,
    grupo: "autonomia",
    opciones: [
      { codigo: "fundamental", texto: "Fundamental", puntos: 5, orden: 1 },
      { codigo: "muy_importante", texto: "Muy importante", puntos: 4, orden: 2 },
      { codigo: "algo", texto: "Algo importante", puntos: 2, orden: 3 },
      { codigo: "nunca", texto: "Nunca lo pensé demasiado", puntos: 0, orden: 4 },
    ],
  },
  {
    codigo: "q15_peso_mochila",
    enunciado: "¿Qué peso de mochila transportaste habitualmente en tus experiencias de montaña?",
    orden: 15,
    grupo: "carga",
    opciones: [
      { codigo: "mas_15", texto: "Más de 15 kg durante varios días", puntos: 5, orden: 1 },
      { codigo: "10_15", texto: "Entre 10 y 15 kg", puntos: 4, orden: 2 },
      { codigo: "menos_10", texto: "Menos de 10 kg", puntos: 2, orden: 3 },
      { codigo: "nunca", texto: "Nunca cargué mi propio equipo", puntos: 0, orden: 4 },
    ],
  },
  {
    codigo: "q16_experiencias_multidia",
    enunciado: "¿Cuántas experiencias de montaña de dos o más días realizaste?",
    orden: 16,
    grupo: "carga",
    opciones: [
      { codigo: "mas_10", texto: "Más de 10 experiencias", puntos: 5, orden: 1 },
      { codigo: "5_10", texto: "Entre 5 y 10 experiencias", puntos: 4, orden: 2 },
      { codigo: "1_4", texto: "Entre 1 y 4 experiencias", puntos: 2, orden: 3 },
      { codigo: "ninguna", texto: "Ninguna", puntos: 0, orden: 4 },
    ],
  },
];
