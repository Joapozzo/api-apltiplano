-- Script para convertir campos String a Array en PostgreSQL
-- Ejecutar este script en la base de datos para corregir los datos

-- Corregir urls_fotos en servicios
UPDATE servicios 
SET urls_fotos = string_to_array(
    trim(both '{}' from urls_fotos::text), 
    ','
)::text[]
WHERE urls_fotos IS NOT NULL 
  AND urls_fotos::text LIKE '{%}';

-- Corregir otros campos array en servicios si están afectados
UPDATE servicios 
SET temporada_recomendada = string_to_array(
    trim(both '{}' from temporada_recomendada::text), 
    ','
)::text[]
WHERE temporada_recomendada IS NOT NULL 
  AND temporada_recomendada::text LIKE '{%}';

UPDATE servicios 
SET consideraciones_especiales = string_to_array(
    trim(both '{}' from consideraciones_especiales::text), 
    ','
)::text[]
WHERE consideraciones_especiales IS NOT NULL 
  AND consideraciones_especiales::text LIKE '{%}';

UPDATE servicios 
SET servicios_incluidos = string_to_array(
    trim(both '{}' from servicios_incluidos::text), 
    ','
)::text[]
WHERE servicios_incluidos IS NOT NULL 
  AND servicios_incluidos::text LIKE '{%}';

UPDATE servicios 
SET servicios_no_incluidos = string_to_array(
    trim(both '{}' from servicios_no_incluidos::text), 
    ','
)::text[]
WHERE servicios_no_incluidos IS NOT NULL 
  AND servicios_no_incluidos::text LIKE '{%}';

UPDATE servicios 
SET servicios_adicionales_disponibles = string_to_array(
    trim(both '{}' from servicios_adicionales_disponibles::text), 
    ','
)::text[]
WHERE servicios_adicionales_disponibles IS NOT NULL 
  AND servicios_adicionales_disponibles::text LIKE '{%}';

UPDATE servicios 
SET diferenciadores = string_to_array(
    trim(both '{}' from diferenciadores::text), 
    ','
)::text[]
WHERE diferenciadores IS NOT NULL 
  AND diferenciadores::text LIKE '{%}';

UPDATE servicios 
SET gestion_cargas = string_to_array(
    trim(both '{}' from gestion_cargas::text), 
    ','
)::text[]
WHERE gestion_cargas IS NOT NULL 
  AND gestion_cargas::text LIKE '{%}';

-- Corregir campos array en itinerarios
UPDATE itinerarios 
SET comidas = string_to_array(
    trim(both '{}' from comidas::text), 
    ','
)::text[]
WHERE comidas IS NOT NULL 
  AND comidas::text LIKE '{%}';

UPDATE itinerarios 
SET actividades_especiales = string_to_array(
    trim(both '{}' from actividades_especiales::text), 
    ','
)::text[]
WHERE actividades_especiales IS NOT NULL 
  AND actividades_especiales::text LIKE '{%}';

-- Corregir campos array en coordinadores
UPDATE coordinadores 
SET certificaciones = string_to_array(
    trim(both '{}' from certificaciones::text), 
    ','
)::text[]
WHERE certificaciones IS NOT NULL 
  AND certificaciones::text LIKE '{%}';

UPDATE coordinadores 
SET especialidades = string_to_array(
    trim(both '{}' from especialidades::text), 
    ','
)::text[]
WHERE especialidades IS NOT NULL 
  AND especialidades::text LIKE '{%}';

