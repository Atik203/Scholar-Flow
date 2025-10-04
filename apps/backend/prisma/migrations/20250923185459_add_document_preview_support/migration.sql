-- AlterTable
ALTER TABLE "public"."Paper" ADD COLUMN     "contentHtml" TEXT,
ADD COLUMN     "extractionVersion" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "originalMimeType" TEXT,
ADD COLUMN     "previewFileKey" TEXT,
ADD COLUMN     "previewMimeType" TEXT;
