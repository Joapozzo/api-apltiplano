-- AlterTable
ALTER TABLE "servicios" ADD COLUMN IF NOT EXISTS "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "servicios_slug_key" ON "servicios"("slug");
