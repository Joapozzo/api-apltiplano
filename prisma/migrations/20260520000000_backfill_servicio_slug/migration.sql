-- Backfill slug para URLs públicas /salidas/:slug
UPDATE servicios
SET slug = 'champaqui'
WHERE nombre = 'Cerro Champaquí' AND (slug IS NULL OR slug = '');

-- Resto: slug corto (sin prefijo cerro-) cuando aplica; si no, kebab desde nombre
UPDATE servicios s
SET slug = CASE
  WHEN lower(regexp_replace(trim(s.nombre), '^cerro\s+', '', 'i')) <> trim(lower(s.nombre))
    THEN lower(regexp_replace(regexp_replace(
      translate(trim(regexp_replace(trim(s.nombre), '^cerro\s+', '', 'i')), 'áéíóúÁÉÍÓÚñÑ', 'aeiouAEIOUnN'),
      '[^a-zA-Z0-9]+', '-', 'g'), '(^-|-$)', '', 'g'))
  ELSE lower(regexp_replace(regexp_replace(
      translate(trim(s.nombre), 'áéíóúÁÉÍÓÚñÑ', 'aeiouAEIOUnN'),
      '[^a-zA-Z0-9]+', '-', 'g'), '(^-|-$)', '', 'g'))
END
WHERE (slug IS NULL OR slug = '')
  AND nombre IS NOT NULL
  AND nombre <> 'Cerro Champaquí'
  AND NOT EXISTS (
    SELECT 1 FROM servicios o
    WHERE o.id_servicio <> s.id_servicio
      AND o.slug IS NOT NULL
      AND o.slug = CASE
        WHEN lower(regexp_replace(trim(s.nombre), '^cerro\s+', '', 'i')) <> trim(lower(s.nombre))
          THEN lower(regexp_replace(regexp_replace(
            translate(trim(regexp_replace(trim(s.nombre), '^cerro\s+', '', 'i')), 'áéíóúÁÉÍÓÚñÑ', 'aeiouAEIOUnN'),
            '[^a-zA-Z0-9]+', '-', 'g'), '(^-|-$)', '', 'g'))
        ELSE lower(regexp_replace(regexp_replace(
            translate(trim(s.nombre), 'áéíóúÁÉÍÓÚñÑ', 'aeiouAEIOUnN'),
            '[^a-zA-Z0-9]+', '-', 'g'), '(^-|-$)', '', 'g'))
      END
  );
