/** Valores válidos de `servicios.exigencia_fisica`. */
export const EXIGENCIA_FISICA_VALUES = ["Moderada", "Alta", "Muy alta"] as const;
export type ExigenciaFisica = (typeof EXIGENCIA_FISICA_VALUES)[number];

/** Valores válidos de `servicios.dificultad_tecnica`. */
export const DIFICULTAD_TECNICA_VALUES = ["Nula", "Básica", "Intermedia", "Avanzada"] as const;
export type DificultadTecnica = (typeof DIFICULTAD_TECNICA_VALUES)[number];
