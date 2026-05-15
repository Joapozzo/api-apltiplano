-- ============================================
-- ALTER TABLES PARA AGREGAR CAMPOS NUEVOS
-- ============================================
-- Ejecutar estos ALTER TABLE en pgAdmin
-- ============================================

-- 1. ALTER TABLE servicios - Agregar campos nuevos
ALTER TABLE servicios
ADD COLUMN IF NOT EXISTS desnivel INT,
ADD COLUMN IF NOT EXISTS desc_resumen TEXT,
ADD COLUMN IF NOT EXISTS descripcion_recorrido TEXT,
ADD COLUMN IF NOT EXISTS sobre_lugar TEXT,
ADD COLUMN IF NOT EXISTS clima_recomendado TEXT,
ADD COLUMN IF NOT EXISTS temperatura_dia_min INT,
ADD COLUMN IF NOT EXISTS temperatura_dia_max INT,
ADD COLUMN IF NOT EXISTS temperatura_noche_min INT,
ADD COLUMN IF NOT EXISTS temporada_recomendada TEXT[],
ADD COLUMN IF NOT EXISTS experiencia_requerida TEXT,
ADD COLUMN IF NOT EXISTS horas_caminata_diarias VARCHAR(50),
ADD COLUMN IF NOT EXISTS peso_mochila VARCHAR(50),
ADD COLUMN IF NOT EXISTS conocimientos_tecnicos_requeridos BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS punto_encuentro VARCHAR(255),
ADD COLUMN IF NOT EXISTS comodidades TEXT,
ADD COLUMN IF NOT EXISTS briefing_info TEXT,
ADD COLUMN IF NOT EXISTS consideraciones_especiales TEXT[],
ADD COLUMN IF NOT EXISTS modalidad VARCHAR(50),
ADD COLUMN IF NOT EXISTS cupos_maximos INT,
ADD COLUMN IF NOT EXISTS ratio_guia_pasajero VARCHAR(20),
ADD COLUMN IF NOT EXISTS alimentacion_detalle TEXT,
ADD COLUMN IF NOT EXISTS servicios_incluidos TEXT[],
ADD COLUMN IF NOT EXISTS servicios_no_incluidos TEXT[],
ADD COLUMN IF NOT EXISTS servicios_adicionales_disponibles TEXT[],
ADD COLUMN IF NOT EXISTS diferenciadores TEXT[],
ADD COLUMN IF NOT EXISTS gestion_cargas TEXT[],
ADD COLUMN IF NOT EXISTS destacado BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS fecha_creacion TIMESTAMP DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS fecha_actualizacion TIMESTAMP DEFAULT NOW();

-- Actualizar fecha_actualizacion para que se actualice automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear trigger para actualizar fecha_actualizacion automáticamente
DROP TRIGGER IF EXISTS update_servicios_updated_at ON servicios;
CREATE TRIGGER update_servicios_updated_at
    BEFORE UPDATE ON servicios
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 2. ALTER TABLE itinerarios - Agregar campos nuevos
ALTER TABLE itinerarios
ALTER COLUMN total_dias DROP NOT NULL,
ADD COLUMN IF NOT EXISTS hora_inicio VARCHAR(10),
ADD COLUMN IF NOT EXISTS hora_fin VARCHAR(10),
ADD COLUMN IF NOT EXISTS duracion_horas VARCHAR(50),
ADD COLUMN IF NOT EXISTS comidas TEXT[],
ADD COLUMN IF NOT EXISTS actividades_especiales TEXT[],
ADD COLUMN IF NOT EXISTS altitud INT,
ADD COLUMN IF NOT EXISTS peso_mochila VARCHAR(50),
ADD COLUMN IF NOT EXISTS intensidad VARCHAR(50);

-- 3. ALTER TABLE expediciones - Agregar campos nuevos
ALTER TABLE expediciones
ALTER COLUMN cupos_ocupados SET DEFAULT 0,
ADD COLUMN IF NOT EXISTS presupuesto_valido_hasta TIMESTAMP,
ADD COLUMN IF NOT EXISTS fecha_creacion TIMESTAMP DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS fecha_actualizacion TIMESTAMP DEFAULT NOW();

-- Crear trigger para actualizar fecha_actualizacion automáticamente en expediciones
DROP TRIGGER IF EXISTS update_expediciones_updated_at ON expediciones;
CREATE TRIGGER update_expediciones_updated_at
    BEFORE UPDATE ON expediciones
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 4. CREAR TABLA expedicion_precios
CREATE TABLE IF NOT EXISTS expedicion_precios (
    id_expedicion_precio SERIAL PRIMARY KEY,
    id_expedicion INT NOT NULL,
    nombre_paquete VARCHAR(100) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    moneda VARCHAR(10) NOT NULL,
    CONSTRAINT fk_expedicion_precios_expedicion
        FOREIGN KEY (id_expedicion)
        REFERENCES expediciones(id_expedicion)
        ON DELETE CASCADE
);

-- Crear índice para mejorar búsquedas
CREATE INDEX IF NOT EXISTS idx_expedicion_precios_expedicion 
ON expedicion_precios(id_expedicion);

-- ============================================
-- FIN DE LOS ALTER TABLES
-- ============================================

