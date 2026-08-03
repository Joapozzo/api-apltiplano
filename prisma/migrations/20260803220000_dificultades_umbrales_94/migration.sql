-- Remap legacy "Exigente" (id=3) → "Avanzado" (id=2), then set 3-level score bands.
-- Bands (configurable later in admin): Inicial 0–40, Intermedio 41–70, Avanzado 71–94.

UPDATE "servicios"
SET "id_dificultad" = 2
WHERE "id_dificultad" = 3;

UPDATE "evaluaciones_nivel"
SET "id_dificultad" = 2
WHERE "id_dificultad" = 3;

-- Rename + ranges (nivel is UNIQUE — update carefully)
UPDATE "dificultades"
SET
  "nivel" = 'Inicial',
  "descripcion" = 'Ideal para quienes se inician en la montaña o tienen poca experiencia en altura.',
  "orden" = 0,
  "puntaje_min" = 0,
  "puntaje_max" = 40,
  "activo" = true
WHERE "id_dificultad" = 4;

UPDATE "dificultades"
SET
  "nivel" = 'Intermedio',
  "descripcion" = 'Requiere buena condición física y experiencia previa en trekking / altura.',
  "orden" = 1,
  "puntaje_min" = 41,
  "puntaje_max" = 70,
  "activo" = true
WHERE "id_dificultad" = 1;

UPDATE "dificultades"
SET
  "nivel" = 'Avanzado',
  "descripcion" = 'Para montañistas con trayectoria sólida en altura y carga.',
  "orden" = 2,
  "puntaje_min" = 71,
  "puntaje_max" = 94,
  "activo" = true
WHERE "id_dificultad" = 2;

-- Keep row for referential stability; hide from scoring / filters that use activo
UPDATE "dificultades"
SET
  "nivel" = 'Exigente (legacy)',
  "descripcion" = 'Nivel legacy unificado en Avanzado. No usar.',
  "orden" = 99,
  "puntaje_min" = 0,
  "puntaje_max" = 0,
  "activo" = false
WHERE "id_dificultad" = 3;
