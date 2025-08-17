-- Enable pgvector extension (idempotent)
CREATE EXTENSION IF NOT EXISTS vector;

-- Recreate embedding column as vector if currently JSONB
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'PaperChunk' AND column_name = 'embedding' AND data_type = 'jsonb'
  ) THEN
    ALTER TABLE "PaperChunk" DROP COLUMN "embedding";
    ALTER TABLE "PaperChunk" ADD COLUMN "embedding" vector(1536);
  ELSIF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'PaperChunk' AND column_name = 'embedding'
  ) THEN
    ALTER TABLE "PaperChunk" ADD COLUMN "embedding" vector(1536);
  END IF;
END $$;

-- Optional index for cosine distance (L2 & inner product possible). Uncomment when data volume justifies.
-- CREATE INDEX IF NOT EXISTS paperchunk_embedding_ivfflat_idx ON "PaperChunk" USING ivfflat (embedding vector_l2_ops) WITH (lists = 100);
