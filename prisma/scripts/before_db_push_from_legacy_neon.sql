-- One-time fixes if `prisma db push` fails against an older Neon schema:
-- 1) Tokens without id_cliente block NOT NULL add
DELETE FROM "inscripcion_tokens";

-- 2) Drop legacy unique on usuarios.dni (constraint name may differ)
ALTER TABLE "usuarios" DROP CONSTRAINT IF EXISTS "usuarios_dni_key";
