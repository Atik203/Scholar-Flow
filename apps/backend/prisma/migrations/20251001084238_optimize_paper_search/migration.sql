-- CreateIndex
CREATE INDEX "CollectionPaper_collectionId_isDeleted_addedAt_idx" ON "public"."CollectionPaper"("collectionId", "isDeleted", "addedAt");

-- CreateIndex
CREATE INDEX "CollectionPaper_paperId_isDeleted_idx" ON "public"."CollectionPaper"("paperId", "isDeleted");

-- CreateIndex
CREATE INDEX "CollectionPaper_addedById_isDeleted_idx" ON "public"."CollectionPaper"("addedById", "isDeleted");

-- CreateIndex
CREATE INDEX "Paper_uploaderId_workspaceId_isDeleted_createdAt_idx" ON "public"."Paper"("uploaderId", "workspaceId", "isDeleted", "createdAt");

-- CreateIndex
CREATE INDEX "Paper_workspaceId_isDeleted_createdAt_idx" ON "public"."Paper"("workspaceId", "isDeleted", "createdAt");

-- CreateIndex
CREATE INDEX "Paper_uploaderId_isDeleted_idx" ON "public"."Paper"("uploaderId", "isDeleted");

-- CreateIndex
CREATE INDEX "Paper_isDraft_isDeleted_idx" ON "public"."Paper"("isDraft", "isDeleted");

-- CreateIndex
CREATE INDEX "Paper_doi_isDeleted_idx" ON "public"."Paper"("doi", "isDeleted");
