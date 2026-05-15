ALTER TABLE "usuarios"
ADD COLUMN "firebase_uid" TEXT,
ADD COLUMN "fecha_actualizacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

UPDATE "usuarios"
SET "firebase_uid" = 'legacy-' || "id_usuario"
WHERE "firebase_uid" IS NULL;

UPDATE "roles"
SET "codigo" = 'USER'
WHERE "codigo" = 'usuario';

UPDATE "roles"
SET "codigo" = 'ADMIN'
WHERE "codigo" = 'admin';

ALTER TABLE "usuarios"
DROP COLUMN "password_hash";

ALTER TABLE "usuarios"
ALTER COLUMN "firebase_uid" SET NOT NULL;

CREATE UNIQUE INDEX "usuarios_firebase_uid_key" ON "usuarios"("firebase_uid");
