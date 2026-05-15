-- Script para limpiar completamente la caché de PostgreSQL
-- Ejecutar esto para resolver el error "cached plan must not change result type"

-- 1. Limpiar todos los planes preparados
DEALLOCATE ALL;

-- 2. Terminar todas las conexiones activas (excepto la actual)
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN 
        SELECT pid 
        FROM pg_stat_activity 
        WHERE datname = current_database() 
          AND pid != pg_backend_pid()
    LOOP
        PERFORM pg_terminate_backend(r.pid);
    END LOOP;
END $$;

-- 3. Limpiar la caché de estadísticas
ANALYZE;

-- 4. Verificar que se limpió
SELECT 
    count(*) as conexiones_activas
FROM pg_stat_activity 
WHERE datname = current_database();

