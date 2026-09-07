-- CreateTable
CREATE TABLE "PaperShare" (
    "id" TEXT NOT NULL,
    "paperId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "permission" TEXT NOT NULL,
    "sharedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PaperShare_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PaperShare_paperId_email_key" ON "PaperShare"("paperId", "email");

-- CreateIndex
CREATE INDEX "PaperShare_email_isDeleted_idx" ON "PaperShare"("email", "isDeleted");

-- AddForeignKey
ALTER TABLE "PaperShare" ADD CONSTRAINT "PaperShare_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "Paper"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaperShare" ADD CONSTRAINT "PaperShare_sharedById_fkey" FOREIGN KEY ("sharedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;