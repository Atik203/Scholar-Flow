-- Add color, positionIndex, and metadata fields to Annotation model
ALTER TABLE "Annotation" ADD COLUMN IF NOT EXISTS "color" TEXT NOT NULL DEFAULT '#FFEB3B';
ALTER TABLE "Annotation" ADD COLUMN IF NOT EXISTS "positionIndex" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Annotation" ADD COLUMN IF NOT EXISTS "metadata" JSONB;
