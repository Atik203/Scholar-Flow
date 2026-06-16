-- Enable trigram extension for fast ILIKE searches
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Trigram GIN indexes for fast ILIKE '%term%' search
CREATE INDEX IF NOT EXISTS idx_paper_title_trgm
ON "Paper" USING GIN (title gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_paper_abstract_trgm
ON "Paper" USING GIN (abstract gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_paper_authors_trgm
ON "Paper" USING GIN (authors gin_trgm_ops);

-- Paper list hot paths
CREATE INDEX IF NOT EXISTS idx_paper_uploader_created
ON "Paper"("createdAt" DESC, "uploaderId")
WHERE "isDeleted" = false;

CREATE INDEX IF NOT EXISTS idx_paper_workspace_created
ON "Paper"("createdAt" DESC, "workspaceId")
WHERE "isDeleted" = false;

-- Notification inbox
CREATE INDEX IF NOT EXISTS idx_notification_user_created
ON "Notification"("userId", "createdAt" DESC);

-- Discussion threads per paper
CREATE INDEX IF NOT EXISTS idx_discussion_paper_pinned_created
ON "DiscussionThread"("paperId", "isPinned" DESC, "createdAt" DESC)
WHERE "isDeleted" = false;

-- Activity log timeline
CREATE INDEX IF NOT EXISTS idx_activity_user_created
ON "ActivityLogEntry"("userId", "createdAt" DESC)
WHERE "isDeleted" = false;

-- Workspace member lookups
CREATE INDEX IF NOT EXISTS idx_workspace_member_user
ON "WorkspaceMember"("userId", "isDeleted");

-- pgvector extension and HNSW index are applied conditionally.
-- If your database does not have the vector extension available, enable it
-- in your provider console first, then uncomment the block below or run it manually:
--
-- CREATE EXTENSION IF NOT EXISTS vector;
-- ALTER TABLE "PaperChunk" ADD COLUMN IF NOT EXISTS embedding vector(1536);
-- CREATE INDEX IF NOT EXISTS idx_paperchunk_embedding_hnsw
-- ON "PaperChunk" USING hnsw(embedding vector_cosine_ops)
-- WITH (m = 16, ef_construction = 64);
