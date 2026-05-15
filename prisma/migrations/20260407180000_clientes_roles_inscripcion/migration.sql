-- CreateTable
CREATE TABLE "ubicaciones" (
    "id_ubicacion" SERIAL NOT NULL,
    "pais" TEXT NOT NULL,
    "provincia" TEXT NOT NULL,
    "zona" TEXT NOT NULL,

    CONSTRAINT "ubicaciones_pkey" PRIMARY KEY ("id_ubicacion")
);

-- CreateTable
CREATE TABLE "lugares" (
    "id_lugar" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo_lugar" TEXT NOT NULL,
    "altitud" INTEGER NOT NULL,
    "descripcion" TEXT,
    "id_ubicacion" INTEGER NOT NULL,

    CONSTRAINT "lugares_pkey" PRIMARY KEY ("id_lugar")
);

-- CreateTable
CREATE TABLE "actividades" (
    "id_actividad" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "actividades_pkey" PRIMARY KEY ("id_actividad")
);

-- CreateTable
CREATE TABLE "dificultades" (
    "id_dificultad" SERIAL NOT NULL,
    "nivel" TEXT NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "dificultades_pkey" PRIMARY KEY ("id_dificultad")
);

-- CreateTable
CREATE TABLE "items_servicio" (
    "id_item_servicio" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "categoria" TEXT NOT NULL,
    "es_adicional" BOOLEAN NOT NULL DEFAULT false,
    "activo" BOOLEAN NOT NULL,

    CONSTRAINT "items_servicio_pkey" PRIMARY KEY ("id_item_servicio")
);

-- CreateTable
CREATE TABLE "servicios" (
    "id_servicio" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "id_lugar" INTEGER NOT NULL,
    "id_actividad" INTEGER NOT NULL,
    "id_dificultad" INTEGER NOT NULL,
    "duracion_dias" INTEGER NOT NULL,
    "duracion_noches" INTEGER NOT NULL,
    "altura_maxima" INTEGER NOT NULL,
    "desnivel" INTEGER,
    "descripcion_completa" TEXT,
    "desc_resumen" TEXT,
    "descripcion_recorrido" TEXT,
    "sobre_lugar" TEXT,
    "clima_recomendado" TEXT,
    "temperatura_dia_min" INTEGER,
    "temperatura_dia_max" INTEGER,
    "temperatura_noche_min" INTEGER,
    "temporada_recomendada" TEXT[],
    "experiencia_requerida" TEXT,
    "horas_caminata_diarias" TEXT,
    "peso_mochila" TEXT,
    "conocimientos_tecnicos_requeridos" BOOLEAN NOT NULL DEFAULT false,
    "punto_encuentro" TEXT,
    "comodidades" TEXT,
    "briefing_info" TEXT,
    "consideraciones_especiales" TEXT[],
    "modalidad" TEXT,
    "cupos_maximos" INTEGER,
    "ratio_guia_pasajero" TEXT,
    "alimentacion_detalle" TEXT,
    "servicios_incluidos" TEXT[],
    "servicios_no_incluidos" TEXT[],
    "servicios_adicionales_disponibles" TEXT[],
    "diferenciadores" TEXT[],
    "gestion_cargas" TEXT[],
    "destacado" BOOLEAN NOT NULL DEFAULT false,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "url_foto" TEXT,
    "urls_fotos" TEXT[],
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "servicios_pkey" PRIMARY KEY ("id_servicio")
);

-- CreateTable
CREATE TABLE "servicio_items" (
    "id_servicio_item" SERIAL NOT NULL,
    "id_servicio" INTEGER NOT NULL,
    "id_item_servicio" INTEGER NOT NULL,
    "incluido" BOOLEAN NOT NULL,
    "observacion" TEXT,

    CONSTRAINT "servicio_items_pkey" PRIMARY KEY ("id_servicio_item")
);

-- CreateTable
CREATE TABLE "itinerarios" (
    "id_itinerario" SERIAL NOT NULL,
    "id_servicio" INTEGER NOT NULL,
    "dia" INTEGER NOT NULL,
    "total_dias" INTEGER,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "hora_inicio" TEXT,
    "hora_fin" TEXT,
    "distancia_km" INTEGER,
    "desnivel_metros" INTEGER,
    "duracion_horas" TEXT,
    "alojamiento" TEXT,
    "comidas" TEXT[],
    "actividades_especiales" TEXT[],
    "altitud" INTEGER,
    "peso_mochila" TEXT,
    "intensidad" TEXT,

    CONSTRAINT "itinerarios_pkey" PRIMARY KEY ("id_itinerario")
);

-- CreateTable
CREATE TABLE "expediciones" (
    "id_expedicion" SERIAL NOT NULL,
    "id_servicio" INTEGER NOT NULL,
    "fecha_salida" TIMESTAMP(3) NOT NULL,
    "fecha_fin" TIMESTAMP(3) NOT NULL,
    "cupos_disponibles" INTEGER NOT NULL,
    "cupos_ocupados" INTEGER NOT NULL DEFAULT 0,
    "estado" TEXT NOT NULL,
    "presupuesto_valido_hasta" TIMESTAMP(3),
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "expediciones_pkey" PRIMARY KEY ("id_expedicion")
);

-- CreateTable
CREATE TABLE "expedicion_precios" (
    "id_expedicion_precio" SERIAL NOT NULL,
    "id_expedicion" INTEGER NOT NULL,
    "nombre_paquete" TEXT NOT NULL,
    "precio" DECIMAL(65,30) NOT NULL,
    "moneda" TEXT NOT NULL,

    CONSTRAINT "expedicion_precios_pkey" PRIMARY KEY ("id_expedicion_precio")
);

-- CreateTable
CREATE TABLE "roles" (
    "id_rol" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id_rol")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id_usuario" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "username" TEXT,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "fecha_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "usuario_roles" (
    "id" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_rol" INTEGER NOT NULL,

    CONSTRAINT "usuario_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clientes" (
    "id_cliente" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id_cliente")
);

-- CreateTable
CREATE TABLE "inscripciones" (
    "id_inscripcion" SERIAL NOT NULL,
    "id_cliente" INTEGER NOT NULL,
    "id_expedicion" INTEGER NOT NULL,
    "fecha_inscripcion" TIMESTAMP(3) NOT NULL,
    "estado" TEXT NOT NULL,
    "reserva_pagada" BOOLEAN NOT NULL,
    "saldo_pagado" BOOLEAN NOT NULL,
    "dni" TEXT,
    "fecha_nacimiento" TIMESTAMP(3),
    "telefono" TEXT,
    "provincia" TEXT,
    "emergencia_nombre" TEXT,
    "emergencia_telefono" TEXT,

    CONSTRAINT "inscripciones_pkey" PRIMARY KEY ("id_inscripcion")
);

-- CreateTable
CREATE TABLE "inscripcion_datos_medicos" (
    "id_dato_medico" SERIAL NOT NULL,
    "id_inscripcion" INTEGER NOT NULL,
    "cobertura_medica" TEXT,
    "grupo_sanguineo" TEXT,
    "alergias" BOOLEAN NOT NULL DEFAULT false,
    "alergias_detalle" TEXT,
    "diabetes" BOOLEAN NOT NULL DEFAULT false,
    "asma" BOOLEAN NOT NULL DEFAULT false,
    "hipertension" BOOLEAN NOT NULL DEFAULT false,
    "otros_antecedentes" TEXT,

    CONSTRAINT "inscripcion_datos_medicos_pkey" PRIMARY KEY ("id_dato_medico")
);

-- CreateTable
CREATE TABLE "inscripcion_actividad_fisica" (
    "id_actividad_fisica" SERIAL NOT NULL,
    "id_inscripcion" INTEGER NOT NULL,
    "realiza_entrenamiento" BOOLEAN NOT NULL DEFAULT false,
    "tipo_entrenamiento" TEXT,
    "frecuencia_semanal" INTEGER,
    "experiencia_trekking" BOOLEAN NOT NULL DEFAULT false,
    "altura_cm" INTEGER,
    "peso_kg" INTEGER,

    CONSTRAINT "inscripcion_actividad_fisica_pkey" PRIMARY KEY ("id_actividad_fisica")
);

-- CreateTable
CREATE TABLE "pagos" (
    "id_pago" SERIAL NOT NULL,
    "id_inscripcion" INTEGER NOT NULL,
    "monto" DECIMAL(65,30) NOT NULL,
    "moneda" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "metodo_pago" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "fecha_pago" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pagos_pkey" PRIMARY KEY ("id_pago")
);

-- CreateTable
CREATE TABLE "coordinadores" (
    "id_coordinador" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "dni" TEXT NOT NULL,
    "certificaciones" TEXT[],
    "especialidades" TEXT[],
    "activo" BOOLEAN NOT NULL,

    CONSTRAINT "coordinadores_pkey" PRIMARY KEY ("id_coordinador")
);

-- CreateTable
CREATE TABLE "expedicion_coordinadores" (
    "id" SERIAL NOT NULL,
    "id_expedicion" INTEGER NOT NULL,
    "id_coordinador" INTEGER NOT NULL,
    "rol" TEXT NOT NULL,

    CONSTRAINT "expedicion_coordinadores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inscripcion_tokens" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "id_expedicion" INTEGER NOT NULL,
    "id_cliente" INTEGER NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "usado" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_inscripcion" INTEGER,

    CONSTRAINT "inscripcion_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "items_servicio_nombre_key" ON "items_servicio"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "roles_codigo_key" ON "roles"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_username_key" ON "usuarios"("username");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_roles_id_usuario_id_rol_key" ON "usuario_roles"("id_usuario", "id_rol");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_id_usuario_key" ON "clientes"("id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_email_key" ON "clientes"("email");

-- CreateIndex
CREATE UNIQUE INDEX "inscripcion_datos_medicos_id_inscripcion_key" ON "inscripcion_datos_medicos"("id_inscripcion");

-- CreateIndex
CREATE UNIQUE INDEX "inscripcion_actividad_fisica_id_inscripcion_key" ON "inscripcion_actividad_fisica"("id_inscripcion");

-- CreateIndex
CREATE UNIQUE INDEX "coordinadores_dni_key" ON "coordinadores"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "inscripcion_tokens_token_key" ON "inscripcion_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "inscripcion_tokens_id_inscripcion_key" ON "inscripcion_tokens"("id_inscripcion");

-- AddForeignKey
ALTER TABLE "lugares" ADD CONSTRAINT "lugares_id_ubicacion_fkey" FOREIGN KEY ("id_ubicacion") REFERENCES "ubicaciones"("id_ubicacion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servicios" ADD CONSTRAINT "servicios_id_lugar_fkey" FOREIGN KEY ("id_lugar") REFERENCES "lugares"("id_lugar") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servicios" ADD CONSTRAINT "servicios_id_actividad_fkey" FOREIGN KEY ("id_actividad") REFERENCES "actividades"("id_actividad") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servicios" ADD CONSTRAINT "servicios_id_dificultad_fkey" FOREIGN KEY ("id_dificultad") REFERENCES "dificultades"("id_dificultad") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servicio_items" ADD CONSTRAINT "servicio_items_id_servicio_fkey" FOREIGN KEY ("id_servicio") REFERENCES "servicios"("id_servicio") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servicio_items" ADD CONSTRAINT "servicio_items_id_item_servicio_fkey" FOREIGN KEY ("id_item_servicio") REFERENCES "items_servicio"("id_item_servicio") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itinerarios" ADD CONSTRAINT "itinerarios_id_servicio_fkey" FOREIGN KEY ("id_servicio") REFERENCES "servicios"("id_servicio") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expediciones" ADD CONSTRAINT "expediciones_id_servicio_fkey" FOREIGN KEY ("id_servicio") REFERENCES "servicios"("id_servicio") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expedicion_precios" ADD CONSTRAINT "expedicion_precios_id_expedicion_fkey" FOREIGN KEY ("id_expedicion") REFERENCES "expediciones"("id_expedicion") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_roles" ADD CONSTRAINT "usuario_roles_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_roles" ADD CONSTRAINT "usuario_roles_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "roles"("id_rol") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clientes" ADD CONSTRAINT "clientes_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscripciones" ADD CONSTRAINT "inscripciones_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "clientes"("id_cliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscripciones" ADD CONSTRAINT "inscripciones_id_expedicion_fkey" FOREIGN KEY ("id_expedicion") REFERENCES "expediciones"("id_expedicion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscripcion_datos_medicos" ADD CONSTRAINT "inscripcion_datos_medicos_id_inscripcion_fkey" FOREIGN KEY ("id_inscripcion") REFERENCES "inscripciones"("id_inscripcion") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscripcion_actividad_fisica" ADD CONSTRAINT "inscripcion_actividad_fisica_id_inscripcion_fkey" FOREIGN KEY ("id_inscripcion") REFERENCES "inscripciones"("id_inscripcion") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_id_inscripcion_fkey" FOREIGN KEY ("id_inscripcion") REFERENCES "inscripciones"("id_inscripcion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expedicion_coordinadores" ADD CONSTRAINT "expedicion_coordinadores_id_expedicion_fkey" FOREIGN KEY ("id_expedicion") REFERENCES "expediciones"("id_expedicion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expedicion_coordinadores" ADD CONSTRAINT "expedicion_coordinadores_id_coordinador_fkey" FOREIGN KEY ("id_coordinador") REFERENCES "coordinadores"("id_coordinador") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscripcion_tokens" ADD CONSTRAINT "inscripcion_tokens_id_expedicion_fkey" FOREIGN KEY ("id_expedicion") REFERENCES "expediciones"("id_expedicion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscripcion_tokens" ADD CONSTRAINT "inscripcion_tokens_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "clientes"("id_cliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscripcion_tokens" ADD CONSTRAINT "inscripcion_tokens_id_inscripcion_fkey" FOREIGN KEY ("id_inscripcion") REFERENCES "inscripciones"("id_inscripcion") ON DELETE SET NULL ON UPDATE CASCADE;

