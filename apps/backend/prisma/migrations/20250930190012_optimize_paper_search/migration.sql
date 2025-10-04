-- DropIndex
DROP INDEX "public"."CollectionPaper_collectionId_isDeleted_idx";

-- DropIndex
DROP INDEX "public"."CollectionPaper_paperId_isDeleted_idx";

-- DropIndex
DROP INDEX "public"."Paper_uploaderId_idx";

-- DropIndex
DROP INDEX "public"."Paper_uploaderId_isDeleted_createdAt_idx";

-- DropIndex
DROP INDEX "public"."Paper_workspaceId_createdAt_idx";

-- DropIndex
DROP INDEX "public"."Paper_workspaceId_isDeleted_createdAt_idx";

-- Ensure pg_trgm extension is available for trigram indexes
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create partial indexes tailored for active paper lookups
CREATE INDEX "Paper_active_workspace_createdAt_idx" ON "public"."Paper" ("workspaceId", "createdAt")
WHERE
    "isDeleted" = false;

CREATE INDEX "Paper_active_uploader_createdAt_idx" ON "public"."Paper" ("uploaderId", "createdAt")
WHERE
    "isDeleted" = false;

-- Accelerate case-insensitive search using trigram indexes
CREATE INDEX "Paper_title_trgm_idx" ON "public"."Paper" USING GIN ("title" gin_trgm_ops)
WHERE
    "isDeleted" = false;

CREATE INDEX "Paper_abstract_trgm_idx" ON "public"."Paper" USING GIN ("abstract" gin_trgm_ops)
WHERE
    "abstract" IS NOT NULL
    AND "isDeleted" = false;

CREATE INDEX "Paper_source_trgm_idx" ON "public"."Paper" USING GIN ("source" gin_trgm_ops)
WHERE
    "source" IS NOT NULL
    AND "isDeleted" = false;

CREATE INDEX "Collection_name_trgm_idx" ON "public"."Collection" USING GIN ("name" gin_trgm_ops)
WHERE
    "isDeleted" = false;

CREATE INDEX "Collection_description_trgm_idx" ON "public"."Collection" USING GIN ("description" gin_trgm_ops)
WHERE
    "description" IS NOT NULL
    AND "isDeleted" = false;

-- Focused helper indexes for common aggregation paths
CREATE INDEX "WorkspaceMember_active_workspace_idx" ON "public"."WorkspaceMember" ("workspaceId")
WHERE
    "isDeleted" = false;

CREATE INDEX "CollectionPaper_active_collection_idx" ON "public"."CollectionPaper" ("collectionId")
WHERE
    "isDeleted" = false;

CREATE INDEX "CollectionPaper_active_paper_idx" ON "public"."CollectionPaper" ("paperId")
WHERE
    "isDeleted" = false;