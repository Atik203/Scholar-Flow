-- Enable pgvector extension for semantic search
CREATE EXTENSION IF NOT EXISTS vector;

-- Add embedding column to PaperChunk
ALTER TABLE "PaperChunk" ADD COLUMN IF NOT EXISTS embedding vector(1536);

-- HNSW index for fast cosine similarity search
CREATE INDEX IF NOT EXISTS idx_paperchunk_embedding_hnsw
ON "PaperChunk" USING hnsw(embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);
