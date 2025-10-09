-- CreateTable
CREATE TABLE "public"."ResearchNote" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "paperId" TEXT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "tags" TEXT[],
    "isPrivate" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ResearchNote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ResearchNote_userId_isDeleted_updatedAt_idx" ON "public"."ResearchNote"("userId", "isDeleted", "updatedAt");

-- CreateIndex
CREATE INDEX "ResearchNote_paperId_isDeleted_idx" ON "public"."ResearchNote"("paperId", "isDeleted");

-- CreateIndex
CREATE INDEX "ResearchNote_tags_idx" ON "public"."ResearchNote"("tags");

-- AddForeignKey
ALTER TABLE "public"."ResearchNote" ADD CONSTRAINT "ResearchNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ResearchNote" ADD CONSTRAINT "ResearchNote_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "public"."Paper"("id") ON DELETE SET NULL ON UPDATE CASCADE;
