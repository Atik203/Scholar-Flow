-- ============================================================================
-- Phase 4 - Paper & Collection metadata migration
-- ============================================================================
-- Adds figma-make UI fields to Paper, Collection, and CollectionPaper models.
-- All changes are additive and backward-compatible: the legacy `isPublic`
-- boolean is preserved so existing collection routes keep working. The new
-- `visibility` enum is backfilled from `isPublic` (true -> PUBLIC, false ->
-- PRIVATE). Removal of `isPublic` and full migration of all collection
-- queries to `visibility` happens in Subtask B.
-- ============================================================================

-- CreateEnum
CREATE TYPE "public"."CollectionVisibility" AS ENUM ('PRIVATE', 'TEAM', 'PUBLIC');

-- CreateEnum
CREATE TYPE "public"."CollectionPaperStatus" AS ENUM ('TO_READ', 'READING', 'COMPLETED', 'ARCHIVED');

-- AlterTable - Paper
ALTER TABLE "public"."Paper" ADD COLUMN "tags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "public"."Paper" ADD COLUMN "language" TEXT;
ALTER TABLE "public"."Paper" ADD COLUMN "citationCount" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex - Paper tags
CREATE INDEX "Paper_tags_idx" ON "public"."Paper" USING GIN ("tags");

-- AlterTable - Collection
ALTER TABLE "public"."Collection" ADD COLUMN "visibility" "public"."CollectionVisibility" NOT NULL DEFAULT 'PRIVATE';
ALTER TABLE "public"."Collection" ADD COLUMN "tags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "public"."Collection" ADD COLUMN "coverImage" TEXT;
ALTER TABLE "public"."Collection" ADD COLUMN "color" TEXT;

-- Backfill Collection.visibility from the legacy isPublic boolean
UPDATE "public"."Collection" SET "visibility" = 'PUBLIC' WHERE "isPublic" = true;
UPDATE "public"."Collection" SET "visibility" = 'PRIVATE' WHERE "isPublic" = false;

-- CreateIndex - Collection tags and visibility
CREATE INDEX "Collection_tags_idx" ON "public"."Collection" USING GIN ("tags");
CREATE INDEX "Collection_visibility_isDeleted_idx" ON "public"."Collection"("visibility", "isDeleted");

-- AlterTable - CollectionPaper
ALTER TABLE "public"."CollectionPaper" ADD COLUMN "status" "public"."CollectionPaperStatus" NOT NULL DEFAULT 'TO_READ';
ALTER TABLE "public"."CollectionPaper" ADD COLUMN "isStarred" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex - CollectionPaper status/starred
CREATE INDEX "CollectionPaper_collectionId_status_isStarred_isDeleted_idx" ON "public"."CollectionPaper"("collectionId", "status", "isStarred", "isDeleted");
