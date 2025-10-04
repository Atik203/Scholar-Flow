-- CreateTable
CREATE TABLE "public"."AIInsightThread" (
    "id" TEXT NOT NULL,
    "paperId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "AIInsightThread_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AIInsightMessage" (
    "id" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "paperId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" JSONB,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "AIInsightMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_ai_insight_thread_lookup" ON "public"."AIInsightThread"("paperId", "userId", "isDeleted");

-- CreateIndex
CREATE INDEX "idx_ai_insight_thread_user" ON "public"."AIInsightThread"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "idx_ai_insight_msg_thread" ON "public"."AIInsightMessage"("threadId", "createdAt");

-- CreateIndex
CREATE INDEX "idx_ai_insight_msg_paper" ON "public"."AIInsightMessage"("paperId", "createdAt");

-- AddForeignKey
ALTER TABLE "public"."AIInsightThread" ADD CONSTRAINT "AIInsightThread_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "public"."Paper"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AIInsightThread" ADD CONSTRAINT "AIInsightThread_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AIInsightMessage" ADD CONSTRAINT "AIInsightMessage_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "public"."AIInsightThread"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AIInsightMessage" ADD CONSTRAINT "AIInsightMessage_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "public"."Paper"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AIInsightMessage" ADD CONSTRAINT "AIInsightMessage_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
