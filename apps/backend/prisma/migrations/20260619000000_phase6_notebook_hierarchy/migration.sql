-- Phase 6: Discussions, Notes & Citations
-- Adds Notebook + NotebookSection hierarchy for ResearchNote, plus
-- note-level metadata (type/visibility/star/wordCount/excerpt).
-- Purely additive: nullable columns, no drops, no enum value changes.
-- Required by IMPLEMENTATION.md: "Notebook, NotebookSection models".

-- CreateEnum: NoteType (matches figma ResearchNotesPage type filter)
CREATE TYPE "NoteType" AS ENUM (
  'QUICK',
  'LITERATURE',
  'METHODOLOGY',
  'FINDINGS',
  'IDEA'
);

-- CreateEnum: NoteVisibility (matches figma visibility pills)
CREATE TYPE "NoteVisibility" AS ENUM (
  'PRIVATE',
  'WORKSPACE',
  'PUBLIC'
);

-- AlterTable: extend ResearchNote with optional notebook/section organization
ALTER TABLE "ResearchNote"
  ADD COLUMN "notebookId" TEXT,
  ADD COLUMN "sectionId"  TEXT,
  ADD COLUMN "noteType"   "NoteType"       NOT NULL DEFAULT 'QUICK',
  ADD COLUMN "visibility" "NoteVisibility" NOT NULL DEFAULT 'PRIVATE',
  ADD COLUMN "isStarred"  BOOLEAN          NOT NULL DEFAULT false,
  ADD COLUMN "wordCount"  INTEGER          NOT NULL DEFAULT 0,
  ADD COLUMN "excerpt"    TEXT;

-- CreateTable: Notebook
CREATE TABLE "Notebook" (
    "id"          TEXT NOT NULL,
    "userId"      TEXT NOT NULL,
    "name"        TEXT NOT NULL,
    "description" TEXT,
    "color"       TEXT NOT NULL DEFAULT 'blue',
    "isStarred"   BOOLEAN NOT NULL DEFAULT false,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3) NOT NULL,
    "isDeleted"   BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Notebook_pkey" PRIMARY KEY ("id")
);

-- CreateTable: NotebookSection
CREATE TABLE "NotebookSection" (
    "id"         TEXT NOT NULL,
    "notebookId" TEXT NOT NULL,
    "userId"     TEXT NOT NULL,
    "name"       TEXT NOT NULL,
    "order"      INTEGER NOT NULL DEFAULT 0,
    "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"  TIMESTAMP(3) NOT NULL,
    "isDeleted"  BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "NotebookSection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex: Notebook lookup
CREATE INDEX "Notebook_userId_isDeleted_updatedAt_idx"
  ON "Notebook"("userId", "isDeleted", "updatedAt");

-- CreateIndex: NotebookSection ordering within a notebook
CREATE INDEX "NotebookSection_notebookId_isDeleted_order_idx"
  ON "NotebookSection"("notebookId", "isDeleted", "order");

-- CreateIndex: ResearchNote notebook-scoped listing
CREATE INDEX "ResearchNote_notebookId_isDeleted_updatedAt_idx"
  ON "ResearchNote"("notebookId", "isDeleted", "updatedAt");

-- CreateIndex: ResearchNote section-scoped listing
CREATE INDEX "ResearchNote_sectionId_isDeleted_idx"
  ON "ResearchNote"("sectionId", "isDeleted");

-- CreateIndex: ResearchNote type filter
CREATE INDEX "ResearchNote_noteType_isDeleted_idx"
  ON "ResearchNote"("noteType", "isDeleted");

-- CreateIndex: ResearchNote starred notes
CREATE INDEX "ResearchNote_userId_isStarred_isDeleted_idx"
  ON "ResearchNote"("userId", "isStarred", "isDeleted");

-- AddForeignKey: ResearchNote.notebookId -> Notebook (SetNull so note survives notebook delete)
ALTER TABLE "ResearchNote" ADD CONSTRAINT "ResearchNote_notebookId_fkey"
  FOREIGN KEY ("notebookId") REFERENCES "Notebook"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey: ResearchNote.sectionId -> NotebookSection (SetNull)
ALTER TABLE "ResearchNote" ADD CONSTRAINT "ResearchNote_sectionId_fkey"
  FOREIGN KEY ("sectionId") REFERENCES "NotebookSection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey: Notebook -> User (Cascade so user delete cleans notebooks)
ALTER TABLE "Notebook" ADD CONSTRAINT "Notebook_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: NotebookSection -> Notebook (Cascade on notebook delete)
ALTER TABLE "NotebookSection" ADD CONSTRAINT "NotebookSection_notebookId_fkey"
  FOREIGN KEY ("notebookId") REFERENCES "Notebook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: NotebookSection -> User
ALTER TABLE "NotebookSection" ADD CONSTRAINT "NotebookSection_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
