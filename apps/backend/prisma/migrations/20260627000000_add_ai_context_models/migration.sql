-- CreateTable: AIKeyPoint
CREATE TABLE "AIKeyPoint" (
    "id" TEXT NOT NULL,
    "paperId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" TEXT,
    "order" INTEGER NOT NULL,
    "model" TEXT,
    "tokensUsed" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "AIKeyPoint_pkey" PRIMARY KEY ("id")
);

-- CreateIndex: AIKeyPoint unique per paper+order
CREATE UNIQUE INDEX "AIKeyPoint_paperId_order_key" ON "AIKeyPoint"("paperId", "order");

-- CreateIndex: AIKeyPoint lookup by paper
CREATE INDEX "AIKeyPoint_paperId_isDeleted_idx" ON "AIKeyPoint"("paperId", "isDeleted");

-- AddForeignKey: AIKeyPoint -> Paper
ALTER TABLE "AIKeyPoint" ADD CONSTRAINT "AIKeyPoint_paperId_fkey"
  FOREIGN KEY ("paperId") REFERENCES "Paper"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- CreateTable: AIMetadata
CREATE TABLE "AIMetadata" (
    "id" TEXT NOT NULL,
    "paperId" TEXT NOT NULL,
    "title" TEXT,
    "abstract" TEXT,
    "keywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "researchDomain" TEXT,
    "publicationType" TEXT,
    "readingLevel" TEXT,
    "methodology" TEXT,
    "researchQuestions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "contributions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "limitations" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "futureWork" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "model" TEXT,
    "tokensUsed" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "AIMetadata_pkey" PRIMARY KEY ("id")
);

-- CreateIndex: AIMetadata unique per paper
CREATE UNIQUE INDEX "AIMetadata_paperId_key" ON "AIMetadata"("paperId");

-- AddForeignKey: AIMetadata -> Paper
ALTER TABLE "AIMetadata" ADD CONSTRAINT "AIMetadata_paperId_fkey"
  FOREIGN KEY ("paperId") REFERENCES "Paper"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- CreateTable: AIContextCache
CREATE TABLE "AIContextCache" (
    "id" TEXT NOT NULL,
    "paperId" TEXT,
    "workspaceId" TEXT,
    "contentType" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "tokenCount" INTEGER,
    "model" TEXT,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "AIContextCache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex: AIContextCache lookups
CREATE INDEX "AIContextCache_paperId_contentType_idx" ON "AIContextCache"("paperId", "contentType");
CREATE INDEX "AIContextCache_workspaceId_contentType_idx" ON "AIContextCache"("workspaceId", "contentType");
CREATE INDEX "AIContextCache_expiresAt_idx" ON "AIContextCache"("expiresAt");

-- AddForeignKey: AIContextCache -> Paper
ALTER TABLE "AIContextCache" ADD CONSTRAINT "AIContextCache_paperId_fkey"
  FOREIGN KEY ("paperId") REFERENCES "Paper"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: AIContextCache -> Workspace
ALTER TABLE "AIContextCache" ADD CONSTRAINT "AIContextCache_workspaceId_fkey"
  FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
