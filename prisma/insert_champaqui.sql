-- ============================================
-- SCRIPT DE INSERCIÓN: Cerro Champaquí
-- ============================================
-- Este script inserta todos los datos del servicio Champaquí
-- incluyendo ubicación, lugar, actividad, dificultad, servicio, itinerario y expedición
-- ============================================
-- IMPORTANTE: Este script usa CTEs (Common Table Expressions) para manejar IDs dinámicamente
-- ============================================

DO $$
DECLARE
    v_id_ubicacion INT;
    v_id_lugar INT;
    v_id_actividad INT;
    v_id_dificultad INT;
    v_id_servicio INT;
    v_id_expedicion INT;
BEGIN
    -- 1. INSERTAR O OBTENER UBICACIÓN
    SELECT id_ubicacion INTO v_id_ubicacion
    FROM ubicaciones
    WHERE pais = 'Argentina' AND provincia = 'Córdoba' AND zona = 'Sierras Grandes'
    LIMIT 1;
    
    IF v_id_ubicacion IS NULL THEN
        INSERT INTO ubicaciones (pais, provincia, zona)
        VALUES ('Argentina', 'Córdoba', 'Sierras Grandes')
        RETURNING id_ubicacion INTO v_id_ubicacion;
    END IF;

    -- 2. INSERTAR O OBTENER LUGAR
    SELECT id_lugar INTO v_id_lugar
    FROM lugares
    WHERE nombre = 'Cerro Champaquí'
    LIMIT 1;
    
    IF v_id_lugar IS NULL THEN
        INSERT INTO lugares (nombre, tipo_lugar, altitud, descripcion, id_ubicacion)
        VALUES (
            'Cerro Champaquí',
            'Montaña',
            2790,
            'Ubicado en el corazón de las Sierras Grandes, el Cerro Champaquí es la cumbre más alta de la provincia de Córdoba y un destino clásico para los amantes del trekking. A lo largo de la travesía, pasaremos por puestos serranos, disfrutaremos de la hospitalidad de los lugareños y seremos testigos de un paisaje cambiante que combina bosque serrano, pastizales de altura y formaciones rocosas imponentes.',
            v_id_ubicacion
        )
        RETURNING id_lugar INTO v_id_lugar;
    END IF;

    -- 3. INSERTAR O OBTENER ACTIVIDAD
    SELECT id_actividad INTO v_id_actividad
    FROM actividades
    WHERE nombre = 'Trekking'
    LIMIT 1;
    
    IF v_id_actividad IS NULL THEN
        INSERT INTO actividades (nombre, descripcion)
        VALUES (
            'Trekking',
            'Caminata de montaña y senderismo'
        )
        RETURNING id_actividad INTO v_id_actividad;
    END IF;

    -- 4. INSERTAR O OBTENER DIFICULTAD
    SELECT id_dificultad INTO v_id_dificultad
    FROM dificultades
    WHERE nivel = 'Moderada'
    LIMIT 1;
    
    IF v_id_dificultad IS NULL THEN
        INSERT INTO dificultades (nivel, descripcion)
        VALUES (
            'Moderada',
            'Dificultad moderada con exigencia física alta'
        )
        RETURNING id_dificultad INTO v_id_dificultad;
    END IF;

    -- 5. VERIFICAR SI EL SERVICIO YA EXISTE
    SELECT id_servicio INTO v_id_servicio
    FROM servicios
    WHERE nombre = 'Cerro Champaquí'
    LIMIT 1;
    
    -- Si el servicio no existe, crearlo
    IF v_id_servicio IS NULL THEN
        INSERT INTO servicios (
            nombre,
            id_lugar,
            id_actividad,
            id_dificultad,
            duracion_dias,
            duracion_noches,
            altura_maxima,
            descripcion_completa,
            desc_resumen,
            descripcion_recorrido,
            sobre_lugar,
            clima_recomendado,
            temperatura_dia_min,
            temperatura_dia_max,
            temperatura_noche_min,
            temporada_recomendada,
            experiencia_requerida,
            horas_caminata_diarias,
            conocimientos_tecnicos_requeridos,
            punto_encuentro,
            comodidades,
            briefing_info,
            consideraciones_especiales,
            modalidad,
            cupos_maximos,
            servicios_incluidos,
            servicios_no_incluidos,
            diferenciadores,
            destacado,
            activo,
            url_foto,
            urls_fotos,
            fecha_creacion,
            fecha_actualizacion
        )
        VALUES (
            'Cerro Champaquí',
            v_id_lugar,
            v_id_actividad,
            v_id_dificultad,
            3, -- duracion_dias
            2, -- duracion_noches
            2790, -- altura_maxima
            'La expedición al Cerro Champaquí es una experiencia inolvidable en las Sierras Grandes de Córdoba, ideal para quienes buscan un desafío físico y una inmersión en la naturaleza. Durante tres días, recorreremos senderos de montaña, cruzaremos arroyos y nos adentraremos en un entorno de gran belleza, hasta alcanzar la cumbre del techo de Córdoba, a 2.790 metros sobre el nivel del mar.',
            'Tres días de pura montaña en las Sierras Grandes: alcanzá los 2.790 m del imponente Champaquí.',
            'Iniciaremos nuestro ascenso por la ruta Este, desde la localidad de Villa Alpina. A lo largo del recorrido, nos encontraremos con cruces de arroyos, puestos baqueanos, animales silvestres y de crianza, cuevas y miradores naturales. Durante la expedición, disfrutaremos de la hospitalidad de los lugareños y de su cocina casera, que nos acompañará en las tres jornadas de travesía.',
            'Ubicado en el corazón de las Sierras Grandes, el Cerro Champaquí es la cumbre más alta de la provincia de Córdoba y un destino clásico para los amantes del trekking. A lo largo de la travesía, pasaremos por puestos serranos, disfrutaremos de la hospitalidad de los lugareños y seremos testigos de un paisaje cambiante que combina bosque serrano, pastizales de altura y formaciones rocosas imponentes.',
            'Las mejores temporadas para realizar esta expedición son otoño, invierno y primavera, cuando las temperaturas son más estables y el clima es más propicio para el trekking. Durante el día, las temperaturas pueden oscilar entre 5°C y 20°C, mientras que por la noche pueden descender hasta los 0°C. Es fundamental contar con indumentaria adecuada para enfrentar las bajas temperaturas nocturnas.',
            5, -- temperatura_dia_min
            20, -- temperatura_dia_max
            0, -- temperatura_noche_min
            ARRAY['otoño', 'invierno', 'primavera'], -- temporada_recomendada
            'Este trekking tiene una dificultad moderada con exigencia física alta. Se recomienda para personas con experiencia en caminatas de jornada larga y buen estado físico. No se requieren conocimientos técnicos, pero es necesario estar preparado para jornadas de entre 7 y 9 horas de caminata diarias con desniveles pronunciados.',
            '7-9 horas', -- horas_caminata_diarias
            false, -- conocimientos_tecnicos_requeridos
            'Villa Alpina a las 9:00 hs', -- punto_encuentro
            'Los puestos cuentan con camas cucheta en habitaciones compartidas, baños y duchas con agua caliente. La energía eléctrica es de baja potencia, para usos básicos: carga de celular, iluminación básica, etc...',
            'Cada día realizaremos reuniones para repasar el itinerario, organizar el equipaje y brindar recomendaciones sobre técnicas de marcha y gestión del esfuerzo. Además, recibirás asesoramiento previo sobre el equipo necesario para la expedición.',
            ARRAY[]::text[], -- consideraciones_especiales
            'grupo abierto', -- modalidad
            12, -- cupos_maximos
            ARRAY[]::text[], -- servicios_incluidos
            ARRAY[]::text[], -- servicios_no_incluidos
            ARRAY['Enfoque educativo: autonomía en la montaña', 'Grupos reducidos', 'Ritmo ajustado y conexión con la montaña', 'Compromiso con el medio ambiente'], -- diferenciadores
            false, -- destacado
            true, -- activo
            '/champaqui/1.jpg', -- url_foto
            ARRAY['/champaqui/1.jpg', '/champaqui/2.jpg', '/champaqui/3.jpg'], -- urls_fotos
            '2025-01-01'::timestamp, -- fecha_creacion
            '2025-01-01'::timestamp -- fecha_actualizacion
        )
        RETURNING id_servicio INTO v_id_servicio;
    ELSE
        -- Si el servicio ya existe, actualizar sus datos y eliminar itinerarios/expediciones antiguas para recrearlos
        UPDATE servicios SET
            id_lugar = v_id_lugar,
            id_actividad = v_id_actividad,
            id_dificultad = v_id_dificultad,
            duracion_dias = 3,
            duracion_noches = 2,
            altura_maxima = 2790,
            descripcion_completa = 'La expedición al Cerro Champaquí es una experiencia inolvidable en las Sierras Grandes de Córdoba, ideal para quienes buscan un desafío físico y una inmersión en la naturaleza. Durante tres días, recorreremos senderos de montaña, cruzaremos arroyos y nos adentraremos en un entorno de gran belleza, hasta alcanzar la cumbre del techo de Córdoba, a 2.790 metros sobre el nivel del mar.',
            desc_resumen = 'Tres días de pura montaña en las Sierras Grandes: alcanzá los 2.790 m del imponente Champaquí.',
            descripcion_recorrido = 'Iniciaremos nuestro ascenso por la ruta Este, desde la localidad de Villa Alpina. A lo largo del recorrido, nos encontraremos con cruces de arroyos, puestos baqueanos, animales silvestres y de crianza, cuevas y miradores naturales. Durante la expedición, disfrutaremos de la hospitalidad de los lugareños y de su cocina casera, que nos acompañará en las tres jornadas de travesía.',
            sobre_lugar = 'Ubicado en el corazón de las Sierras Grandes, el Cerro Champaquí es la cumbre más alta de la provincia de Córdoba y un destino clásico para los amantes del trekking. A lo largo de la travesía, pasaremos por puestos serranos, disfrutaremos de la hospitalidad de los lugareños y seremos testigos de un paisaje cambiante que combina bosque serrano, pastizales de altura y formaciones rocosas imponentes.',
            clima_recomendado = 'Las mejores temporadas para realizar esta expedición son otoño, invierno y primavera, cuando las temperaturas son más estables y el clima es más propicio para el trekking. Durante el día, las temperaturas pueden oscilar entre 5°C y 20°C, mientras que por la noche pueden descender hasta los 0°C. Es fundamental contar con indumentaria adecuada para enfrentar las bajas temperaturas nocturnas.',
            temperatura_dia_min = 5,
            temperatura_dia_max = 20,
            temperatura_noche_min = 0,
            temporada_recomendada = ARRAY['otoño', 'invierno', 'primavera'],
            experiencia_requerida = 'Este trekking tiene una dificultad moderada con exigencia física alta. Se recomienda para personas con experiencia en caminatas de jornada larga y buen estado físico. No se requieren conocimientos técnicos, pero es necesario estar preparado para jornadas de entre 7 y 9 horas de caminata diarias con desniveles pronunciados.',
            horas_caminata_diarias = '7-9 horas',
            conocimientos_tecnicos_requeridos = false,
            punto_encuentro = 'Villa Alpina a las 9:00 hs',
            comodidades = 'Los puestos cuentan con camas cucheta en habitaciones compartidas, baños y duchas con agua caliente. La energía eléctrica es de baja potencia, para usos básicos: carga de celular, iluminación básica, etc...',
            briefing_info = 'Cada día realizaremos reuniones para repasar el itinerario, organizar el equipaje y brindar recomendaciones sobre técnicas de marcha y gestión del esfuerzo. Además, recibirás asesoramiento previo sobre el equipo necesario para la expedición.',
            consideraciones_especiales = ARRAY[]::text[],
            modalidad = 'grupo abierto',
            cupos_maximos = 12,
            servicios_incluidos = ARRAY[]::text[],
            servicios_no_incluidos = ARRAY[]::text[],
            diferenciadores = ARRAY['Enfoque educativo: autonomía en la montaña', 'Grupos reducidos', 'Ritmo ajustado y conexión con la montaña', 'Compromiso con el medio ambiente'],
            url_foto = '/champaqui/1.jpg',
            urls_fotos = ARRAY['/champaqui/1.jpg', '/champaqui/2.jpg', '/champaqui/3.jpg'],
            fecha_actualizacion = NOW()
        WHERE id_servicio = v_id_servicio;
        
        -- Eliminar itinerarios y expediciones antiguas para recrearlos
        DELETE FROM itinerarios WHERE id_servicio = v_id_servicio;
        DELETE FROM expedicion_precios WHERE id_expedicion IN (
            SELECT id_expedicion FROM expediciones WHERE id_servicio = v_id_servicio
        );
        DELETE FROM expediciones WHERE id_servicio = v_id_servicio;
    END IF;

    -- 6. INSERTAR ITINERARIOS (solo si tenemos id_servicio)
    IF v_id_servicio IS NOT NULL THEN
        -- Día 0: Revisión de equipo
        INSERT INTO itinerarios (
            id_servicio,
            dia,
            total_dias,
            titulo,
            descripcion,
            actividades_especiales
        )
        VALUES (
            v_id_servicio,
            0,
            3,
            'Revisión de equipo',
            'Revisión de equipo e indumentaria solicitada por medios virtuales. Asesoramiento con elementos faltantes para su compra o alquiler.',
            ARRAY['Revisión de equipo', 'Asesoramiento']
        );

        -- Día 1: Encuentro en Villa Alpina
        INSERT INTO itinerarios (
            id_servicio,
            dia,
            total_dias,
            titulo,
            descripcion,
            hora_inicio,
            hora_fin,
            distancia_km,
            alojamiento,
            comidas
        )
        VALUES (
            v_id_servicio,
            1,
            3,
            'Encuentro en Villa Alpina',
            'Encuentro en Villa Alpina a las 9:00 hs. Presentación del equipo, distribución de equipaje y comienzo del trekking. Caminata de aproximadamente 14 km con almuerzo itinerante. Arribo al refugio serrano alrededor de las 17:00 hs.',
            '09:00',
            '17:00',
            14,
            'refugio serrano',
            ARRAY['almuerzo itinerante', 'cena', 'pernocte']
        );

        -- Día 2: Ascenso a la cumbre
        INSERT INTO itinerarios (
            id_servicio,
            dia,
            total_dias,
            titulo,
            descripcion,
            hora_fin,
            distancia_km,
            altitud,
            alojamiento,
            comidas,
            actividades_especiales
        )
        VALUES (
            v_id_servicio,
            2,
            3,
            'Ascenso a la cumbre del Cerro Champaquí',
            'Ascenso a la cumbre del Cerro Champaquí y visita al Balcón de las Sierras. Caminata de aproximadamente 14 km (ida y vuelta), con almuerzo itinerante en el camino. Retorno al refugio alrededor de las 18:00 hs.',
            '18:00',
            14,
            2790,
            'refugio serrano',
            ARRAY['almuerzo itinerante', 'cena', 'descanso'],
            ARRAY['Cumbre', 'Balcón de las Sierras']
        );

        -- Día 3: Trekking de regreso
        INSERT INTO itinerarios (
            id_servicio,
            dia,
            total_dias,
            titulo,
            descripcion,
            hora_fin,
            comidas
        )
        VALUES (
            v_id_servicio,
            3,
            3,
            'Trekking de regreso a Villa Alpina',
            'Desayuno y trekking de regreso a Villa Alpina. Almuerzo itinerante durante la bajada. Finalización de la actividad alrededor de las 16:00 hs.',
            '16:00',
            ARRAY['desayuno', 'almuerzo itinerante']
        );

        -- 7. INSERTAR EXPEDICIÓN
        INSERT INTO expediciones (
            id_servicio,
            fecha_salida,
            fecha_fin,
            cupos_disponibles,
            cupos_ocupados,
            estado,
            presupuesto_valido_hasta,
            fecha_creacion,
            fecha_actualizacion
        )
        VALUES (
            v_id_servicio,
            '2025-09-05'::timestamp,
            '2025-09-07'::timestamp,
            12,
            0,
            'Activa',
            '2025-08-20'::timestamp,
            '2025-01-01'::timestamp,
            '2025-01-01'::timestamp
        )
        RETURNING id_expedicion INTO v_id_expedicion;

        -- 8. INSERTAR PRECIOS DE LA EXPEDICIÓN
        -- Precio Full
        INSERT INTO expedicion_precios (
            id_expedicion,
            nombre_paquete,
            precio,
            moneda
        )
        VALUES (
            v_id_expedicion,
            'Full',
            377200.00,
            'ARS'
        );

        -- Precio Básico
        INSERT INTO expedicion_precios (
            id_expedicion,
            nombre_paquete,
            precio,
            moneda
        )
        VALUES (
            v_id_expedicion,
            'Básico',
            291330.00,
            'ARS'
        );
    END IF;

    RAISE NOTICE 'Servicio Champaquí insertado/actualizado correctamente. id_servicio: %, id_expedicion: %', v_id_servicio, v_id_expedicion;
END $$;

-- ============================================
-- FIN DEL SCRIPT
-- ============================================
-- Este script usa un bloque DO $$ para manejar los IDs dinámicamente
-- y evitar problemas con IDs existentes o duplicados
-- ============================================

