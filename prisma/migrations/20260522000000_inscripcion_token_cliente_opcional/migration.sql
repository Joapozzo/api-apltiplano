-- Allow generic inscription links without a pre-assigned client
ALTER TABLE "inscripcion_tokens" ALTER COLUMN "id_cliente" DROP NOT NULL;
