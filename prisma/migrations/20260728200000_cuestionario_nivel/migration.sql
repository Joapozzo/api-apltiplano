-- AlterTable
ALTER TABLE "dificultades" ADD COLUMN IF NOT EXISTS "puntaje_min" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "dificultades" ADD COLUMN IF NOT EXISTS "puntaje_max" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE IF NOT EXISTS "cuestionarios_nivel" (
    "id_cuestionario" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cuestionarios_nivel_pkey" PRIMARY KEY ("id_cuestionario")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "preguntas_nivel" (
    "id_pregunta" SERIAL NOT NULL,
    "id_cuestionario" INTEGER NOT NULL,
    "codigo" TEXT NOT NULL,
    "enunciado" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "grupo" TEXT,
    "obligatoria" BOOLEAN NOT NULL DEFAULT true,
    "activa" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "preguntas_nivel_pkey" PRIMARY KEY ("id_pregunta")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "opciones_nivel" (
    "id_opcion" SERIAL NOT NULL,
    "id_pregunta" INTEGER NOT NULL,
    "codigo" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "puntos" INTEGER NOT NULL DEFAULT 0,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "activa" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "opciones_nivel_pkey" PRIMARY KEY ("id_opcion")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "evaluaciones_nivel" (
    "id_evaluacion" SERIAL NOT NULL,
    "id_cuestionario" INTEGER NOT NULL,
    "version" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "puntaje_total" INTEGER NOT NULL,
    "id_dificultad" INTEGER NOT NULL,
    "respuestas" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "evaluaciones_nivel_pkey" PRIMARY KEY ("id_evaluacion")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "cuestionarios_nivel_codigo_key" ON "cuestionarios_nivel"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "preguntas_nivel_id_cuestionario_codigo_key" ON "preguntas_nivel"("id_cuestionario", "codigo");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "preguntas_nivel_id_cuestionario_orden_idx" ON "preguntas_nivel"("id_cuestionario", "orden");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "opciones_nivel_id_pregunta_codigo_key" ON "opciones_nivel"("id_pregunta", "codigo");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "opciones_nivel_id_pregunta_orden_idx" ON "opciones_nivel"("id_pregunta", "orden");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "evaluaciones_nivel_email_idx" ON "evaluaciones_nivel"("email");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "evaluaciones_nivel_created_at_idx" ON "evaluaciones_nivel"("created_at");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "evaluaciones_nivel_id_dificultad_idx" ON "evaluaciones_nivel"("id_dificultad");

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "preguntas_nivel" ADD CONSTRAINT "preguntas_nivel_id_cuestionario_fkey"
    FOREIGN KEY ("id_cuestionario") REFERENCES "cuestionarios_nivel"("id_cuestionario") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "opciones_nivel" ADD CONSTRAINT "opciones_nivel_id_pregunta_fkey"
    FOREIGN KEY ("id_pregunta") REFERENCES "preguntas_nivel"("id_pregunta") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "evaluaciones_nivel" ADD CONSTRAINT "evaluaciones_nivel_id_cuestionario_fkey"
    FOREIGN KEY ("id_cuestionario") REFERENCES "cuestionarios_nivel"("id_cuestionario") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "evaluaciones_nivel" ADD CONSTRAINT "evaluaciones_nivel_id_dificultad_fkey"
    FOREIGN KEY ("id_dificultad") REFERENCES "dificultades"("id_dificultad") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
