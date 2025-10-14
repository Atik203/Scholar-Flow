-- CreateEnum
CREATE TYPE "public"."CitationFormat" AS ENUM ('BIBTEX', 'ENDNOTE', 'APA', 'MLA', 'IEEE', 'CHICAGO', 'HARVARD');

-- CreateEnum
CREATE TYPE "public"."ActivitySeverity" AS ENUM ('INFO', 'WARNING', 'ERROR', 'CRITICAL');

-- CreateTable
CREATE TABLE "public"."CitationExport" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "paperId" TEXT,
    "collectionId" TEXT,
    "format" "public"."CitationFormat" NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" JSONB,
    "exportedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "CitationExport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DiscussionThread" (
    "id" TEXT NOT NULL,
    "paperId" TEXT,
    "collectionId" TEXT,
    "workspaceId" TEXT,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isResolved" BOOLEAN NOT NULL DEFAULT false,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "DiscussionThread_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DiscussionMessage" (
    "id" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "parentId" TEXT,
    "isEdited" BOOLEAN NOT NULL DEFAULT false,
    "editHistory" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "DiscussionMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ActivityLogEntry" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "workspaceId" TEXT,
    "entity" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "details" JSONB,
    "metadata" JSONB,
    "severity" "public"."ActivitySeverity" NOT NULL DEFAULT 'INFO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ActivityLogEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CitationExport_userId_exportedAt_idx" ON "public"."CitationExport"("userId", "exportedAt");

-- CreateIndex
CREATE INDEX "CitationExport_paperId_format_idx" ON "public"."CitationExport"("paperId", "format");

-- CreateIndex
CREATE INDEX "CitationExport_collectionId_format_idx" ON "public"."CitationExport"("collectionId", "format");

-- CreateIndex
CREATE INDEX "DiscussionThread_paperId_isDeleted_createdAt_idx" ON "public"."DiscussionThread"("paperId", "isDeleted", "createdAt");

-- CreateIndex
CREATE INDEX "DiscussionThread_collectionId_isDeleted_createdAt_idx" ON "public"."DiscussionThread"("collectionId", "isDeleted", "createdAt");

-- CreateIndex
CREATE INDEX "DiscussionThread_workspaceId_isDeleted_createdAt_idx" ON "public"."DiscussionThread"("workspaceId", "isDeleted", "createdAt");

-- CreateIndex
CREATE INDEX "DiscussionThread_userId_isDeleted_idx" ON "public"."DiscussionThread"("userId", "isDeleted");

-- CreateIndex
CREATE INDEX "DiscussionThread_isResolved_isDeleted_idx" ON "public"."DiscussionThread"("isResolved", "isDeleted");

-- CreateIndex
CREATE INDEX "DiscussionThread_isPinned_isDeleted_idx" ON "public"."DiscussionThread"("isPinned", "isDeleted");

-- CreateIndex
CREATE INDEX "DiscussionMessage_threadId_createdAt_idx" ON "public"."DiscussionMessage"("threadId", "createdAt");

-- CreateIndex
CREATE INDEX "DiscussionMessage_userId_isDeleted_idx" ON "public"."DiscussionMessage"("userId", "isDeleted");

-- CreateIndex
CREATE INDEX "DiscussionMessage_parentId_isDeleted_idx" ON "public"."DiscussionMessage"("parentId", "isDeleted");

-- CreateIndex
CREATE INDEX "ActivityLogEntry_userId_createdAt_idx" ON "public"."ActivityLogEntry"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "ActivityLogEntry_workspaceId_createdAt_idx" ON "public"."ActivityLogEntry"("workspaceId", "createdAt");

-- CreateIndex
CREATE INDEX "ActivityLogEntry_entity_entityId_createdAt_idx" ON "public"."ActivityLogEntry"("entity", "entityId", "createdAt");

-- CreateIndex
CREATE INDEX "ActivityLogEntry_action_createdAt_idx" ON "public"."ActivityLogEntry"("action", "createdAt");

-- CreateIndex
CREATE INDEX "ActivityLogEntry_severity_createdAt_idx" ON "public"."ActivityLogEntry"("severity", "createdAt");

-- AddForeignKey
ALTER TABLE "public"."CitationExport" ADD CONSTRAINT "CitationExport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CitationExport" ADD CONSTRAINT "CitationExport_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "public"."Paper"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CitationExport" ADD CONSTRAINT "CitationExport_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "public"."Collection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DiscussionThread" ADD CONSTRAINT "DiscussionThread_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "public"."Paper"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DiscussionThread" ADD CONSTRAINT "DiscussionThread_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "public"."Collection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DiscussionThread" ADD CONSTRAINT "DiscussionThread_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DiscussionThread" ADD CONSTRAINT "DiscussionThread_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DiscussionMessage" ADD CONSTRAINT "DiscussionMessage_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "public"."DiscussionThread"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DiscussionMessage" ADD CONSTRAINT "DiscussionMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DiscussionMessage" ADD CONSTRAINT "DiscussionMessage_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."DiscussionMessage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ActivityLogEntry" ADD CONSTRAINT "ActivityLogEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ActivityLogEntry" ADD CONSTRAINT "ActivityLogEntry_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace"("id") ON DELETE SET NULL ON UPDATE CASCADE;
