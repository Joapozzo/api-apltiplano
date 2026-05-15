CREATE TABLE "notas_calendario" (
    "id_nota" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL,
    "fecha_fin" TIMESTAMP(3),
    "tipo" TEXT NOT NULL,
    "color" TEXT,
    "todo_el_dia" BOOLEAN NOT NULL DEFAULT true,
    "completada" BOOLEAN NOT NULL DEFAULT false,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notas_calendario_pkey" PRIMARY KEY ("id_nota")
);

ALTER TABLE "notas_calendario"
ADD CONSTRAINT "notas_calendario_id_usuario_fkey"
FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario")
ON DELETE CASCADE
ON UPDATE CASCADE;
