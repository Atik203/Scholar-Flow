-- Add cost tracking columns to AIProvider
ALTER TABLE "AIProvider" ADD COLUMN IF NOT EXISTS "inputCostPer1k" DOUBLE PRECISION;
ALTER TABLE "AIProvider" ADD COLUMN IF NOT EXISTS "outputCostPer1k" DOUBLE PRECISION;

-- Add cost tracking to AI conversation messages
ALTER TABLE "AIConversationMessage" ADD COLUMN IF NOT EXISTS "costCents" DOUBLE PRECISION;
