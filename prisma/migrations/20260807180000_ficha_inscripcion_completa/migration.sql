-- AlterTable inscripciones
ALTER TABLE "inscripciones" ADD COLUMN IF NOT EXISTS "localidad" TEXT;
ALTER TABLE "inscripciones" ADD COLUMN IF NOT EXISTS "nacionalidad" TEXT;
ALTER TABLE "inscripciones" ADD COLUMN IF NOT EXISTS "emergencia_vinculo" TEXT;
ALTER TABLE "inscripciones" ADD COLUMN IF NOT EXISTS "como_nos_conociste" TEXT;
ALTER TABLE "inscripciones" ADD COLUMN IF NOT EXISTS "acepta_riesgo" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "inscripciones" ADD COLUMN IF NOT EXISTS "acepta_riesgo_at" TIMESTAMP(3);

-- AlterTable inscripcion_datos_medicos
ALTER TABLE "inscripcion_datos_medicos" ADD COLUMN IF NOT EXISTS "toma_medicacion" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "inscripcion_datos_medicos" ADD COLUMN IF NOT EXISTS "medicacion_detalle" TEXT;
ALTER TABLE "inscripcion_datos_medicos" ADD COLUMN IF NOT EXISTS "tratamiento_medico" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "inscripcion_datos_medicos" ADD COLUMN IF NOT EXISTS "usa_lentes" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "inscripcion_datos_medicos" ADD COLUMN IF NOT EXISTS "lentes_detalle" TEXT;
ALTER TABLE "inscripcion_datos_medicos" ADD COLUMN IF NOT EXISTS "estado_salud" TEXT;
ALTER TABLE "inscripcion_datos_medicos" ADD COLUMN IF NOT EXISTS "restricciones_alimentarias" TEXT;
ALTER TABLE "inscripcion_datos_medicos" ADD COLUMN IF NOT EXISTS "celiaquia" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "inscripcion_datos_medicos" ADD COLUMN IF NOT EXISTS "epilepsia" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "inscripcion_datos_medicos" ADD COLUMN IF NOT EXISTS "corazon" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "inscripcion_datos_medicos" ADD COLUMN IF NOT EXISTS "convulsiones" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "inscripcion_datos_medicos" ADD COLUMN IF NOT EXISTS "hepatitis" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "inscripcion_datos_medicos" ADD COLUMN IF NOT EXISTS "problemas_respiratorios" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "inscripcion_datos_medicos" ADD COLUMN IF NOT EXISTS "enfermedades_sangre" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "inscripcion_datos_medicos" ADD COLUMN IF NOT EXISTS "problemas_auditivos" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "inscripcion_datos_medicos" ADD COLUMN IF NOT EXISTS "fuma" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "inscripcion_datos_medicos" ADD COLUMN IF NOT EXISTS "vertigo" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "inscripcion_datos_medicos" ADD COLUMN IF NOT EXISTS "ataques_panico" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "inscripcion_datos_medicos" ADD COLUMN IF NOT EXISTS "antecedentes_detalle" TEXT;
ALTER TABLE "inscripcion_datos_medicos" ADD COLUMN IF NOT EXISTS "operaciones" TEXT;
ALTER TABLE "inscripcion_datos_medicos" ADD COLUMN IF NOT EXISTS "lesiones" TEXT;
ALTER TABLE "inscripcion_datos_medicos" ADD COLUMN IF NOT EXISTS "limitante_fisica" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable inscripcion_actividad_fisica
ALTER TABLE "inscripcion_actividad_fisica" ADD COLUMN IF NOT EXISTS "experiencia_trekking_detalle" TEXT;
ALTER TABLE "inscripcion_actividad_fisica" ADD COLUMN IF NOT EXISTS "talle" TEXT;
