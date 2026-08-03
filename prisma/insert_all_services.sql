-- ============================================
-- SCRIPT DE INSERCIÓN: Todos los Servicios (excepto Champaquí)
-- ============================================
-- Este script inserta todos los servicios y sus itinerarios
-- Servicios: Penitentes, Punta Negra, Vallecitos, Tuzgle, Aconcagua, Quewar, Franke, San Francisco, Llullaillaco
-- ============================================

DO $$
DECLARE
    v_id_ubicacion INT;
    v_id_lugar INT;
    v_id_actividad INT;
    v_id_dificultad INT;
    v_id_servicio INT;
BEGIN
    -- ============================================
    -- SERVICIO 2: PENITENTES
    -- ============================================
    
    -- Obtener o crear ubicación (Mendoza - Cordillera Frontal)
    SELECT id_ubicacion INTO v_id_ubicacion
    FROM ubicaciones
    WHERE pais = 'Argentina' AND provincia = 'Mendoza' AND zona = 'Cordillera Frontal'
    LIMIT 1;
    
    IF v_id_ubicacion IS NULL THEN
        INSERT INTO ubicaciones (pais, provincia, zona)
        VALUES ('Argentina', 'Mendoza', 'Cordillera Frontal')
        RETURNING id_ubicacion INTO v_id_ubicacion;
    END IF;

    -- Obtener o crear lugar (Cerro Penitentes)
    SELECT id_lugar INTO v_id_lugar
    FROM lugares
    WHERE nombre = 'Cerro Penitentes'
    LIMIT 1;
    
    IF v_id_lugar IS NULL THEN
        INSERT INTO lugares (nombre, tipo_lugar, altitud, descripcion, id_ubicacion)
        VALUES (
            'Cerro Penitentes',
            'Montaña',
            4350,
            'El Cerro Penitentes se encuentra frente al imponente macizo del Aconcagua, su cumbre es el mirador por excelencia de la pared sur. Su entorno ofrece un paisaje típico de la cordillera frontal: valles amplios, laderas pedregosas, penitentes de hielo y vistas abiertas hacia la alta montaña.',
            v_id_ubicacion
        )
        RETURNING id_lugar INTO v_id_lugar;
    END IF;

    -- Obtener actividad (Ascenso de alta montaña)
    SELECT id_actividad INTO v_id_actividad
    FROM actividades
    WHERE nombre = 'Ascenso de alta montaña'
    LIMIT 1;
    
    IF v_id_actividad IS NULL THEN
        INSERT INTO actividades (nombre, descripcion)
        VALUES ('Ascenso de alta montaña', 'Ascenso de montañas de alta altitud')
        RETURNING id_actividad INTO v_id_actividad;
    END IF;

    -- Obtener dificultad (Moderada)
    SELECT id_dificultad INTO v_id_dificultad
    FROM dificultades
    WHERE nivel = 'Moderada'
    LIMIT 1;

    -- Verificar si el servicio Penitentes ya existe
    SELECT id_servicio INTO v_id_servicio
    FROM servicios
    WHERE nombre = 'Penitentes'
    LIMIT 1;
    
    IF v_id_servicio IS NULL THEN
        INSERT INTO servicios (
            nombre, id_lugar, id_actividad, id_dificultad,
            duracion_dias, duracion_noches, altura_maxima, desnivel,
            descripcion_completa, desc_resumen, sobre_lugar, clima_recomendado,
            temperatura_dia_min, temperatura_dia_max, temperatura_noche_min,
            temporada_recomendada, experiencia_requerida, horas_caminata_diarias, peso_mochila,
            conocimientos_tecnicos_requeridos, punto_encuentro, comodidades, briefing_info,
            consideraciones_especiales, modalidad, cupos_maximos, ratio_guia_pasajero,
            alimentacion_detalle, servicios_incluidos, servicios_no_incluidos,
            servicios_adicionales_disponibles, diferenciadores, destacado, activo,
            url_foto, urls_fotos, fecha_creacion, fecha_actualizacion
        )
        VALUES (
            'Penitentes', v_id_lugar, v_id_actividad, v_id_dificultad,
            4, 3, 4350, 1050,
            'El ascenso al Cerro Penitentes es una expedición de alta montaña en la Cordillera Frontal de Mendoza, ideal (pero no excluyente) para quienes ya tienen experiencia en trekking y desean dar el salto a los 4.000 metros.',
            'Un salto al montañismo: 4 días de experiencia y aprendizaje rumbo a los 4.350 m del Penitentes.',
            'El Cerro Penitentes se encuentra frente al imponente macizo del Aconcagua, su cumbre es el mirador por excelencia de la pared sur. Su entorno ofrece un paisaje típico de la cordillera frontal: valles amplios, laderas pedregosas, penitentes de hielo y vistas abiertas hacia la alta montaña.',
            'La mejor temporada para ascender el Penitentes es entre octubre y marzo, cuando las temperaturas son más estables y hay menor probabilidad de nevadas. Durante el día, las temperaturas pueden oscilar entre 0°C y 20°C, aunque en altura y durante la noche pueden descender hasta -10°C.',
            0, 20, -10,
            ARRAY['octubre', 'noviembre', 'diciembre', 'enero', 'febrero', 'marzo'],
            'Esta expedición está clasificada como de dificultad media-alta. Se requiere buen estado físico, experiencia previa en trekking de varios días (no excluyente) y disposición a caminar con mochila en terreno irregular y de altura.',
            '11-13 horas',
            '15 kg aprox',
            false,
            'Mendoza a las 9:00 hs',
            'Alojamiento 1 noche en Hostería, y 2 noches en carpas de alta montaña. Los refugios cuentan con servicios básicos y las carpas son de alta montaña especializadas para condiciones extremas.',
            'Cada día realizaremos una reunión para revisar el plan de ascenso, organizar el equipo y brindar recomendaciones sobre aclimatación, técnicas de marcha y gestión del esfuerzo en altura.',
            ARRAY[]::text[],
            'grupo reducido',
            6,
            '1-3',
            '{"desayunos": "Huevos, palta, panificaciones", "raciones_marcha": "Empanadas, sándwiches con fiambres, huevo, fruta, etc...", "cenas": "Platos regionales en Mendoza; opciones ligeras y altamente nutritivas en campamentos de altura"}',
            ARRAY['Guías profesionales de montaña', 'Grupos reducidos ratio 1-3 (1 guía cada 3 pasajeros)', 'Pensión completa en montaña', 'Alojamiento 1 noche en Hostería, y 2 noches en carpas de alta montaña', 'Transporte local en Mendoza', 'Porteo de equipo comunitario (comida, cocina y carpas)', 'Armado de campamento', 'Registro audiovisual del ascenso', 'Seguro contra accidentes personales', 'Botiquín grupal de primeros auxilios', 'Comunicación VHF', 'Listado de elementos para el viaje y asesoramiento individual previo (vía WhatsApp)'],
            ARRAY['Indumentaria personal', 'Equipo de montaña personal', 'Bebidas', 'Snacks de marcha', 'Transporte hasta Mendoza'],
            ARRAY['Porteo de equipo personal'],
            ARRAY['Enfoque educativo: autonomía en la montaña', 'Grupos reducidos', 'Ritmo ajustado y conexión con la montaña', 'Compromiso con el medio ambiente'],
            false,
            true,
            '/penitentes/1.jpg',
            ARRAY['/penitentes/1.jpg', '/penitentes/2.jpg', '/penitentes/3.jpg'],
            '2025-01-01'::timestamp,
            '2025-01-01'::timestamp
        )
        RETURNING id_servicio INTO v_id_servicio;
    ELSE
        UPDATE servicios SET
            id_lugar = v_id_lugar, id_actividad = v_id_actividad, id_dificultad = v_id_dificultad,
            duracion_dias = 4, duracion_noches = 3, altura_maxima = 4350, desnivel = 1050,
            descripcion_completa = 'El ascenso al Cerro Penitentes es una expedición de alta montaña en la Cordillera Frontal de Mendoza, ideal (pero no excluyente) para quienes ya tienen experiencia en trekking y desean dar el salto a los 4.000 metros.',
            desc_resumen = 'Un salto al montañismo: 4 días de experiencia y aprendizaje rumbo a los 4.350 m del Penitentes.',
            sobre_lugar = 'El Cerro Penitentes se encuentra frente al imponente macizo del Aconcagua, su cumbre es el mirador por excelencia de la pared sur. Su entorno ofrece un paisaje típico de la cordillera frontal: valles amplios, laderas pedregosas, penitentes de hielo y vistas abiertas hacia la alta montaña.',
            clima_recomendado = 'La mejor temporada para ascender el Penitentes es entre octubre y marzo, cuando las temperaturas son más estables y hay menor probabilidad de nevadas. Durante el día, las temperaturas pueden oscilar entre 0°C y 20°C, aunque en altura y durante la noche pueden descender hasta -10°C.',
            temperatura_dia_min = 0, temperatura_dia_max = 20, temperatura_noche_min = -10,
            temporada_recomendada = ARRAY['octubre', 'noviembre', 'diciembre', 'enero', 'febrero', 'marzo'],
            experiencia_requerida = 'Esta expedición está clasificada como de dificultad media-alta. Se requiere buen estado físico, experiencia previa en trekking de varios días (no excluyente) y disposición a caminar con mochila en terreno irregular y de altura.',
            horas_caminata_diarias = '11-13 horas', peso_mochila = '15 kg aprox',
            punto_encuentro = 'Mendoza a las 9:00 hs',
            comodidades = 'Alojamiento 1 noche en Hostería, y 2 noches en carpas de alta montaña. Los refugios cuentan con servicios básicos y las carpas son de alta montaña especializadas para condiciones extremas.',
            briefing_info = 'Cada día realizaremos una reunión para revisar el plan de ascenso, organizar el equipo y brindar recomendaciones sobre aclimatación, técnicas de marcha y gestión del esfuerzo en altura.',
            modalidad = 'grupo reducido', cupos_maximos = 6, ratio_guia_pasajero = '1-3',
            alimentacion_detalle = '{"desayunos": "Huevos, palta, panificaciones", "raciones_marcha": "Empanadas, sándwiches con fiambres, huevo, fruta, etc...", "cenas": "Platos regionales en Mendoza; opciones ligeras y altamente nutritivas en campamentos de altura"}',
            servicios_incluidos = ARRAY['Guías profesionales de montaña', 'Grupos reducidos ratio 1-3 (1 guía cada 3 pasajeros)', 'Pensión completa en montaña', 'Alojamiento 1 noche en Hostería, y 2 noches en carpas de alta montaña'],
            servicios_no_incluidos = ARRAY['Indumentaria personal', 'Equipo de montaña personal', 'Bebidas', 'Snacks de marcha', 'Transporte hasta Mendoza'],
            servicios_adicionales_disponibles = ARRAY['Porteo de equipo personal'],
            diferenciadores = ARRAY['Enfoque educativo: autonomía en la montaña', 'Grupos reducidos', 'Ritmo ajustado y conexión con la montaña', 'Compromiso con el medio ambiente'],
            url_foto = '/penitentes/1.jpg', urls_fotos = ARRAY['/penitentes/1.jpg', '/penitentes/2.jpg', '/penitentes/3.jpg'],
            fecha_actualizacion = NOW()
        WHERE id_servicio = v_id_servicio;
        DELETE FROM itinerarios WHERE id_servicio = v_id_servicio;
    END IF;

    -- Insertar itinerarios de Penitentes
    IF v_id_servicio IS NOT NULL THEN
        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, hora_inicio, altitud, alojamiento, comidas, actividades_especiales)
        VALUES (v_id_servicio, 1, 4, 'Encuentro en Mendoza', 'Encuentro en Mendoza a las 9:00 hs. Revisión de equipo. Traslado al Refugio de Penitentes (2.800 m). Caminata de aclimatación en las inmediaciones.', '09:00', 2800, 'refugio', ARRAY['cena', 'pernocte'], ARRAY['Revisión de equipo', 'Aclimatación']);

        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, duracion_horas, peso_mochila, desnivel_metros, altitud, alojamiento, comidas, intensidad)
        VALUES (v_id_servicio, 2, 4, 'Trekking al campamento de altura', 'Traslado en vehículo a la quebrada de Vargas 2650 msnm. Trekking de aproximación al campamento de altura (3.300 m). Armado de carpas y tarde libre para descanso y aclimatación. Cena caliente en campamento.', '4-5hs', '15 kg aprox', 650, 3300, 'campamento', ARRAY['cena caliente'], 'exigente');

        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, duracion_horas, desnivel_metros, altitud, alojamiento, comidas, intensidad, actividades_especiales)
        VALUES (v_id_servicio, 3, 4, 'Ascenso a la cumbre del Cerro Penitentes', 'Ascenso a la cumbre del Cerro Penitentes 4.350 msnm. Regreso al campamento de altura. Cena y pernocte.', '11-13hs aprox', 1050, 4350, 'campamento', ARRAY['cena', 'pernocte'], 'exigente', ARRAY['Cumbre']);

        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, hora_fin, comidas)
        VALUES (v_id_servicio, 4, 4, 'Regreso a Mendoza', 'Desarme de campamento y descenso al inicio de la quebrada donde están los vehículos. Regreso al refugio, almuerzo de despedida y cierre del programa. Traslado a Mendoza.', '18:00', ARRAY['almuerzo de despedida']);
    END IF;

    -- ============================================
    -- SERVICIO 3: PUNTA NEGRA
    -- ============================================
    
    -- Obtener o crear ubicación (Mendoza - Arenales)
    SELECT id_ubicacion INTO v_id_ubicacion
    FROM ubicaciones
    WHERE pais = 'Argentina' AND provincia = 'Mendoza' AND zona = 'Arenales'
    LIMIT 1;
    
    IF v_id_ubicacion IS NULL THEN
        INSERT INTO ubicaciones (pais, provincia, zona)
        VALUES ('Argentina', 'Mendoza', 'Arenales')
        RETURNING id_ubicacion INTO v_id_ubicacion;
    END IF;

    -- Obtener o crear lugar (Cerro Punta Negra)
    SELECT id_lugar INTO v_id_lugar
    FROM lugares
    WHERE nombre = 'Cerro Punta Negra'
    LIMIT 1;
    
    IF v_id_lugar IS NULL THEN
        INSERT INTO lugares (nombre, tipo_lugar, altitud, descripcion, id_ubicacion)
        VALUES (
            'Cerro Punta Negra',
            'Montaña',
            4340,
            'El cerro Punta Negra se encuentra en las inmediaciones del valle de Arenales, una región de belleza escénica impactante, conocida por sus paredones de granito y su ambiente silvestre.',
            v_id_ubicacion
        )
        RETURNING id_lugar INTO v_id_lugar;
    END IF;

    -- Verificar si el servicio Punta Negra ya existe
    SELECT id_servicio INTO v_id_servicio
    FROM servicios
    WHERE nombre = 'Punta Negra'
    LIMIT 1;
    
    IF v_id_servicio IS NULL THEN
        INSERT INTO servicios (
            nombre, id_lugar, id_actividad, id_dificultad,
            duracion_dias, duracion_noches, altura_maxima, desnivel,
            descripcion_completa, desc_resumen, sobre_lugar, clima_recomendado,
            temperatura_dia_min, temperatura_dia_max, temperatura_noche_min,
            temporada_recomendada, experiencia_requerida, horas_caminata_diarias,
            conocimientos_tecnicos_requeridos, punto_encuentro, briefing_info,
            consideraciones_especiales, modalidad, cupos_maximos, ratio_guia_pasajero,
            alimentacion_detalle, servicios_incluidos, servicios_no_incluidos,
            servicios_adicionales_disponibles, diferenciadores, activo,
            url_foto, urls_fotos, fecha_creacion, fecha_actualizacion
        )
        VALUES (
            'Punta Negra', v_id_lugar, v_id_actividad, v_id_dificultad,
            3, 2, 4340, 1170,
            'El ascenso al Cerro Punta Negra es una experiencia de montaña de 3 días que combina caminatas sostenidas, acampe en plena cordillera y un entorno agreste ideal para quienes buscan alejarse de los circuitos más concurridos.',
            'Viví la montaña en estado puro: caminatas, carpa y la cima del Punta Negra.',
            'El cerro Punta Negra se encuentra en las inmediaciones del valle de Arenales, una región de belleza escénica impactante, conocida por sus paredones de granito y su ambiente silvestre.',
            'La temporada ideal para ascender al Cerro Punta Negra es de octubre a abril, cuando las condiciones de nieve y temperaturas permiten el acceso seguro y la permanencia en altura.',
            5, 20, 0,
            ARRAY['octubre', 'noviembre', 'diciembre', 'enero', 'febrero', 'marzo', 'abril'],
            'Expedición de dificultad media, ideal para personas con buena condición física y experiencia en trekking.',
            '10 horas',
            false,
            'Tunuyán 11hs, provincia de Mendoza',
            'Cada día realizaremos encuentros para revisar el itinerario, evaluar la aclimatación y compartir recomendaciones para enfrentar la altura con seguridad.',
            ARRAY['Expedición en zona remota con condiciones de aislamiento', 'Sin acceso a señal de celular ni asistencia médica cercana', 'Región limítrofe con Chile - documentación vigente obligatoria'],
            'grupo reducido',
            6,
            '1-3',
            '{"desayunos": "Huevos, palta, panificaciones", "raciones_marcha": "Empanadas, sándwiches con fiambres al vacío, huevo, fruta", "cenas": "Platos regionales; opciones ligeras y altamente nutritivas en campamentos de altura"}',
            ARRAY['Guías profesionales de montaña', 'Grupos reducidos ratio 1-3 (1 guía cada 3 pasajeros)', 'Transfer desde Tunuyán a Scaravelli (ida y vuelta)', 'Pensión completa en montaña', 'Alojamiento 2 noches en carpas de alta montaña', 'Registro audiovisual del ascenso', 'Seguro contra accidentes personales', 'Botiquín grupal de primeros auxilios', 'Comunicación VHF y satelital para emergencias', 'Listado de elementos para el viaje y asesoramiento individual previo (vía WhatsApp)', 'Transporte local en Mendoza'],
            ARRAY['Indumentaria personal', 'Equipo de montaña personal', 'Bebidas', 'Snacks de marcha', 'Transporte hasta Tunuyán'],
            ARRAY['Almuerzo de despedida en bodega'],
            ARRAY['Enfoque educativo: autonomía en la montaña', 'Grupos reducidos', 'Ritmo ajustado y conexión con la montaña', 'Compromiso con el medio ambiente'],
            true,
            '/punta-negra/1.jpg',
            ARRAY['/punta-negra/1.jpg', '/punta-negra/2.jpg', '/punta-negra/3.png'],
            '2025-01-01'::timestamp,
            '2025-01-01'::timestamp
        )
        RETURNING id_servicio INTO v_id_servicio;
    ELSE
        UPDATE servicios SET
            id_lugar = v_id_lugar, id_actividad = v_id_actividad, id_dificultad = v_id_dificultad,
            duracion_dias = 3, duracion_noches = 2, altura_maxima = 4340, desnivel = 1170,
            descripcion_completa = 'El ascenso al Cerro Punta Negra es una experiencia de montaña de 3 días que combina caminatas sostenidas, acampe en plena cordillera y un entorno agreste ideal para quienes buscan alejarse de los circuitos más concurridos.',
            desc_resumen = 'Viví la montaña en estado puro: caminatas, carpa y la cima del Punta Negra.',
            sobre_lugar = 'El cerro Punta Negra se encuentra en las inmediaciones del valle de Arenales, una región de belleza escénica impactante, conocida por sus paredones de granito y su ambiente silvestre.',
            clima_recomendado = 'La temporada ideal para ascender al Cerro Punta Negra es de octubre a abril, cuando las condiciones de nieve y temperaturas permiten el acceso seguro y la permanencia en altura.',
            temperatura_dia_min = 5, temperatura_dia_max = 20, temperatura_noche_min = 0,
            temporada_recomendada = ARRAY['octubre', 'noviembre', 'diciembre', 'enero', 'febrero', 'marzo', 'abril'],
            experiencia_requerida = 'Expedición de dificultad media, ideal para personas con buena condición física y experiencia en trekking.',
            horas_caminata_diarias = '10 horas',
            punto_encuentro = 'Tunuyán 11hs, provincia de Mendoza',
            briefing_info = 'Cada día realizaremos encuentros para revisar el itinerario, evaluar la aclimatación y compartir recomendaciones para enfrentar la altura con seguridad.',
            consideraciones_especiales = ARRAY['Expedición en zona remota con condiciones de aislamiento', 'Sin acceso a señal de celular ni asistencia médica cercana', 'Región limítrofe con Chile - documentación vigente obligatoria'],
            modalidad = 'grupo reducido', cupos_maximos = 6, ratio_guia_pasajero = '1-3',
            url_foto = '/punta-negra/1.jpg', urls_fotos = ARRAY['/punta-negra/1.jpg', '/punta-negra/2.jpg', '/punta-negra/3.png'],
            fecha_actualizacion = NOW()
        WHERE id_servicio = v_id_servicio;
        DELETE FROM itinerarios WHERE id_servicio = v_id_servicio;
    END IF;

    -- Insertar itinerarios de Punta Negra
    IF v_id_servicio IS NOT NULL THEN
        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, hora_inicio, duracion_horas, altitud, alojamiento, comidas)
        VALUES (v_id_servicio, 1, 3, 'Encuentro en Tunuyán', 'Encuentro en Tunuyán 11hs, provincia de Mendoza. Traslado hasta la zona de Arenales en vehículo 4x4. Si el camino esta en condiciones, se llega al campamento. En caso contrario, trekking de aproximación y porteo de equipo (3-4 h) hasta el campamento base, en zona de refugio Scaravelli 3170 msnm.', '11:00', '3-4h', 3170, 'campamento base', ARRAY['armado de carpas', 'cena', 'descanso']);

        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, duracion_horas, desnivel_metros, altitud, alojamiento, comidas, intensidad, actividades_especiales)
        VALUES (v_id_servicio, 2, 3, 'Ascenso al Cerro Punta Negra', 'Ascenso al Cerro Punta Negra (4340 m). Almuerzo tipo marcha, cumbre y regreso al campamento. Jornada exigente 10hs, sin pasos técnicos.', '10hs', 1170, 4340, 'campamento', ARRAY['almuerzo tipo marcha', 'cena', 'pernocte'], 'exigente', ARRAY['Cumbre']);

        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, comidas, actividades_especiales)
        VALUES (v_id_servicio, 3, 3, 'Regreso y visita al Manzano Histórico', 'Desayuno, desarme de campamento y caminata de regreso al punto de inicio. Paseo por el ''Monumento Retorno a la Patria'' en el Manzano Histórico, almuerzo de despedida. Traslado a Mendoza.', ARRAY['desayuno', 'almuerzo de despedida'], ARRAY['Monumento Retorno a la Patria']);
    END IF;

    -- ============================================
    -- SERVICIO 4: VALLECITOS (DESTACADO)
    -- ============================================
    
    -- Obtener o crear ubicación (Mendoza - Cordillera Frontal)
    SELECT id_ubicacion INTO v_id_ubicacion
    FROM ubicaciones
    WHERE pais = 'Argentina' AND provincia = 'Mendoza' AND zona = 'Cordillera Frontal'
    LIMIT 1;

    -- Obtener o crear lugar (Cerro Vallecitos)
    SELECT id_lugar INTO v_id_lugar
    FROM lugares
    WHERE nombre = 'Cerro Vallecitos'
    LIMIT 1;
    
    IF v_id_lugar IS NULL THEN
        INSERT INTO lugares (nombre, tipo_lugar, altitud, descripcion, id_ubicacion)
        VALUES (
            'Cerro Vallecitos',
            'Montaña',
            5470,
            'Ubicado en la Cordillera Frontal de Mendoza, Vallecitos es uno de los destinos más emblemáticos para la práctica del montañismo en Argentina. Su entorno privilegiado, con múltiples cumbres accesibles y variados terrenos de ascenso, lo convierte en un escenario ideal para la progresión en altura.',
            v_id_ubicacion
        )
        RETURNING id_lugar INTO v_id_lugar;
    END IF;

    -- Obtener dificultad (Media-Alta)
    SELECT id_dificultad INTO v_id_dificultad
    FROM dificultades
    WHERE nivel = 'Media-Alta'
    LIMIT 1;
    
    IF v_id_dificultad IS NULL THEN
        INSERT INTO dificultades (nivel, descripcion)
        VALUES ('Media-Alta', 'Dificultad media-alta')
        RETURNING id_dificultad INTO v_id_dificultad;
    END IF;

    -- Verificar si el servicio Vallecitos ya existe
    SELECT id_servicio INTO v_id_servicio
    FROM servicios
    WHERE nombre = 'Vallecitos'
    LIMIT 1;
    
    IF v_id_servicio IS NULL THEN
        INSERT INTO servicios (
            nombre, id_lugar, id_actividad, id_dificultad,
            duracion_dias, duracion_noches, altura_maxima, desnivel,
            descripcion_completa, desc_resumen, sobre_lugar, clima_recomendado,
            temperatura_dia_min, temperatura_dia_max, temperatura_noche_min,
            temporada_recomendada, experiencia_requerida, horas_caminata_diarias,
            conocimientos_tecnicos_requeridos, punto_encuentro, briefing_info,
            modalidad, cupos_maximos, ratio_guia_pasajero,
            alimentacion_detalle, servicios_incluidos, servicios_adicionales_disponibles,
            diferenciadores, destacado, activo,
            url_foto, urls_fotos, fecha_creacion, fecha_actualizacion
        )
        VALUES (
            'Vallecitos', v_id_lugar, v_id_actividad, v_id_dificultad,
            6, 5, 5470, 1170,
            'La expedición a Cerro Vallecitos es una experiencia de alta montaña diseñada para quienes buscan superar sus límites y ganar experiencia en terrenos de gran altitud.',
            'Alta montaña en Mendoza: superá tus límites en la travesía al imponente Vallecitos.',
            'Ubicado en la Cordillera Frontal de Mendoza, Vallecitos es uno de los destinos más emblemáticos para la práctica del montañismo en Argentina.',
            'La mejor época para ascender el Cerro Vallecitos es de noviembre hasta abril, cuando las condiciones climáticas son más estables.',
            -5, 15, -15,
            ARRAY['noviembre', 'diciembre', 'enero', 'febrero', 'marzo', 'abril'],
            'Esta expedición es de dificultad media-alta, recomendada para personas con experiencia en trekking de altura y buen estado físico.',
            '10-12 horas',
            false,
            'Mendoza 8hs',
            'Cada día, realizaremos una reunión en la que revisaremos el plan de ascenso, ayudándote a organizar tu equipo, gestionar tu energía y optimizar tu alimentación para cada jornada.',
            'grupo reducido',
            4,
            '1-2',
            '{"desayunos": "Huevos, palta, panificaciones", "raciones_marcha": "Empanadas, sándwiches con fiambres al vacío de calidad, huevo, fruta, etc...", "cenas": "Platos frescos y proteicos en campamentos bajos; opciones ligeras y altamente nutritivas en campamentos de altura"}',
            ARRAY['Guías profesionales de montaña', 'Grupos reducidos ratio 1-2 (1 guía cada 2 pasajeros)', 'Pensión completa en la montaña', 'Alojamiento en tiendas de montaña', 'Registro audiovisual del ascenso', 'Almuerzo de despedida', 'Seguro contra accidentes personales', 'Botiquín grupal de primeros auxilios', 'Comunicación VHF', 'Comunicación satelital', 'Listado de elementos para el viaje y asesoramiento individual previo (vía WhatsApp)', 'Transporte local en Mendoza'],
            ARRAY['Porteo: Hasta 20k de equipo porteados en todos o algún tramo del ascenso', 'Día extra: Adiciona un día extra previo al programa, para mejorar la aclimatación o cuestiones climáticas', 'Combina con otras actividades: Termas, rafting, kayak, escalada/rapel'],
            ARRAY['Enfoque educativo: autonomía en la montaña', 'Grupos reducidos', 'Ritmo ajustado y conexión con la montaña', 'Compromiso con el medio ambiente'],
            true,
            '/vallecitos/1.jpg',
            ARRAY['/vallecitos/1.jpg', '/vallecitos/2.jpg', '/vallecitos/3.jpg'],
            '2025-01-01'::timestamp,
            '2025-01-01'::timestamp
        )
        RETURNING id_servicio INTO v_id_servicio;
    ELSE
        UPDATE servicios SET
            id_lugar = v_id_lugar, id_actividad = v_id_actividad, id_dificultad = v_id_dificultad,
            duracion_dias = 6, duracion_noches = 5, altura_maxima = 5470, desnivel = 1170,
            descripcion_completa = 'La expedición a Cerro Vallecitos es una experiencia de alta montaña diseñada para quienes buscan superar sus límites y ganar experiencia en terrenos de gran altitud.',
            desc_resumen = 'Alta montaña en Mendoza: superá tus límites en la travesía al imponente Vallecitos.',
            sobre_lugar = 'Ubicado en la Cordillera Frontal de Mendoza, Vallecitos es uno de los destinos más emblemáticos para la práctica del montañismo en Argentina.',
            clima_recomendado = 'La mejor época para ascender el Cerro Vallecitos es de noviembre hasta abril, cuando las condiciones climáticas son más estables.',
            temperatura_dia_min = -5, temperatura_dia_max = 15, temperatura_noche_min = -15,
            temporada_recomendada = ARRAY['noviembre', 'diciembre', 'enero', 'febrero', 'marzo', 'abril'],
            experiencia_requerida = 'Esta expedición es de dificultad media-alta, recomendada para personas con experiencia en trekking de altura y buen estado físico.',
            horas_caminata_diarias = '10-12 horas',
            punto_encuentro = 'Mendoza 8hs',
            briefing_info = 'Cada día, realizaremos una reunión en la que revisaremos el plan de ascenso, ayudándote a organizar tu equipo, gestionar tu energía y optimizar tu alimentación para cada jornada.',
            modalidad = 'grupo reducido', cupos_maximos = 4, ratio_guia_pasajero = '1-2',
            destacado = true,
            url_foto = '/vallecitos/1.jpg', urls_fotos = ARRAY['/vallecitos/1.jpg', '/vallecitos/2.jpg', '/vallecitos/3.jpg'],
            fecha_actualizacion = NOW()
        WHERE id_servicio = v_id_servicio;
        DELETE FROM itinerarios WHERE id_servicio = v_id_servicio;
    END IF;

    -- Insertar itinerarios de Vallecitos
    IF v_id_servicio IS NOT NULL THEN
        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, actividades_especiales)
        VALUES (v_id_servicio, 0, 6, 'Revisión de equipo virtual', 'Revisión de equipo solicitado por medios virtuales, asesoramiento en caso de faltantes para compra o alquiler.', ARRAY['Revisión de equipo']);

        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, hora_inicio, distancia_km, desnivel_metros, duracion_horas, altitud, alojamiento, intensidad)
        VALUES (v_id_servicio, 1, 6, 'Encuentro en Mendoza', 'Encuentro en la ciudad de Mendoza 8hs. Traslado en vehículo privado hasta Vallecitos. Inicio del trekking-porteo a Veguitas superior (C1-3450 msnm), armado de campamento y pernocte.', '08:00', 2, 500, '2-3hs', 3450, 'campamento C1', 'moderada-exigente');

        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, distancia_km, desnivel_metros, duracion_horas, altitud, alojamiento, intensidad)
        VALUES (v_id_servicio, 2, 6, 'Porteo al Salto de agua', 'Porteo de equipo al ''Salto de agua'' (C2-4300 msnm), descenso y pernocte en C1.', 11, 650, '6-8hs', 4300, 'C1', 'moderada-exigente');

        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, distancia_km, desnivel_metros, duracion_horas, altitud, alojamiento, intensidad)
        VALUES (v_id_servicio, 3, 6, 'Trekking al Salto de agua', 'Trekking al ''Salto de agua'' (C2), armado de campamento y pernocte.', 5, 650, '4-5hs', 4300, 'campamento C2', 'moderada-exigente');

        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, altitud, alojamiento)
        VALUES (v_id_servicio, 4, 6, 'Descanso activo', 'Descanso activo en C2.', 4300, 'campamento C2');

        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, distancia_km, desnivel_metros, duracion_horas, altitud, alojamiento, intensidad, actividades_especiales)
        VALUES (v_id_servicio, 5, 6, 'Intento de cumbre al Vallecitos', 'Intento de cumbre al cerro Vallecitos 5450msnm, descenso y pernocte en C2.', 12, 1170, '10-12hs', 5470, 'campamento C2', 'exigente-muy exigente', ARRAY['Cumbre']);

        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, hora_fin, comidas)
        VALUES (v_id_servicio, 6, 6, 'Descenso a Mendoza', 'Descenso a la zona de refugios, almuerzo en Potrerillos y retorno en vehículo privado a Mendoza a las 17hs aprox.', '17:00', ARRAY['almuerzo en Potrerillos']);
    END IF;

    -- ============================================
    -- SERVICIO 5: TUZGLE (DESTACADO)
    -- ============================================
    
    -- Obtener o crear ubicación (Salta - Puna de Atacama)
    SELECT id_ubicacion INTO v_id_ubicacion
    FROM ubicaciones
    WHERE pais = 'Argentina' AND provincia = 'Salta' AND zona = 'Puna de Atacama'
    LIMIT 1;
    
    IF v_id_ubicacion IS NULL THEN
        INSERT INTO ubicaciones (pais, provincia, zona)
        VALUES ('Argentina', 'Salta', 'Puna de Atacama')
        RETURNING id_ubicacion INTO v_id_ubicacion;
    END IF;

    -- Obtener o crear lugar (Volcán Tuzgle)
    SELECT id_lugar INTO v_id_lugar
    FROM lugares
    WHERE nombre = 'Volcán Tuzgle'
    LIMIT 1;
    
    IF v_id_lugar IS NULL THEN
        INSERT INTO lugares (nombre, tipo_lugar, altitud, descripcion, id_ubicacion)
        VALUES (
            'Volcán Tuzgle',
            'Volcán',
            5530,
            'Ubicado en la provincia de Salta, el volcán Tuzgle es un estratovolcán inactivo que se alza imponente en el altiplano andino. Su entorno ofrece vistas panorámicas de los salares y formaciones geológicas milenarias.',
            v_id_ubicacion
        )
        RETURNING id_lugar INTO v_id_lugar;
    END IF;

    -- Verificar si el servicio Tuzgle ya existe
    SELECT id_servicio INTO v_id_servicio
    FROM servicios
    WHERE nombre = 'Volcán Tuzgle'
    LIMIT 1;
    
    IF v_id_servicio IS NULL THEN
        INSERT INTO servicios (
            nombre, id_lugar, id_actividad, id_dificultad,
            duracion_dias, duracion_noches, altura_maxima,
            descripcion_completa, desc_resumen, sobre_lugar, clima_recomendado,
            temperatura_dia_min, temperatura_dia_max, temperatura_noche_min,
            temporada_recomendada, experiencia_requerida,
            conocimientos_tecnicos_requeridos, punto_encuentro, comodidades, briefing_info,
            modalidad, cupos_maximos, ratio_guia_pasajero,
            alimentacion_detalle, servicios_incluidos, servicios_no_incluidos,
            servicios_adicionales_disponibles, diferenciadores, destacado, activo,
            url_foto, urls_fotos, fecha_creacion, fecha_actualizacion
        )
        VALUES (
            'Volcán Tuzgle', v_id_lugar, v_id_actividad, v_id_dificultad,
            5, 5, 5530,
            'El ascenso al volcán Tuzgle es una expedición de alta montaña en plena Puna de Atacama, ideal para quienes buscan desafiar sus límites en altitud y explorar paisajes de belleza extrema.',
            'Un ascenso inolvidable: naturaleza, altura y experiencia en el imponente Tuzgle',
            'Ubicado en la provincia de Salta, el volcán Tuzgle es un estratovolcán inactivo que se alza imponente en el altiplano andino. Su entorno ofrece vistas panorámicas de los salares y formaciones geológicas milenarias, con un paisaje de contrastes entre la aridez del desierto de altura y la diversidad de suelos volcánicos.',
            'La mejor época para realizar el ascenso al volcán Tuzgle es de mayo a octubre, cuando el clima es más seco y las condiciones de estabilidad atmosférica favorecen la aclimatación y el ascenso.',
            -10, 18, -15,
            ARRAY['mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre'],
            'Recomendada para personas con experiencia previa en trekking de altura y buen estado físico',
            false,
            'San Antonio de los Cobres a las 15:00 h',
            'Alojamiento 3 noches en hostería y 2 noches en carpas de alta montaña. Las hosterías cuentan con servicios básicos adaptados a la altura.',
            'Cada día realizaremos una reunión para revisar el plan de ascenso, organizar el equipo y brindar recomendaciones sobre aclimatación, técnicas de marcha y gestión del esfuerzo en altura.',
            'grupo reducido',
            4,
            '1-2',
            '{"desayunos": "Huevos, palta, panificaciones", "raciones_marcha": "Empanadas, sándwiches con fiambres, huevo, fruta", "cenas": "Platos regionales en San Antonio de los Cobres; opciones ligeras y altamente nutritivas en campamentos de altura"}',
            ARRAY['Guías profesionales de montaña', 'Grupos reducidos ratio 1-2 (1 guía cada 2 pasajeros)', 'Pensión completa en montaña', 'Alojamiento 3 noches en Hostería y 2 noches en carpas de alta montaña', 'Transporte local en San Antonio de los Cobres', 'Registro audiovisual del ascenso', 'Seguro contra accidentes personales', 'Botiquín grupal de primeros auxilios', 'Comunicación VHF', 'Listado de elementos para el viaje', 'Asesoramiento individual previo (vía WhatsApp)'],
            ARRAY['Indumentaria personal', 'Equipo de montaña personal', 'Bebidas', 'Snacks de marcha', 'Transporte hasta San Antonio de los Cobres'],
            ARRAY['Traslados entre Salta y San Antonio de los Cobres', 'Día extra para aclimatación o cuestiones climáticas', 'Combina con otras actividades: Ascenso al Volcán Quewar 6130 msnm'],
            ARRAY['Enfoque educativo: autonomía en la montaña', 'Grupos reducidos', 'Ritmo ajustado y conexión con la montaña', 'Compromiso con el medio ambiente'],
            true,
            '/tuzgle/1.jpg',
            ARRAY['/tuzgle/1.jpg', '/tuzgle/2.jpg', '/tuzgle/3.jpg'],
            '2025-01-01'::timestamp,
            '2025-01-01'::timestamp
        )
        RETURNING id_servicio INTO v_id_servicio;
    ELSE
        UPDATE servicios SET
            id_lugar = v_id_lugar, id_actividad = v_id_actividad, id_dificultad = v_id_dificultad,
            duracion_dias = 5, duracion_noches = 5, altura_maxima = 5530,
            descripcion_completa = 'El ascenso al volcán Tuzgle es una expedición de alta montaña en plena Puna de Atacama, ideal para quienes buscan desafiar sus límites en altitud y explorar paisajes de belleza extrema.',
            desc_resumen = 'Un ascenso inolvidable: naturaleza, altura y experiencia en el imponente Tuzgle',
            sobre_lugar = 'Ubicado en la provincia de Salta, el volcán Tuzgle es un estratovolcán inactivo que se alza imponente en el altiplano andino. Su entorno ofrece vistas panorámicas de los salares y formaciones geológicas milenarias, con un paisaje de contrastes entre la aridez del desierto de altura y la diversidad de suelos volcánicos.',
            clima_recomendado = 'La mejor época para realizar el ascenso al volcán Tuzgle es de mayo a octubre, cuando el clima es más seco y las condiciones de estabilidad atmosférica favorecen la aclimatación y el ascenso.',
            temperatura_dia_min = -10, temperatura_dia_max = 18, temperatura_noche_min = -15,
            temporada_recomendada = ARRAY['mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre'],
            experiencia_requerida = 'Recomendada para personas con experiencia previa en trekking de altura y buen estado físico',
            punto_encuentro = 'San Antonio de los Cobres a las 15:00 h',
            comodidades = 'Alojamiento 3 noches en hostería y 2 noches en carpas de alta montaña. Las hosterías cuentan con servicios básicos adaptados a la altura.',
            briefing_info = 'Cada día realizaremos una reunión para revisar el plan de ascenso, organizar el equipo y brindar recomendaciones sobre aclimatación, técnicas de marcha y gestión del esfuerzo en altura.',
            modalidad = 'grupo reducido', cupos_maximos = 4, ratio_guia_pasajero = '1-2',
            destacado = true,
            url_foto = '/tuzgle/1.jpg', urls_fotos = ARRAY['/tuzgle/1.jpg', '/tuzgle/2.jpg', '/tuzgle/3.jpg'],
            fecha_actualizacion = NOW()
        WHERE id_servicio = v_id_servicio;
        DELETE FROM itinerarios WHERE id_servicio = v_id_servicio;
    END IF;

    -- Insertar itinerarios de Tuzgle
    IF v_id_servicio IS NOT NULL THEN
        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, hora_inicio, altitud, alojamiento, comidas, actividades_especiales)
        VALUES (v_id_servicio, 1, 5, 'Encuentro en San Antonio de los Cobres', 'Encuentro en San Antonio de los Cobres a las 15:00 h. Bienvenida, briefing, revisión de equipo y tiempo libre para recorrer el lugar. Cena y pernocte en hostería (según disponibilidad).', '15:00', 3760, 'hostería', ARRAY['cena', 'pernocte'], ARRAY['Briefing', 'Revisión de equipo', 'Tiempo libre para recorrer el lugar', 'Cultura andina']);

        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, altitud, alojamiento, comidas, actividades_especiales)
        VALUES (v_id_servicio, 2, 5, 'Trekking de aclimatación', 'Trekking de aclimatación al mirador del Cerro Terciopelo y ascenso al Cerro Pompeya (4.050 m). Día fundamental para la adaptación progresiva a la altitud.', 4050, 'hostería', ARRAY['cena', 'pernocte'], ARRAY['Aclimatación', 'Mirador Cerro Terciopelo', 'Ascenso Cerro Pompeya', 'Vista panorámica de salares']);

        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, altitud, alojamiento, comidas, actividades_especiales)
        VALUES (v_id_servicio, 3, 5, 'Traslado a base del volcán Tuzgle', 'Traslado en vehículos 4x4 hasta la base del volcán Tuzgle (4.500 m). Ingreso al entorno del estratovolcán inactivo con vistas de los paisajes de contrastes entre la aridez del desierto de altura y la diversidad de suelos volcánicos. Armado de campamento y pernocte en tiendas de montaña.', 4500, 'campamento base', ARRAY['pernocte'], ARRAY['Traslado en vehículos 4x4', 'Armado de campamento', 'Estratovolcán inactivo', 'Paisajes volcánicos']);

        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, altitud, alojamiento, comidas, actividades_especiales)
        VALUES (v_id_servicio, 4, 5, 'Descanso y aclimatación en campamento base', 'Día de descanso y aclimatación en el campamento base (4.500 m). Momento clave para adaptarse al ambiente de altura extrema y condiciones de la Puna de Atacama.', 4500, 'campamento base', ARRAY['pernocte'], ARRAY['Aclimatación', 'Adaptación altura extrema', 'Opción C1 o termas según clima', 'Puna de Atacama']);

        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, altitud, alojamiento, comidas, intensidad, actividades_especiales)
        VALUES (v_id_servicio, 5, 5, 'Ascenso a la cumbre del volcán Tuzgle', 'Intento de cumbre: ascenso al volcán Tuzgle (5.530 m), punto más alto de la expedición. Jornada larga y exigente en condiciones de altura extrema, con temperaturas que pueden descender hasta -15°C.', 5530, 'hostería', ARRAY['cena de despedida', 'pernocte'], 'muy exigente', ARRAY['Cumbre', 'Volcán Tuzgle', 'Vista altiplano andino', 'Descenso', 'Fin del programa', 'Cena de despedida']);

        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, actividades_especiales)
        VALUES (v_id_servicio, 6, 5, 'Regreso a Salta', 'Traslado de regreso a la ciudad de Salta. Finalización de la expedición al volcán Tuzgle en la Puna de Atacama.', ARRAY['Traslado de regreso', 'Finalización expedición']);
    END IF;

    -- ============================================
    -- SERVICIO 6: ACONCAGUA
    -- ============================================
    
    -- Obtener o crear ubicación (Mendoza - Parque Provincial Aconcagua)
    SELECT id_ubicacion INTO v_id_ubicacion
    FROM ubicaciones
    WHERE pais = 'Argentina' AND provincia = 'Mendoza' AND zona = 'Parque Provincial Aconcagua'
    LIMIT 1;
    
    IF v_id_ubicacion IS NULL THEN
        INSERT INTO ubicaciones (pais, provincia, zona)
        VALUES ('Argentina', 'Mendoza', 'Parque Provincial Aconcagua')
        RETURNING id_ubicacion INTO v_id_ubicacion;
    END IF;

    -- Obtener o crear lugar (Cerro Aconcagua)
    SELECT id_lugar INTO v_id_lugar
    FROM lugares
    WHERE nombre = 'Cerro Aconcagua'
    LIMIT 1;
    
    IF v_id_lugar IS NULL THEN
        INSERT INTO lugares (nombre, tipo_lugar, altitud, descripcion, id_ubicacion)
        VALUES (
            'Cerro Aconcagua',
            'Montaña',
            6969,
            'Ubicado dentro del Parque Provincial Aconcagua, en la provincia de Mendoza (Argentina), este coloso se alza en el corazón de los Andes. Sus paisajes, la magnitud de sus glaciares y su entorno agreste lo convierten en un destino de ensueño para los amantes de la alta montaña.',
            v_id_ubicacion
        )
        RETURNING id_lugar INTO v_id_lugar;
    END IF;

    -- Obtener dificultad (Exigente)
    SELECT id_dificultad INTO v_id_dificultad
    FROM dificultades
    WHERE nivel = 'Exigente'
    LIMIT 1;
    
    IF v_id_dificultad IS NULL THEN
        INSERT INTO dificultades (nivel, descripcion)
        VALUES ('Exigente', 'Dificultad exigente')
        RETURNING id_dificultad INTO v_id_dificultad;
    END IF;

    -- Verificar si el servicio Aconcagua ya existe
    SELECT id_servicio INTO v_id_servicio
    FROM servicios
    WHERE nombre = 'Aconcagua'
    LIMIT 1;
    
    IF v_id_servicio IS NULL THEN
        INSERT INTO servicios (
            nombre, id_lugar, id_actividad, id_dificultad,
            duracion_dias, duracion_noches, altura_maxima,
            descripcion_completa, desc_resumen, sobre_lugar, clima_recomendado,
            temperatura_dia_min, temperatura_dia_max, temperatura_noche_min,
            temporada_recomendada, experiencia_requerida,
            conocimientos_tecnicos_requeridos, punto_encuentro, briefing_info,
            consideraciones_especiales, modalidad, cupos_maximos, ratio_guia_pasajero,
            alimentacion_detalle, servicios_incluidos, servicios_no_incluidos,
            diferenciadores, gestion_cargas, activo,
            url_foto, urls_fotos, fecha_creacion, fecha_actualizacion
        )
        VALUES (
            'Aconcagua', v_id_lugar, v_id_actividad, v_id_dificultad,
            15, 14, 6969,
            'El Aconcagua es el cerro más alto de América y uno de los seismiles más icónicos del mundo. Su ascenso por la ruta normal no presenta dificultades técnicas, pero es un verdadero desafío físico y mental por la altitud, el clima extremo y la duración de la expedición.',
            'Viví la cumbre más alta del continente: experiencia, altura y montañismo en el Aconcagua.',
            'Ubicado dentro del Parque Provincial Aconcagua, en la provincia de Mendoza (Argentina), este coloso se alza en el corazón de los Andes.',
            'La temporada de ascensos se extiende de diciembre a marzo. En esos meses, aunque es el periodo más estable, el clima puede ser extremadamente riguroso, con vientos fuertes, nevadas y temperaturas que descienden por debajo de los -20°C en altura.',
            -30, 15, -20,
            ARRAY['diciembre', 'enero', 'febrero', 'marzo'],
            'Expedición de dificultad exigente, diseñada para montañistas con experiencia previa en altura. Requiere excelente estado físico, resistencia mental y preparación técnica para enfrentar condiciones extremas de altitud, clima y duración prolongada.',
            false,
            'Mendoza (760 msnm)',
            'Antes de la expedición realizaremos un encuentro en Mendoza, donde revisaremos el equipo personal, ajustaremos los últimos detalles logísticos y gestionaremos los permisos de ascenso.',
            ARRAY['Incluye 2 días extra para contingencias climáticas y aclimatación', 'Requiere seguro de evacuación obligatorio', 'Gestión especializada de cargas con sistema de mulas', 'Servicios gastronómicos de INKA Expediciones en campamentos base'],
            'grupo reducido',
            4,
            '1-2',
            '{"desayunos": "Huevos, palta, panificaciones, cereales y bebidas calientes", "raciones_marcha": "Empanadas, sándwiches con fiambres, huevo duro, fáciles de transportar", "cenas": "Comidas ligeras, fáciles de digerir y con alto valor nutritivo para favorecer la recuperación y la aclimatación"}',
            ARRAY['Guías profesionales de montaña', 'Grupos reducidos ratio 1-2 (1 guía cada 2 pasajeros)', 'Pensión completa', 'Alojamiento 3 noches en Hostal: 1 noche en Ciudad de Mendoza previa al encuentro, 1 noche en Puquios/Puente del Inca, 1 noche en Ciudad de Mendoza al finalizar', 'Alojamiento 12-14 noches en tiendas de alta montaña en Parque Provincial Aconcagua', 'Transporte local en Mendoza', '35kg de equipaje en mulas', 'Porteo a campamentos de altura según descripción', 'Registro audiovisual del ascenso', 'Seguro contra accidentes personales', 'Botiquín grupal de primeros auxiliios', 'Comunicación VHF y satelital', 'Listado de elementos para el viaje y asesoramiento individual previo (vía WhatsApp)', 'Ticket de ingreso a Parques'],
            ARRAY['Porteos extra', 'Indumentaria personal', 'Equipo de montaña personal', 'Bebidas personales', 'Snacks de marcha', 'Transporte desde ciudad de origen a Mendoza', 'Seguro de evacuación (obligatorio)'],
            ARRAY['Enfoque educativo: autonomía en la montaña', 'Grupos reducidos', 'Ritmo ajustado y conexión con la montaña', 'Compromiso con el medio ambiente'],
            ARRAY['Puquios → Confluencia: hasta 10 kg por participante', 'Confluencia → Plaza de Mulas: hasta 10 kg por participante', 'Puquios → Plaza de Mulas (directo): hasta 25 kg por participante', 'Descenso Plaza de Mulas → Puquios: hasta 35 kg por participante', 'Plaza de Mulas → Nido de Cóndores: 10 kg por participante', 'Nido de Cóndores → Cólera: 10 kg por participante', 'Cólera → Plaza de Mulas (descenso): 10 kg por participante'],
            true,
            '/aconcagua/2.jpg',
            ARRAY['/aconcagua/2.jpg', '/aconcagua/1.jpg', '/aconcagua/3.jpg'],
            '2025-01-01'::timestamp,
            '2025-01-01'::timestamp
        )
        RETURNING id_servicio INTO v_id_servicio;
    ELSE
        UPDATE servicios SET
            id_lugar = v_id_lugar, id_actividad = v_id_actividad, id_dificultad = v_id_dificultad,
            duracion_dias = 15, duracion_noches = 14, altura_maxima = 6969,
            descripcion_completa = 'El Aconcagua es el cerro más alto de América y uno de los seismiles más icónicos del mundo.',
            desc_resumen = 'Viví la cumbre más alta del continente: experiencia, altura y montañismo en el Aconcagua.',
            sobre_lugar = 'Ubicado dentro del Parque Provincial Aconcagua, en la provincia de Mendoza (Argentina), este coloso se alza en el corazón de los Andes.',
            clima_recomendado = 'La temporada de ascensos se extiende de diciembre a marzo.',
            temperatura_dia_min = -30, temperatura_dia_max = 15, temperatura_noche_min = -20,
            temporada_recomendada = ARRAY['diciembre', 'enero', 'febrero', 'marzo'],
            experiencia_requerida = 'Expedición de dificultad exigente, diseñada para montañistas con experiencia previa en altura.',
            punto_encuentro = 'Mendoza (760 msnm)',
            briefing_info = 'Antes de la expedición realizaremos un encuentro en Mendoza, donde revisaremos el equipo personal, ajustaremos los últimos detalles logísticos y gestionaremos los permisos de ascenso.',
            consideraciones_especiales = ARRAY['Incluye 2 días extra para contingencias climáticas y aclimatación', 'Requiere seguro de evacuación obligatorio', 'Gestión especializada de cargas con sistema de mulas', 'Servicios gastronómicos de INKA Expediciones en campamentos base'],
            modalidad = 'grupo reducido', cupos_maximos = 4, ratio_guia_pasajero = '1-2',
            gestion_cargas = ARRAY['Puquios → Confluencia: hasta 10 kg por participante', 'Confluencia → Plaza de Mulas: hasta 10 kg por participante', 'Puquios → Plaza de Mulas (directo): hasta 25 kg por participante', 'Descenso Plaza de Mulas → Puquios: hasta 35 kg por participante', 'Plaza de Mulas → Nido de Cóndores: 10 kg por participante', 'Nido de Cóndores → Cólera: 10 kg por participante', 'Cólera → Plaza de Mulas (descenso): 10 kg por participante'],
            url_foto = '/aconcagua/2.jpg', urls_fotos = ARRAY['/aconcagua/2.jpg', '/aconcagua/1.jpg', '/aconcagua/3.jpg'],
            fecha_actualizacion = NOW()
        WHERE id_servicio = v_id_servicio;
        DELETE FROM itinerarios WHERE id_servicio = v_id_servicio;
    END IF;

    -- Insertar itinerarios de Aconcagua (15 días)
    IF v_id_servicio IS NOT NULL THEN
        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, altitud, alojamiento, actividades_especiales)
        VALUES (v_id_servicio, 1, 15, 'Encuentro en Mendoza', 'Encuentro en Mendoza (760 msnm). Revisión de equipo personal, asesoramiento final y acompañamiento al rental en caso de ser necesario. Traslado en vehículo privado hasta Puquios (2.800 msnm), donde funciona el centro logístico de INKA Expediciones para el despacho de equipo. Pernocte en hostel de montaña.', 2800, 'hostel de montaña', ARRAY['Revisión de equipo', 'Gestión de permisos', 'Centro logístico INKA']);

        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, altitud, alojamiento, comidas, actividades_especiales)
        VALUES (v_id_servicio, 2, 15, 'Ingreso al Parque Aconcagua', 'Ingreso al Parque Provincial Aconcagua por el sector de Horcones. Inicio del trekking de aproximación hacia Confluencia (3.390 msnm). Armado de campamento, cena y pernocte en carpas.', 3390, 'carpas', ARRAY['cena', 'pernocte'], ARRAY['Ingreso al Parque']);

        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, altitud, alojamiento, comidas, actividades_especiales)
        VALUES (v_id_servicio, 3, 15, 'Trekking de aclimatación', 'Trekking de aclimatación hasta el mirador de Plaza Francia (4.100 msnm), con vista a la imponente cara sur del Aconcagua. Retorno al campamento en Confluencia. Noche en carpas.', 4100, 'carpas en Confluencia', ARRAY['noche en carpas'], ARRAY['Aclimatación', 'Mirador Plaza Francia', 'Vista cara sur Aconcagua']);

        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, altitud, alojamiento, comidas, intensidad, actividades_especiales)
        VALUES (v_id_servicio, 4, 15, 'Ascenso a Plaza de Mulas', 'Trekking de aproximación hasta Plaza de Mulas (4.350 msnm), el campamento base más grande de Sudamérica. Instalación del campamento, cena y pernocte en carpas.', 4350, 'carpas', ARRAY['cena', 'pernocte'], 'muy exigente', ARRAY['Campamento base más grande de Sudamérica']);

        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, altitud, alojamiento, actividades_especiales)
        VALUES (v_id_servicio, 5, 15, 'Día de descanso en Plaza de Mulas', 'Día de descanso en Plaza de Mulas. Tiempo para hidratación, recuperación y adaptación progresiva a la altitud. Breves caminatas por la zona.', 4350, 'carpas', ARRAY['Descanso', 'Aclimatación', 'Hidratación']);

        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, altitud, alojamiento, comidas, intensidad, actividades_especiales)
        VALUES (v_id_servicio, 6, 15, 'Porteo al Campo 2', 'Jornada de porteo de equipo al Campo 2 - Nido de Cóndores (5.550 msnm). Descenso al final del día nuevamente a Plaza de Mulas. Noche en carpas.', 5550, 'carpas en Plaza de Mulas', ARRAY['noche en carpas'], 'muy exigente', ARRAY['Porteo', 'Nido de Cóndores']);

        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, altitud, alojamiento, actividades_especiales)
        VALUES (v_id_servicio, 7, 15, 'Día de descanso', 'Día de descanso en Plaza de Mulas, para favorecer la aclimatación y recuperación antes de continuar el ascenso.', 4350, 'carpas', ARRAY['Descanso', 'Recuperación', 'Aclimatación']);

        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, altitud, alojamiento, comidas)
        VALUES (v_id_servicio, 8, 15, 'Ascenso al Campo 2', 'Ascenso al Campo 2 - Nido de Cóndores (5.550 msnm). Instalación del campamento, cena y pernocte en carpas de altura.', 5550, 'carpas de altura', ARRAY['cena', 'pernocte']);

        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, altitud, alojamiento, actividades_especiales)
        VALUES (v_id_servicio, 9, 15, 'Descanso en Nido de Cóndores', 'Día de descanso en Nido de Cóndores. Momento clave para adaptarse mejor al ambiente de altura extrema.', 5550, 'carpas de altura', ARRAY['Adaptación altura extrema']);

        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, altitud, alojamiento, actividades_especiales)
        VALUES (v_id_servicio, 10, 15, 'Ascenso al Campo 3', 'Ascenso al Campo 3 - Cólera (5.970 msnm), último campamento de altura antes del intento de cumbre. Instalación de campamento y pernocte.', 5970, 'campamento', ARRAY['Último campamento antes de cumbre']);

        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, altitud, alojamiento, intensidad, actividades_especiales)
        VALUES (v_id_servicio, 11, 15, 'Intento de cumbre', 'Intento de cumbre: ascenso al Aconcagua (6.960 msnm). Jornada larga y exigente. Regreso al Campo 3 para pernoctar.', 6969, 'Campo 3', 'muy exigente', ARRAY['Cumbre Aconcagua', 'Cerro más alto de América']);

        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, altitud, alojamiento)
        VALUES (v_id_servicio, 12, 15, 'Descenso a Plaza de Mulas', 'Descenso hasta Plaza de Mulas (4.350 msnm). Pernocte en campamento base.', 4350, 'campamento base');

        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, altitud, comidas)
        VALUES (v_id_servicio, 13, 15, 'Descenso final', 'Descenso final hacia Puquios (2.800 msnm), donde finalizamos la expedición en el centro logístico. Traslado en vehículo a Mendoza (opcional según logística y horario).', 2800, ARRAY['traslado a Mendoza']);

        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, actividades_especiales)
        VALUES (v_id_servicio, 14, 15, 'Día extra 1', 'El programa contempla 2 días extra que podrán ser utilizados en cualquier punto estratégico del itinerario, generalmente en los campamentos de altura, para absorber eventuales retrasos por cuestiones climáticas o para mejorar la aclimatación del equipo.', ARRAY['Día de contingencia', 'Flexibilidad climática']);

        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, actividades_especiales)
        VALUES (v_id_servicio, 15, 15, 'Día extra 2', 'Estos días son clave para optimizar las chances de éxito y garantizar la seguridad de todos los integrantes.', ARRAY['Día de contingencia', 'Optimización de éxito']);
    END IF;

    -- ============================================
    -- SERVICIO 7: QUEWAR (DESTACADO)
    -- ============================================
    
    -- Obtener o crear ubicación (Salta - Puna de Atacama) - ya existe de Tuzgle
    
    -- Obtener o crear lugar (Volcán Quewar)
    SELECT id_lugar INTO v_id_lugar
    FROM lugares
    WHERE nombre = 'Volcán Quewar'
    LIMIT 1;
    
    IF v_id_lugar IS NULL THEN
        INSERT INTO lugares (nombre, tipo_lugar, altitud, descripcion, id_ubicacion)
        VALUES (
            'Volcán Quewar',
            'Volcán',
            6140,
            'El Volcán Quewar se ubica en el sector sur de la Puna salteña, dentro de un entorno de salares, lagunas altoandinas y pequeños poblados que resguardan una rica historia vinculada a las culturas originarias.',
            v_id_ubicacion
        )
        RETURNING id_lugar INTO v_id_lugar;
    END IF;

    -- Obtener dificultad (Exigente) - ya existe de Aconcagua
    
    -- Verificar si el servicio Quewar ya existe
    SELECT id_servicio INTO v_id_servicio
    FROM servicios
    WHERE nombre = 'Volcán Quewar'
    LIMIT 1;
    
    IF v_id_servicio IS NULL THEN
        INSERT INTO servicios (
            nombre, id_lugar, id_actividad, id_dificultad,
            duracion_dias, duracion_noches, altura_maxima,
            descripcion_completa, desc_resumen, sobre_lugar, clima_recomendado,
            temperatura_dia_min, temperatura_dia_max, temperatura_noche_min,
            temporada_recomendada, experiencia_requerida,
            conocimientos_tecnicos_requeridos, punto_encuentro, comodidades, briefing_info,
            modalidad, cupos_maximos, ratio_guia_pasajero,
            alimentacion_detalle, servicios_incluidos, servicios_no_incluidos,
            servicios_adicionales_disponibles, diferenciadores, destacado, activo,
            url_foto, urls_fotos, fecha_creacion, fecha_actualizacion
        )
        VALUES (
            'Volcán Quewar', v_id_lugar, v_id_actividad, v_id_dificultad,
            10, 10, 6140,
            'El ascenso al Volcán Quewar es una expedición de alta montaña en plena Puna de Atacama, ideal para montañistas con experiencia previa que deseen desafiar sus límites en altitud y vivir la inmensidad de un paisaje remoto y sobrecogedor.',
            'Alta montaña y desafío extremo en la inmensidad del Volcán Quewar.',
            'El Volcán Quewar se ubica en el sector sur de la Puna salteña, dentro de un entorno de salares, lagunas altoandinas y pequeños poblados que resguardan una rica historia vinculada a las culturas originarias.',
            'La mejor época para realizar el ascenso al volcán es de abril a noviembre, cuando el clima es más seco y las condiciones de estabilidad atmosférica favorecen la aclimatación y el ascenso.',
            -5, 15, -15,
            ARRAY['abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre'],
            'Recomendada para personas con experiencia previa en montañas de altura por encima de los 4500msnm y buen estado físico',
            false,
            'Encuentro en la ciudad de Salta a las 9:00 h',
            'Alojamiento 4 noches en hostería y 6 noches en carpas de alta montaña. Las hosterías en San Antonio de los Cobres cuentan con servicios básicos adaptados a la altura.',
            'Cada día realizaremos una reunión para revisar el plan de ascenso, organizar el equipo y brindar recomendaciones sobre aclimatación, técnicas de marcha y gestión del esfuerzo en altura.',
            'grupo reducido',
            4,
            '1-2',
            '{"desayunos": "Huevos, palta, panificaciones", "raciones_marcha": "Empanadas, sándwiches con fiambres, huevo, fruta", "cenas": "Platos regionales en San Antonio de los Cobres; opciones ligeras y altamente nutritivas en campamentos de altura"}',
            ARRAY['Guías profesionales de montaña', 'Grupos reducidos ratio 1-2 (1 guía cada 2 pasajeros)', 'Pensión completa', 'Alojamiento 4 noches en Hostería y 6 noches en carpas de alta montaña', 'Transporte local en Salta', 'Traslado de cargas CB-C1 (subida y bajada)', 'Registro audiovisual del ascenso', 'Seguro contra accidentes personales', 'Botiquín grupal de primeros auxilios', 'Comunicación VHF y satelital', 'Listado de elementos para el viaje', 'Asesoramiento individual previo (vía WhatsApp)'],
            ARRAY['Porteo de C1-C2', 'Indumentaria personal', 'Equipo de montaña personal', 'Bebidas personales', 'Snacks de marcha', 'Transporte desde ciudad de origen a Salta'],
            ARRAY['Día extra para aclimatación o cuestiones climáticas', 'Combina con otras actividades: Ascenso al Volcán Tuzgle 5530 msnm'],
            ARRAY['Enfoque educativo: autonomía en la montaña', 'Grupos reducidos', 'Ritmo ajustado y conexión con la montaña', 'Compromiso con el medio ambiente'],
            true,
            '/quewar/quewar-1.jpg',
            ARRAY['/quewar/quewar-1.jpg', '/quewar/quewar-2.jpg', '/quewar/quewar-3.jpg'],
            '2025-01-01'::timestamp,
            '2025-01-01'::timestamp
        )
        RETURNING id_servicio INTO v_id_servicio;
    ELSE
        UPDATE servicios SET
            id_lugar = v_id_lugar, id_actividad = v_id_actividad, id_dificultad = v_id_dificultad,
            duracion_dias = 10, duracion_noches = 10, altura_maxima = 6140,
            descripcion_completa = 'El ascenso al Volcán Quewar es una expedición de alta montaña en plena Puna de Atacama, ideal para montañistas con experiencia previa que deseen desafiar sus límites en altitud y vivir la inmensidad de un paisaje remoto y sobrecogedor.',
            desc_resumen = 'Alta montaña y desafío extremo en la inmensidad del Volcán Quewar.',
            sobre_lugar = 'El Volcán Quewar se ubica en el sector sur de la Puna salteña, dentro de un entorno de salares, lagunas altoandinas y pequeños poblados que resguardan una rica historia vinculada a las culturas originarias.',
            clima_recomendado = 'La mejor época para realizar el ascenso al volcán es de abril a noviembre, cuando el clima es más seco y las condiciones de estabilidad atmosférica favorecen la aclimatación y el ascenso.',
            temperatura_dia_min = -5, temperatura_dia_max = 15, temperatura_noche_min = -15,
            temporada_recomendada = ARRAY['abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre'],
            experiencia_requerida = 'Recomendada para personas con experiencia previa en montañas de altura por encima de los 4500msnm y buen estado físico',
            punto_encuentro = 'Encuentro en la ciudad de Salta a las 9:00 h',
            comodidades = 'Alojamiento 4 noches en hostería y 6 noches en carpas de alta montaña. Las hosterías en San Antonio de los Cobres cuentan con servicios básicos adaptados a la altura.',
            briefing_info = 'Cada día realizaremos una reunión para revisar el plan de ascenso, organizar el equipo y brindar recomendaciones sobre aclimatación, técnicas de marcha y gestión del esfuerzo en altura.',
            modalidad = 'grupo reducido', cupos_maximos = 4, ratio_guia_pasajero = '1-2',
            destacado = true,
            url_foto = '/quewar/quewar-1.jpg', urls_fotos = ARRAY['/quewar/quewar-1.jpg', '/quewar/quewar-2.jpg', '/quewar/quewar-3.jpg'],
            fecha_actualizacion = NOW()
        WHERE id_servicio = v_id_servicio;
        DELETE FROM itinerarios WHERE id_servicio = v_id_servicio;
    END IF;

    -- Insertar itinerarios de Quewar (11 días)
    IF v_id_servicio IS NOT NULL THEN
        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, hora_inicio, altitud, alojamiento, comidas, actividades_especiales)
        VALUES (v_id_servicio, 1, 10, 'Encuentro en Salta', 'Encuentro en la ciudad de Salta a las 9:00 h. Bienvenida, briefing general, revisión de equipo. Traslado en vehículo privado a San Antonio de los Cobres (3.775 m), tarde libre para recorrer el lugar. Cena regional y pernocte en hostería en San Antonio de los Cobres (SAC).', '09:00', 3775, 'hostería', ARRAY['cena regional', 'pernocte'], ARRAY['Briefing general', 'Revisión de equipo', 'Traslado privado', 'Tarde libre']);

        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, duracion_horas, altitud, alojamiento, comidas, actividades_especiales)
        VALUES (v_id_servicio, 2, 10, 'Trekking de aclimatación al Cerro Pompeya', 'Trekking de aclimatación al Cerro Pompeya (4.050 m). Primera jornada de adaptación a la altitud en la Puna de Atacama. Regreso, cena regional y pernocte en hostería en SAC.', '4hs', 4050, 'hostería', ARRAY['cena regional', 'pernocte'], ARRAY['Aclimatación', 'Cerro Pompeya', 'Adaptación Puna de Atacama']);

        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, duracion_horas, distancia_km, desnivel_metros, altitud, alojamiento, comidas, intensidad, actividades_especiales)
        VALUES (v_id_servicio, 3, 10, 'Trekking de aclimatación al Cerro Negro', 'Trekking de aclimatación al Cerro Negro (5.050 m). Jornada clave de aclimatación a los 5.000 metros, preparando el cuerpo para las altitudes extremas del Quewar.', '6-8hs', 10, 1100, 5050, 'hostería', ARRAY['cena', 'pernocte'], 'moderada-exigente', ARRAY['Aclimatación 5000m', 'Cerro Negro', 'Preparación para altura extrema']);

        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, altitud, alojamiento, comidas, actividades_especiales)
        VALUES (v_id_servicio, 4, 10, 'Traslado a Santa Rosa de los Pastos Grandes', 'Traslado en vehículo a Santa Rosa de los Pastos Grandes (4.000 m), punto de partida hacia el Volcán Quewar. Armado de campamento base en entorno de salares y lagunas altoandinas.', 4000, 'campamento base', ARRAY['pernocte'], ARRAY['Traslado en vehículo', 'Armado campamento base', 'Entorno de salares', 'Últimas preparaciones']);

        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, duracion_horas, distancia_km, desnivel_metros, altitud, alojamiento, comidas, intensidad, actividades_especiales)
        VALUES (v_id_servicio, 5, 10, 'Trekking al Campo 1', 'Trekking hasta el Campo 1 (4.830 m). Primera jornada de aproximación al gigante Quewar, adentrándose en el paisaje remoto y sobrecogedor del volcán.', '6-8hs', 12, 830, 4830, 'campamento', ARRAY['pernocte'], 'moderada-exigente', ARRAY['Aproximación al Quewar', 'Paisaje remoto', 'Primer campamento de altura']);

        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, duracion_horas, distancia_km, desnivel_metros, altitud, alojamiento, comidas, intensidad, actividades_especiales)
        VALUES (v_id_servicio, 6, 10, 'Porteo de equipo al Campo 2', 'Porteo de equipo al Campo 2 (5.350 m). Jornada intensa de carga de equipamiento hacia mayor altitud, estrategia clave para la aclimatación. Retorno al Campo 1.', '6-8hs', 8, 520, 5350, 'Campo 1', ARRAY['pernocte'], 'exigente', ARRAY['Porteo', 'Estrategia de aclimatación', 'Retorno al C1']);

        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, altitud, alojamiento, comidas, actividades_especiales)
        VALUES (v_id_servicio, 7, 10, 'Día de descanso y recuperación', 'Día de descanso y recuperación en Campo 1. Momento fundamental para que el organismo se adapte a la altura extrema y recupere energías antes de continuar el ascenso hacia el Quewar.', 4830, 'Campo 1', ARRAY['pernocte'], ARRAY['Descanso', 'Recuperación', 'Adaptación altura extrema']);

        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, duracion_horas, distancia_km, desnivel_metros, altitud, alojamiento, comidas, actividades_especiales)
        VALUES (v_id_servicio, 8, 10, 'Ascenso al Campo 2', 'Ascenso al Campo 2 (5.350 m). Instalación de campamento en altura extrema, último punto antes del intento de cumbre. Vista panorámica de la inmensidad de la Puna.', '4hs', 4, 520, 5350, 'campamento', ARRAY['pernocte'], ARRAY['Campamento altura extrema', 'Vista panorámica Puna', 'Último punto antes cumbre']);

        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, duracion_horas, distancia_km, desnivel_metros, altitud, alojamiento, comidas, intensidad, actividades_especiales)
        VALUES (v_id_servicio, 9, 10, 'Intento de cumbre del Volcán Quewar', 'Intento de cumbre del Volcán Quewar (6.140 m). Jornada culminante y más exigente de la expedición. Ascenso al gigante solitario que domina la Puna de Atacama.', '10-12hs', 6, 790, 6140, 'Campo 2', ARRAY['pernocte'], 'muy exigente', ARRAY['Cumbre', 'Volcán Quewar', 'Gigante solitario', 'Experiencia transformadora', 'Aislamiento absoluto']);

        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, duracion_horas, distancia_km, desnivel_metros, altitud, alojamiento, comidas, actividades_especiales)
        VALUES (v_id_servicio, 10, 10, 'Descenso a Santa Rosa y traslado', 'Descenso hasta Santa Rosa de los Pastos Grandes. Jornada larga de descenso atravesando todos los ambientes de la expedición. Traslado a San Antonio de los Cobres. Cena de despedida y pernocte en hostería.', '6hs', 16, 1350, 3775, 'hostería', ARRAY['cena de despedida', 'pernocte'], ARRAY['Descenso completo', 'Travesía ambientes', 'Cena de despedida']);

        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, actividades_especiales)
        VALUES (v_id_servicio, 11, 10, 'Regreso a Salta', 'Regreso a la ciudad de Salta. Fin del programa de expedición al Volcán Quewar en la Puna de Atacama.', ARRAY['Traslado de regreso', 'Fin del programa', 'Finalización expedición Quewar']);
    END IF;

    -- ============================================
    -- SERVICIO 8: FRANKE
    -- ============================================
    
    -- Obtener o crear ubicación (Mendoza - Cordillera Frontal) - ya existe
    
    -- Obtener o crear lugar (Cerro Franke)
    SELECT id_lugar INTO v_id_lugar
    FROM lugares
    WHERE nombre = 'Cerro Franke'
    LIMIT 1;
    
    IF v_id_lugar IS NULL THEN
        INSERT INTO lugares (nombre, tipo_lugar, altitud, descripcion, id_ubicacion)
        VALUES (
            'Cerro Franke',
            'Montaña',
            4820,
            'Ubicado en la Cordillera Frontal de Mendoza, el Cerro Franke es un destino clásico para quienes buscan un ascenso exigente. Su entorno de altura ofrece imponentes paisajes, campamentos estratégicamente ubicados y una gran oportunidad para el aprendizaje en montañismo.',
            v_id_ubicacion
        )
        RETURNING id_lugar INTO v_id_lugar;
    END IF;

    -- Obtener dificultad (Media-Alta) - ya existe de Vallecitos
    
    -- Verificar si el servicio Franke ya existe
    SELECT id_servicio INTO v_id_servicio
    FROM servicios
    WHERE nombre = 'Cerro Franke'
    LIMIT 1;
    
    IF v_id_servicio IS NULL THEN
        INSERT INTO servicios (
            nombre, id_lugar, id_actividad, id_dificultad,
            duracion_dias, duracion_noches, altura_maxima, desnivel,
            descripcion_completa, desc_resumen, sobre_lugar, clima_recomendado,
            descripcion_recorrido, experiencia_requerida, horas_caminata_diarias, peso_mochila,
            temperatura_dia_min, temperatura_dia_max, temperatura_noche_min,
            temporada_recomendada, conocimientos_tecnicos_requeridos, punto_encuentro,
            comodidades, briefing_info, modalidad, cupos_maximos, ratio_guia_pasajero,
            alimentacion_detalle, servicios_incluidos, servicios_no_incluidos,
            servicios_adicionales_disponibles, diferenciadores, consideraciones_especiales,
            activo, url_foto, urls_fotos, fecha_creacion, fecha_actualizacion
        )
        VALUES (
            'Cerro Franke', v_id_lugar, v_id_actividad, v_id_dificultad,
            4, 3, 4820, 1420,
            'La expedición al Cerro Franke es una experiencia desafiante de alta montaña, ideal para quienes buscan fortalecer su resistencia y ganar experiencia en ascensos de gran altitud.',
            'Una experiencia desafiante de alta montaña: 4 días para alcanzar los 4.820 m del imponente Franke.',
            'Ubicado en la Cordillera Frontal de Mendoza, el Cerro Franke es un destino clásico para quienes buscan un ascenso exigente.',
            'La mejor temporada para ascender el Cerro Franke es de noviembre a marzo, cuando las condiciones meteorológicas son más predecibles.',
            'El ascenso se realiza por la ruta normal en el filo sureste, atravesando terrenos de alta montaña con desniveles exigentes.',
            'Esta expedición es de dificultad media-alta, recomendada para personas con experiencia en trekking de altura y buen estado físico.',
            '14-16 horas (día de cumbre)',
            'Equipo personal y comunitario',
            -5, 15, -15,
            ARRAY['noviembre', 'diciembre', 'enero', 'febrero', 'marzo'],
            false,
            'Mendoza a las 9:00 hs',
            '3 noches en tiendas de montaña de alta calidad especializadas para condiciones extremas.',
            'Cada día realizaremos una reunión para revisar el plan de ascenso, organizar el equipo y brindar recomendaciones sobre aclimatación, técnicas de marcha y gestión del esfuerzo en altura.',
            'grupo reducido',
            4,
            '1-2',
            '{"desayunos": "Huevos, palta, panificaciones", "raciones_marcha": "Empanadas, sándwiches con fiambres al vacío de calidad, huevo, fruta", "cenas": "Platos frescos y proteicos en campamentos bajos; opciones ligeras y altamente nutritivas en campamentos de altura"}',
            ARRAY['Traslados ida y vuelta Mendoza-Vallecitos', 'Guías profesionales de montaña', 'Grupos reducidos ratio 1-2 (1 guía cada 2 pasajeros)', 'Pensión completa en montaña', 'Alojamiento 3 noches en tiendas de montaña', 'Registro audiovisual del ascenso', 'Seguro contra accidentes personales', 'Botiquín grupal de primeros auxilios', 'Comunicación VHF', 'Listado de elementos para el viaje y asesoramiento individual previo (vía WhatsApp)', 'Transporte local en Mendoza'],
            ARRAY['Indumentaria personal', 'Equipo de montaña personal', 'Bebidas', 'Snacks de marcha personal', 'Transporte hasta Mendoza'],
            ARRAY['Porteo: Hasta 20k de equipo porteados en todos o algún tramo del ascenso', 'Almuerzo de despedida en bodega familiar, Potrerillos', 'Día extra: Adiciona un día para aclimatación o cuestiones climáticas', 'Combina con otras actividades: Termas, rafting, kayak, escalada/rapel, cabalgatas, bodegas'],
            ARRAY['Enfoque educativo: autonomía en la montaña', 'Grupos reducidos', 'Ritmo ajustado y conexión con la montaña', 'Compromiso con el medio ambiente'],
            ARRAY['Expedición de alta montaña con condiciones climáticas adversas', 'Jornada de cumbre muy exigente de 14-16 horas', 'Aclimatación previa recomendada', 'Experiencia en trekking de altura necesaria'],
            true,
            '/franke/1.jpg',
            ARRAY['/franke/1.jpg', '/franke/2.jpg', '/franke/3.jpg'],
            '2025-01-01'::timestamp,
            '2025-01-01'::timestamp
        )
        RETURNING id_servicio INTO v_id_servicio;
    ELSE
        UPDATE servicios SET
            id_lugar = v_id_lugar, id_actividad = v_id_actividad, id_dificultad = v_id_dificultad,
            duracion_dias = 4, duracion_noches = 3, altura_maxima = 4820, desnivel = 1420,
            descripcion_completa = 'La expedición al Cerro Franke es una experiencia desafiante de alta montaña, ideal para quienes buscan fortalecer su resistencia y ganar experiencia en ascensos de gran altitud.',
            desc_resumen = 'Una experiencia desafiante de alta montaña: 4 días para alcanzar los 4.820 m del imponente Franke.',
            sobre_lugar = 'Ubicado en la Cordillera Frontal de Mendoza, el Cerro Franke es un destino clásico para quienes buscan un ascenso exigente.',
            clima_recomendado = 'La mejor temporada para ascender el Cerro Franke es de noviembre a marzo, cuando las condiciones meteorológicas son más predecibles.',
            descripcion_recorrido = 'El ascenso se realiza por la ruta normal en el filo sureste, atravesando terrenos de alta montaña con desniveles exigentes.',
            experiencia_requerida = 'Esta expedición es de dificultad media-alta, recomendada para personas con experiencia en trekking de altura y buen estado físico.',
            horas_caminata_diarias = '14-16 horas (día de cumbre)', peso_mochila = 'Equipo personal y comunitario',
            temperatura_dia_min = -5, temperatura_dia_max = 15, temperatura_noche_min = -15,
            temporada_recomendada = ARRAY['noviembre', 'diciembre', 'enero', 'febrero', 'marzo'],
            punto_encuentro = 'Mendoza a las 9:00 hs',
            comodidades = '3 noches en tiendas de montaña de alta calidad especializadas para condiciones extremas.',
            briefing_info = 'Cada día realizaremos una reunión para revisar el plan de ascenso, organizar el equipo y brindar recomendaciones sobre aclimatación, técnicas de marcha y gestión del esfuerzo en altura.',
            modalidad = 'grupo reducido', cupos_maximos = 4, ratio_guia_pasajero = '1-2',
            consideraciones_especiales = ARRAY['Expedición de alta montaña con condiciones climáticas adversas', 'Jornada de cumbre muy exigente de 14-16 horas', 'Aclimatación previa recomendada', 'Experiencia en trekking de altura necesaria'],
            url_foto = '/franke/1.jpg', urls_fotos = ARRAY['/franke/1.jpg', '/franke/2.jpg', '/franke/3.jpg'],
            fecha_actualizacion = NOW()
        WHERE id_servicio = v_id_servicio;
        DELETE FROM itinerarios WHERE id_servicio = v_id_servicio;
    END IF;

    -- Insertar itinerarios de Franke
    IF v_id_servicio IS NOT NULL THEN
        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, hora_inicio, distancia_km, desnivel_metros, duracion_horas, altitud, alojamiento, comidas, intensidad, actividades_especiales)
        VALUES (v_id_servicio, 1, 4, 'Encuentro en Mendoza y traslado a Vallecitos', 'Encuentro en ciudad de Mendoza a las 9:00 hs. Revisión de equipo y traslado a Vallecitos. Inicio del trekking a Veguitas superior (CB-3400 msnm), porteando el equipo personal y comunitario.', '09:00', 2, 500, '2-3hs', 3400, 'tiendas de montaña', ARRAY['cena', 'pernocte'], 'moderada-exigente', ARRAY['Revisión de equipo', 'Armado de campamento']);

        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, altitud, alojamiento, comidas, intensidad, actividades_especiales)
        VALUES (v_id_servicio, 2, 4, 'Trekking de aclimatación a campamentos de altura', 'Trekking de aclimatación a campamentos de altura (3800/4000 msnm). Jornada dedicada a la adaptación progresiva a la altitud y reconocimiento del terreno.', 4000, 'tiendas de montaña', ARRAY['desayuno', 'almuerzo', 'cena', 'pernocte'], 'moderada', ARRAY['Aclimatación', 'Reconocimiento de terreno']);

        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, distancia_km, desnivel_metros, duracion_horas, altitud, alojamiento, comidas, intensidad, actividades_especiales)
        VALUES (v_id_servicio, 3, 4, 'Ascenso al Cerro Franke', 'Ascenso al cerro Franke por su ruta normal en el filo sureste y descenso por un gran acarreo que finaliza a metros del campamento Piedra Grande. Jornada muy exigente de alta montaña.', 11, 1542, '14-16hs', 4820, 'tiendas de montaña', ARRAY['desayuno temprano', 'raciones de marcha', 'cena', 'pernocte'], 'exigente', ARRAY['Cumbre', 'Filo sureste', 'Gran acarreo']);

        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, hora_fin, comidas, actividades_especiales)
        VALUES (v_id_servicio, 4, 4, 'Regreso a Mendoza', 'Desarme de campamento y regreso a Mendoza. Fin de la expedición a las 15:00 hs aproximadamente. Tiempo para almuerzo opcional en Potrerillos antes del regreso.', '15:00', ARRAY['desayuno', 'almuerzo opcional'], ARRAY['Desarme de campamento', 'Cierre de expedición']);
    END IF;

    -- ============================================
    -- SERVICIO 9: SAN FRANCISCO
    -- ============================================
    
    -- Obtener o crear ubicación (Catamarca - Ruta de los Seismiles)
    SELECT id_ubicacion INTO v_id_ubicacion
    FROM ubicaciones
    WHERE pais = 'Argentina' AND provincia = 'Catamarca' AND zona = 'Ruta de los Seismiles'
    LIMIT 1;
    
    IF v_id_ubicacion IS NULL THEN
        INSERT INTO ubicaciones (pais, provincia, zona)
        VALUES ('Argentina', 'Catamarca', 'Ruta de los Seismiles')
        RETURNING id_ubicacion INTO v_id_ubicacion;
    END IF;

    -- Obtener o crear lugar (Volcán San Francisco)
    SELECT id_lugar INTO v_id_lugar
    FROM lugares
    WHERE nombre = 'Volcán San Francisco'
    LIMIT 1;
    
    IF v_id_lugar IS NULL THEN
        INSERT INTO lugares (nombre, tipo_lugar, altitud, descripcion, id_ubicacion)
        VALUES (
            'Volcán San Francisco',
            'Volcán',
            6016,
            'El Volcán San Francisco, de 6.016 metros, se ubica en el límite entre Argentina y Chile, dentro de un corredor de volcanes de más de seis mil metros que dominan la región.',
            v_id_ubicacion
        )
        RETURNING id_lugar INTO v_id_lugar;
    END IF;

    -- Obtener dificultad (Media-Alta) - ya existe
    
    -- Verificar si el servicio San Francisco ya existe
    SELECT id_servicio INTO v_id_servicio
    FROM servicios
    WHERE nombre = 'Volcán San Francisco'
    LIMIT 1;
    
    IF v_id_servicio IS NULL THEN
        INSERT INTO servicios (
            nombre, id_lugar, id_actividad, id_dificultad,
            duracion_dias, duracion_noches, altura_maxima, desnivel,
            descripcion_completa, desc_resumen, sobre_lugar, clima_recomendado,
            descripcion_recorrido, experiencia_requerida, horas_caminata_diarias, peso_mochila,
            temperatura_dia_min, temperatura_dia_max, temperatura_noche_min,
            temporada_recomendada, conocimientos_tecnicos_requeridos, punto_encuentro,
            comodidades, briefing_info, modalidad, cupos_maximos, ratio_guia_pasajero,
            alimentacion_detalle, servicios_incluidos, servicios_no_incluidos,
            diferenciadores, consideraciones_especiales, activo,
            url_foto, urls_fotos, fecha_creacion, fecha_actualizacion
        )
        VALUES (
            'Volcán San Francisco', v_id_lugar, v_id_actividad, v_id_dificultad,
            7, 6, 6016, 918,
            'El ascenso al Volcán San Francisco es una expedición de alta montaña en la Puna de Catamarca, ideal para quienes desean alcanzar un seismil y vivir una experiencia transformadora en paisajes de extrema belleza.',
            'Tu primer seismil: 7 días de aclimatación progresiva hasta alcanzar los 6.016 m del imponente San Francisco.',
            'El Volcán San Francisco, de 6.016 metros, se ubica en el límite entre Argentina y Chile, dentro de un corredor de volcanes de más de seis mil metros que dominan la región.',
            'La mejor temporada para ascender al Volcán San Francisco es entre noviembre y marzo, cuando las temperaturas son más estables y el clima menos hostil.',
            'El ascenso sigue un plan de aclimatación progresivo de 7 días, comenzando en Fiambalá (1.550 m) y ascendiendo gradualmente cerros de aclimatación: Coquena (4.035 m), Falso Morocho (4.500 m) y Bertrand (5.250 m).',
            'Esta expedición tiene una dificultad exigente, recomendada para personas con buena condición física, estado de salud y experiencia en montañas de 4.000 m o actividades de resistencia.',
            '12-14 horas (día de cumbre)',
            '15-17 kg',
            5, 18, -15,
            ARRAY['noviembre', 'diciembre', 'enero', 'febrero', 'marzo'],
            false,
            'Fiambalá a las 9:00 hs',
            '6 noches en tiendas de montaña de alta calidad. Refugios rústicos de adobe en algunos campamentos.',
            'Cada día realizaremos encuentros para revisar el itinerario, evaluar la aclimatación y compartir recomendaciones para enfrentar la altura con seguridad.',
            'grupo reducido',
            4,
            '1-2',
            '{"desayunos": "Huevos, palta, panificaciones", "raciones_marcha": "Empanadas, sándwiches con fiambres al vacío, huevo, fruta", "cenas": "Platos regionales en Fiambalá; opciones ligeras y altamente nutritivas en campamentos de altura"}',
            ARRAY['Guías profesionales de montaña', 'Grupos reducidos ratio 1-2 (1 guía cada 2 pasajeros)', 'Traslados desde y hasta Fiambalá', 'Pensión completa en montaña', 'Alojamiento 6 noches en carpas de alta montaña', 'Almuerzo de despedida', 'Visita a termas', 'Registro audiovisual del ascenso', 'Seguro contra accidentes personales', 'Botiquín grupal de primeros auxilios', 'Comunicación VHF y satelital para emergencias', 'Oxígeno medicinal para evacuación', 'Listado de elementos para el viaje y asesoramiento individual previo (vía WhatsApp)'],
            ARRAY['Indumentaria personal', 'Equipo de montaña personal', 'Bebidas personales', 'Snacks de marcha', 'Transporte desde ciudad de origen a Fiambalá'],
            ARRAY['Enfoque educativo: autonomía en la montaña', 'Grupos reducidos', 'Ritmo ajustado y conexión con la montaña', 'Compromiso con el medio ambiente'],
            ARRAY['Expedición en zona remota con condiciones de aislamiento propias de la alta montaña', 'Durante varios días no habrá acceso a señal de celular ni asistencia médica cercana', 'Región limítrofe con Chile - documentación vigente obligatoria', 'Formularios específicos para paso internacional (provistos por Altiplano)', 'Ascenso a 6.000 metros con largas jornadas, frío intenso y clima cambiante'],
            true,
            '/sanfrancisco/1.jpg',
            ARRAY['/sanfrancisco/1.jpg', '/sanfrancisco/2.jpg', '/sanfrancisco/3.jpg'],
            '2025-01-01'::timestamp,
            '2025-01-01'::timestamp
        )
        RETURNING id_servicio INTO v_id_servicio;
    ELSE
        UPDATE servicios SET
            id_lugar = v_id_lugar, id_actividad = v_id_actividad, id_dificultad = v_id_dificultad,
            duracion_dias = 7, duracion_noches = 6, altura_maxima = 6016, desnivel = 918,
            descripcion_completa = 'El ascenso al Volcán San Francisco es una expedición de alta montaña en la Puna de Catamarca, ideal para quienes desean alcanzar un seismil y vivir una experiencia transformadora en paisajes de extrema belleza.',
            desc_resumen = 'Tu primer seismil: 7 días de aclimatación progresiva hasta alcanzar los 6.016 m del imponente San Francisco.',
            sobre_lugar = 'El Volcán San Francisco, de 6.016 metros, se ubica en el límite entre Argentina y Chile, dentro de un corredor de volcanes de más de seis mil metros que dominan la región.',
            clima_recomendado = 'La mejor temporada para ascender al Volcán San Francisco es entre noviembre y marzo, cuando las temperaturas son más estables y el clima menos hostil.',
            descripcion_recorrido = 'El ascenso sigue un plan de aclimatación progresivo de 7 días, comenzando en Fiambalá (1.550 m) y ascendiendo gradualmente cerros de aclimatación: Coquena (4.035 m), Falso Morocho (4.500 m) y Bertrand (5.250 m).',
            experiencia_requerida = 'Esta expedición tiene una dificultad exigente, recomendada para personas con buena condición física, estado de salud y experiencia en montañas de 4.000 m o actividades de resistencia.',
            horas_caminata_diarias = '12-14 horas (día de cumbre)', peso_mochila = '15-17 kg',
            temperatura_dia_min = 5, temperatura_dia_max = 18, temperatura_noche_min = -15,
            temporada_recomendada = ARRAY['noviembre', 'diciembre', 'enero', 'febrero', 'marzo'],
            punto_encuentro = 'Fiambalá a las 9:00 hs',
            comodidades = '6 noches en tiendas de montaña de alta calidad. Refugios rústicos de adobe en algunos campamentos.',
            briefing_info = 'Cada día realizaremos encuentros para revisar el itinerario, evaluar la aclimatación y compartir recomendaciones para enfrentar la altura con seguridad.',
            modalidad = 'grupo reducido', cupos_maximos = 4, ratio_guia_pasajero = '1-2',
            consideraciones_especiales = ARRAY['Expedición en zona remota con condiciones de aislamiento propias de la alta montaña', 'Durante varios días no habrá acceso a señal de celular ni asistencia médica cercana', 'Región limítrofe con Chile - documentación vigente obligatoria', 'Formularios específicos para paso internacional (provistos por Altiplano)', 'Ascenso a 6.000 metros con largas jornadas, frío intenso y clima cambiante'],
            url_foto = '/sanfrancisco/1.jpg', urls_fotos = ARRAY['/sanfrancisco/1.jpg', '/sanfrancisco/2.jpg', '/sanfrancisco/3.jpg'],
            fecha_actualizacion = NOW()
        WHERE id_servicio = v_id_servicio;
        DELETE FROM itinerarios WHERE id_servicio = v_id_servicio;
    END IF;

    -- Insertar itinerarios de San Francisco
    IF v_id_servicio IS NOT NULL THEN
        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, hora_inicio, altitud, alojamiento, comidas, actividades_especiales)
        VALUES (v_id_servicio, 1, 7, 'Encuentro en Fiambalá y traslado a Pastos Largos', 'Encuentro a las 9:00 hs en Fiambalá (1.550 msnm). Bienvenida, briefing, permisos aduaneros y traslado en vehículos a Pastos Largos (3.300 msnm). Noche en tiendas de montaña.', '09:00', 3300, 'tiendas de montaña', ARRAY['almuerzo', 'cena', 'pernocte'], ARRAY['Bienvenida', 'Briefing', 'Permisos aduaneros']);

        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, duracion_horas, desnivel_metros, altitud, alojamiento, comidas, intensidad, actividades_especiales)
        VALUES (v_id_servicio, 2, 7, 'Ascenso al Cerro Coquena', 'Ascenso al cerro Coquena (4.035 msnm). Pernocte en Pastos Largos (3.300 msnm). Jornada moderada de aclimatación.', '7hs aprox', 735, 4035, 'tiendas de montaña', ARRAY['desayuno', 'almuerzo de marcha', 'cena', 'pernocte'], 'moderada', ARRAY['Aclimatación', 'Cumbre Coquena']);

        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, duracion_horas, desnivel_metros, altitud, alojamiento, comidas, intensidad, actividades_especiales)
        VALUES (v_id_servicio, 3, 7, 'Traslado y ascenso al Cerro Falso Morocho', 'Traslado en vehículo hacia La Gruta (4.000 m), paso aduanero. Ascenso al cerro Falso Morocho (4.500 msnm). Descanso en agua termal.', '4hs aprox', 500, 4500, 'tiendas de alta montaña', ARRAY['desayuno', 'almuerzo de marcha', 'cena', 'pernocte'], 'moderada', ARRAY['Paso aduanero', 'Cumbre Falso Morocho', 'Aguas termales']);

        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, duracion_horas, desnivel_metros, altitud, alojamiento, comidas, intensidad, actividades_especiales)
        VALUES (v_id_servicio, 4, 7, 'Ascenso al Volcán Bertrand', 'Aproximación en vehículo a 4.400 msnm. Ascenso a Volcán Bertrand (5.250 msnm) y regreso al campamento. Jornada intensa de aclimatación.', '9hs aprox', 850, 5250, 'tiendas de montaña', ARRAY['desayuno', 'raciones de marcha', 'cena', 'pernocte'], 'intensa', ARRAY['Cumbre Bertrand', 'Aclimatación alta montaña']);

        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, duracion_horas, desnivel_metros, peso_mochila, altitud, alojamiento, comidas, intensidad, actividades_especiales)
        VALUES (v_id_servicio, 5, 7, 'Descanso activo y traslado al campamento base', 'Descanso activo. Traslado al campamento base del Volcán San Francisco a 5.100 msnm. Preparación para el día de cumbre. Trekking con mochila de 15-17 kg.', '2-3hs aprox', 400, '15-17 kg', 5100, 'tiendas de montaña', ARRAY['desayuno', 'almuerzo', 'cena', 'pernocte'], 'moderada', ARRAY['Descanso activo', 'Preparación para cumbre']);

        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, duracion_horas, desnivel_metros, altitud, alojamiento, comidas, intensidad, actividades_especiales)
        VALUES (v_id_servicio, 6, 7, 'Ascenso al Volcán San Francisco', 'Ascenso al Volcán San Francisco (6.016 msnm). Regreso al campamento base. Noche en tiendas de alta montaña. Jornada muy exigente de seismil.', '12-14hs', 918, 6016, 'tiendas de alta montaña', ARRAY['desayuno temprano', 'raciones de marcha', 'cena', 'pernocte'], 'muy exigente', ARRAY['Cumbre San Francisco', 'Seismil']);

        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, altitud, comidas, actividades_especiales)
        VALUES (v_id_servicio, 7, 7, 'Regreso a Fiambalá', 'Desarmado de campamento y regreso a Fiambalá. Almuerzo de despedida, visita a termas y fin del programa.', 1550, ARRAY['desayuno', 'almuerzo de despedida'], ARRAY['Visita a termas', 'Cierre del programa']);
    END IF;

    -- ============================================
    -- SERVICIO 11: LLULLAILLACO
    -- ============================================
    
    -- Obtener o crear ubicación (Salta - Puna de Atacama) - ya existe
    
    -- Obtener o crear lugar (Volcán Llullaillaco)
    SELECT id_lugar INTO v_id_lugar
    FROM lugares
    WHERE nombre = 'Volcán Llullaillaco'
    LIMIT 1;
    
    IF v_id_lugar IS NULL THEN
        INSERT INTO lugares (nombre, tipo_lugar, altitud, descripcion, id_ubicacion)
        VALUES (
            'Volcán Llullaillaco',
            'Volcán',
            6739,
            'El Llullaillaco se encuentra en la frontera entre Argentina y Chile, en un sector remoto y poco transitado de la Puna salteña. El paisaje es de una aridez extrema, dominado por salares, volcanes y cielos inmensos.',
            v_id_ubicacion
        )
        RETURNING id_lugar INTO v_id_lugar;
    END IF;

    -- Obtener dificultad (Exigente) - ya existe
    
    -- Verificar si el servicio Llullaillaco ya existe
    SELECT id_servicio INTO v_id_servicio
    FROM servicios
    WHERE nombre = 'Volcán Llullaillaco'
    LIMIT 1;
    
    IF v_id_servicio IS NULL THEN
        INSERT INTO servicios (
            nombre, id_lugar, id_actividad, id_dificultad,
            duracion_dias, duracion_noches, altura_maxima, desnivel,
            descripcion_completa, desc_resumen, sobre_lugar, clima_recomendado,
            descripcion_recorrido, experiencia_requerida, horas_caminata_diarias, peso_mochila,
            temperatura_dia_min, temperatura_dia_max, temperatura_noche_min,
            temporada_recomendada, conocimientos_tecnicos_requeridos, punto_encuentro,
            comodidades, briefing_info, modalidad, cupos_maximos, ratio_guia_pasajero,
            alimentacion_detalle, servicios_incluidos, servicios_no_incluidos,
            diferenciadores, consideraciones_especiales, activo,
            url_foto, urls_fotos, fecha_creacion, fecha_actualizacion
        )
        VALUES (
            'Volcán Llullaillaco', v_id_lugar, v_id_actividad, v_id_dificultad,
            14, 13, 6739, 839,
            'El ascenso al Volcán Llullaillaco es una de las grandes experiencias de alta montaña en la Puna de Atacama. Con sus imponentes 6.739 metros, es un volcán cargado de historia y misticismo, conocido por albergar en su cumbre el santuario inca más alto del mundo.',
            'Una épica expedición de 14 días hacia el santuario inca más alto del mundo, en los imponentes 6.739 metros del Llullaillaco.',
            'El Llullaillaco se encuentra en la frontera entre Argentina y Chile, en un sector remoto y poco transitado de la Puna salteña. El paisaje es de una aridez extrema, dominado por salares, volcanes y cielos inmensos.',
            'La mejor época para realizar el ascenso al volcán es de abril a noviembre, cuando el clima es más seco y las condiciones de estabilidad atmosférica favorecen la aclimatación y el ascenso.',
            'La expedición incluye un proceso de aclimatación progresivo de 14 días, comenzando con el ascenso del Cerro Pompeya (4.050 m) y el Volcán Tuzgle (5.530 m), para luego establecer campamento base del Llullaillaco a 4.900 m.',
            'La expedición requiere experiencia previa en alta montaña, ascensos por encima de los 5.000 m, excelente estado físico y capacidad de adaptación a condiciones extremas.',
            '8-12 horas',
            '15-18 kg',
            -5, 15, -15,
            ARRAY['abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre'],
            false,
            'Salta a las 9:00 hs',
            '4 noches en hosterías y 10 noches en tiendas de montaña de alta calidad.',
            'Cada día realizaremos una reunión para revisar el plan de ascenso, organizar el equipo y brindar recomendaciones sobre aclimatación, técnicas de marcha y gestión del esfuerzo en altura.',
            'grupo reducido',
            4,
            '1-2',
            '{"desayunos": "Huevos, palta, panificaciones", "raciones_marcha": "Empanadas, sándwiches con fiambres, huevo, fruta", "cenas": "Platos regionales en San Antonio de los Cobres; opciones ligeras y altamente nutritivas en campamentos de altura"}',
            ARRAY['Guías profesionales de montaña', 'Grupos reducidos ratio 1-2 (1 guía cada 2 pasajeros)', 'Pensión completa', 'Alojamiento 4 noches en hostería y 10 noches en carpas de alta montaña', 'Transporte local en Salta', 'Registro audiovisual del ascenso', 'Seguro contra accidentes personales', 'Botiquín grupal de primeros auxilios', 'Comunicación VHF y satelital', 'Listado de elementos para el viaje y asesoramiento individual previo (vía WhatsApp)'],
            ARRAY['Porteos', 'Indumentaria personal', 'Equipo de montaña personal', 'Bebidas personales', 'Snacks de marcha', 'Transporte desde ciudad de origen a Salta'],
            ARRAY['Enfoque educativo: autonomía en la montaña', 'Grupos reducidos', 'Ritmo ajustado y conexión con la montaña', 'Compromiso con el medio ambiente'],
            ARRAY['Expedición en zona extremadamente remota con condiciones de aislamiento', 'Durante varios días no habrá acceso a señal de celular ni asistencia médica cercana', 'Región limítrofe con Chile - documentación vigente obligatoria', 'Volcán con alto valor arqueológico - santuario inca más alto del mundo', 'Ascenso a casi 7.000 metros con largas jornadas y clima extremo'],
            true,
            '/llullaillaco/1.jpg',
            ARRAY['/llullaillaco/1.jpg', '/llullaillaco/2.jpg', '/llullaillaco/3.jpg'],
            '2025-01-01'::timestamp,
            '2025-01-01'::timestamp
        )
        RETURNING id_servicio INTO v_id_servicio;
    ELSE
        UPDATE servicios SET
            id_lugar = v_id_lugar, id_actividad = v_id_actividad, id_dificultad = v_id_dificultad,
            duracion_dias = 14, duracion_noches = 13, altura_maxima = 6739, desnivel = 839,
            descripcion_completa = 'El ascenso al Volcán Llullaillaco es una de las grandes experiencias de alta montaña en la Puna de Atacama. Con sus imponentes 6.739 metros, es un volcán cargado de historia y misticismo, conocido por albergar en su cumbre el santuario inca más alto del mundo.',
            desc_resumen = 'Una épica expedición de 14 días hacia el santuario inca más alto del mundo, en los imponentes 6.739 metros del Llullaillaco.',
            sobre_lugar = 'El Llullaillaco se encuentra en la frontera entre Argentina y Chile, en un sector remoto y poco transitado de la Puna salteña. El paisaje es de una aridez extrema, dominado por salares, volcanes y cielos inmensos.',
            clima_recomendado = 'La mejor época para realizar el ascenso al volcán es de abril a noviembre, cuando el clima es más seco y las condiciones de estabilidad atmosférica favorecen la aclimatación y el ascenso.',
            descripcion_recorrido = 'La expedición incluye un proceso de aclimatación progresivo de 14 días, comenzando con el ascenso del Cerro Pompeya (4.050 m) y el Volcán Tuzgle (5.530 m), para luego establecer campamento base del Llullaillaco a 4.900 m.',
            experiencia_requerida = 'La expedición requiere experiencia previa en alta montaña, ascensos por encima de los 5.000 m, excelente estado físico y capacidad de adaptación a condiciones extremas.',
            horas_caminata_diarias = '8-12 horas', peso_mochila = '15-18 kg',
            temperatura_dia_min = -5, temperatura_dia_max = 15, temperatura_noche_min = -15,
            temporada_recomendada = ARRAY['abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre'],
            punto_encuentro = 'Salta a las 9:00 hs',
            comodidades = '4 noches en hosterías y 10 noches en tiendas de montaña de alta calidad.',
            briefing_info = 'Cada día realizaremos una reunión para revisar el plan de ascenso, organizar el equipo y brindar recomendaciones sobre aclimatación, técnicas de marcha y gestión del esfuerzo en altura.',
            modalidad = 'grupo reducido', cupos_maximos = 4, ratio_guia_pasajero = '1-2',
            consideraciones_especiales = ARRAY['Expedición en zona extremadamente remota con condiciones de aislamiento', 'Durante varios días no habrá acceso a señal de celular ni asistencia médica cercana', 'Región limítrofe con Chile - documentación vigente obligatoria', 'Volcán con alto valor arqueológico - santuario inca más alto del mundo', 'Ascenso a casi 7.000 metros con largas jornadas y clima extremo'],
            url_foto = '/llullaillaco/1.jpg', urls_fotos = ARRAY['/llullaillaco/1.jpg', '/llullaillaco/2.jpg', '/llullaillaco/3.jpg'],
            fecha_actualizacion = NOW()
        WHERE id_servicio = v_id_servicio;
        DELETE FROM itinerarios WHERE id_servicio = v_id_servicio;
    END IF;

    -- Insertar itinerarios de Llullaillaco (14 días)
    IF v_id_servicio IS NOT NULL THEN
        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, hora_inicio, altitud, alojamiento, comidas, actividades_especiales)
        VALUES (v_id_servicio, 1, 14, 'Encuentro en Salta', 'Encuentro en Salta (9:00 h) Bienvenida, briefing y revisión de equipo. Traslado a San Antonio de los Cobres (3.775 m). Cena y pernocte en hostería.', '09:00', 3775, 'hostería', ARRAY['cena', 'pernocte'], ARRAY['Bienvenida', 'Briefing', 'Revisión de equipo']);

        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, altitud, alojamiento, comidas, actividades_especiales)
        VALUES (v_id_servicio, 2, 14, 'Ascenso de aclimatación al Cerro Pompeya', 'Ascenso de aclimatación al Cerro Pompeya (4.050 m). Regreso, cena y pernocte en hostería en San Antonio de los Cobres.', 4050, 'hostería', ARRAY['cena', 'pernocte'], ARRAY['Aclimatación', 'Cerro Pompeya']);

        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, altitud, alojamiento, actividades_especiales)
        VALUES (v_id_servicio, 3, 14, 'Traslado al campamento base del Volcán Tuzgle', 'Traslado en vehículo hasta el campamento base del Volcán Tuzgle (4.500 m). Armado de campamento y pernocte en tiendas de montaña.', 4500, 'tiendas de montaña', ARRAY['Armado de campamento']);

        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, altitud, alojamiento, actividades_especiales)
        VALUES (v_id_servicio, 4, 14, 'Día de aclimatación en Tuzgle', 'Día de aclimatación y descanso en campamento base, o posibilidad de mover al C1 según clima y condiciones del grupo.', 4500, 'tiendas de montaña', ARRAY['Aclimatación', 'Descanso']);

        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, altitud, alojamiento, comidas, intensidad, actividades_especiales)
        VALUES (v_id_servicio, 5, 14, 'Ascenso a la cumbre del Volcán Tuzgle', 'Ascenso a la cumbre del Volcán Tuzgle (5.530 m) y regreso a San Antonio de los Cobres. Cena y pernocte en hostería.', 5530, 'hostería', ARRAY['cena', 'pernocte'], 'exigente', ARRAY['Cumbre Tuzgle']);

        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, altitud, alojamiento, actividades_especiales)
        VALUES (v_id_servicio, 6, 14, 'Jornada de descanso', 'Jornada de descanso en San Antonio de los Cobres.', 3775, 'hostería', ARRAY['Descanso', 'Recuperación']);

        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, altitud, alojamiento, comidas)
        VALUES (v_id_servicio, 7, 14, 'Traslado a Tolar Grande', 'Traslado a Tolar Grande (3.500 m). Cena y pernocte en hostería (según disponibilidad).', 3500, 'hostería', ARRAY['cena', 'pernocte']);

        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, altitud, alojamiento, actividades_especiales)
        VALUES (v_id_servicio, 8, 14, 'Traslado al campamento base del Volcán Llullaillaco', 'Traslado al campamento base del Volcán Llullaillaco (4900 m). Armado de campamento y pernocte en tiendas de montaña.', 4900, 'tiendas de montaña', ARRAY['Armado de campamento base Llullaillaco']);

        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, altitud, alojamiento, intensidad, actividades_especiales)
        VALUES (v_id_servicio, 9, 14, 'Porteo de equipo al C1', 'Porteo de equipo al C1 (5.900 m) y regreso al campamento base.', 5900, 'campamento base', 'moderada-exigente', ARRAY['Porteo al C1']);

        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, altitud, alojamiento, actividades_especiales)
        VALUES (v_id_servicio, 10, 14, 'Día de descanso y recuperación', 'Día de descanso y recuperación en el campamento base.', 4900, 'campamento base', ARRAY['Descanso', 'Recuperación', 'Aclimatación']);

        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, altitud, alojamiento, intensidad)
        VALUES (v_id_servicio, 11, 14, 'Ascenso al C1', 'Ascenso al C1 (5.900 m). Pernocte en tiendas de montaña.', 5900, 'tiendas de montaña', 'exigente');

        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, duracion_horas, desnivel_metros, altitud, alojamiento, intensidad, actividades_especiales)
        VALUES (v_id_servicio, 12, 14, 'Intento de cumbre del Volcán Llullaillaco', 'Intento de cumbre del Volcán Llullaillaco (6.739 m) y regreso al C1.', '12-15hs', 839, 6739, 'C1', 'muy exigente', ARRAY['Cumbre Llullaillaco', 'Santuario inca más alto del mundo']);

        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, altitud, alojamiento, comidas)
        VALUES (v_id_servicio, 13, 14, 'Descenso al campamento base', 'Descenso al campamento base y traslado a San Antonio de los Cobres. Cena de despedida y pernocte en hostería.', 3775, 'hostería', ARRAY['cena de despedida', 'pernocte']);

        INSERT INTO itinerarios (id_servicio, dia, total_dias, titulo, descripcion, comidas)
        VALUES (v_id_servicio, 14, 14, 'Regreso a Salta', 'Regreso a la ciudad de Salta. Fin de los servicios.', ARRAY['fin de servicios']);
    END IF;

    -- ============================================
    -- CORRECCIÓN: Tuzgle debe usar dificultad Media-Alta, no Moderada
    -- ============================================
    UPDATE servicios
    SET id_dificultad = (SELECT id_dificultad FROM dificultades WHERE nivel = 'Media-Alta' LIMIT 1)
    WHERE nombre = 'Volcán Tuzgle' AND id_dificultad = (SELECT id_dificultad FROM dificultades WHERE nivel = 'Moderada' LIMIT 1);
    
    RAISE NOTICE 'Todos los servicios insertados correctamente';
END $$;

