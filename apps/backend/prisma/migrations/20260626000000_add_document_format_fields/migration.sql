-- Add document format tracking fields to Paper
ALTER TABLE "Paper" ADD COLUMN IF NOT EXISTS "originalFormat" TEXT;
ALTER TABLE "Paper" ADD COLUMN IF NOT EXISTS "processingStage" TEXT;
ALTER TABLE "Paper" ADD COLUMN IF NOT EXISTS "processingStartedAt" TIMESTAMP(3);
