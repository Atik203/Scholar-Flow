-- CreateIndex
CREATE INDEX "Paper_uploaderId_isDeleted_createdAt_idx" ON "public"."Paper"("uploaderId", "isDeleted", "createdAt");

-- CreateIndex
CREATE INDEX "Paper_workspaceId_isDeleted_createdAt_idx" ON "public"."Paper"("workspaceId", "isDeleted", "createdAt");

-- CreateIndex
CREATE INDEX "Paper_processingStatus_createdAt_idx" ON "public"."Paper"("processingStatus", "createdAt");
