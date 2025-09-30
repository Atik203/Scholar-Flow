-- DropIndex
DROP INDEX "public"."Annotation_paperId_idx";

-- DropIndex
DROP INDEX "public"."Annotation_userId_idx";

-- DropIndex
DROP INDEX "public"."Citation_targetPaperId_idx";

-- DropIndex
DROP INDEX "public"."Collection_ownerId_idx";

-- DropIndex
DROP INDEX "public"."Collection_workspaceId_idx";

-- DropIndex
DROP INDEX "public"."CollectionMember_collectionId_idx";

-- DropIndex
DROP INDEX "public"."CollectionPaper_paperId_idx";

-- DropIndex
DROP INDEX "public"."Session_expires_idx";

-- DropIndex
DROP INDEX "public"."Subscription_planId_idx";

-- DropIndex
DROP INDEX "public"."Subscription_userId_idx";

-- DropIndex
DROP INDEX "public"."Subscription_workspaceId_idx";

-- DropIndex
DROP INDEX "public"."User_createdAt_role_idx";

-- DropIndex
DROP INDEX "public"."User_role_isDeleted_idx";

-- DropIndex
DROP INDEX "public"."UserToken_expiresAt_idx";

-- DropIndex
DROP INDEX "public"."UserToken_token_idx";

-- DropIndex
DROP INDEX "public"."UserToken_type_idx";

-- DropIndex
DROP INDEX "public"."UserToken_userId_idx";

-- DropIndex
DROP INDEX "public"."Workspace_ownerId_idx";

-- DropIndex
DROP INDEX "public"."WorkspaceInvitation_userId_idx";

-- DropIndex
DROP INDEX "public"."WorkspaceInvitation_workspaceId_idx";

-- DropIndex
DROP INDEX "public"."WorkspaceMember_userId_idx";

-- DropIndex
DROP INDEX "public"."WorkspaceMember_workspaceId_idx";

-- CreateIndex
CREATE INDEX "Annotation_paperId_isDeleted_createdAt_idx" ON "public"."Annotation"("paperId", "isDeleted", "createdAt");

-- CreateIndex
CREATE INDEX "Annotation_userId_isDeleted_idx" ON "public"."Annotation"("userId", "isDeleted");

-- CreateIndex
CREATE INDEX "Annotation_parentId_isDeleted_idx" ON "public"."Annotation"("parentId", "isDeleted");

-- CreateIndex
CREATE INDEX "Citation_targetPaperId_isDeleted_idx" ON "public"."Citation"("targetPaperId", "isDeleted");

-- CreateIndex
CREATE INDEX "Citation_sourcePaperId_isDeleted_idx" ON "public"."Citation"("sourcePaperId", "isDeleted");

-- CreateIndex
CREATE INDEX "Collection_workspaceId_isDeleted_idx" ON "public"."Collection"("workspaceId", "isDeleted");

-- CreateIndex
CREATE INDEX "Collection_ownerId_isDeleted_createdAt_idx" ON "public"."Collection"("ownerId", "isDeleted", "createdAt");

-- CreateIndex
CREATE INDEX "CollectionMember_collectionId_status_isDeleted_idx" ON "public"."CollectionMember"("collectionId", "status", "isDeleted");

-- CreateIndex
CREATE INDEX "CollectionMember_userId_isDeleted_idx" ON "public"."CollectionMember"("userId", "isDeleted");

-- CreateIndex
CREATE INDEX "CollectionPaper_collectionId_isDeleted_idx" ON "public"."CollectionPaper"("collectionId", "isDeleted");

-- CreateIndex
CREATE INDEX "CollectionPaper_paperId_isDeleted_idx" ON "public"."CollectionPaper"("paperId", "isDeleted");

-- CreateIndex
CREATE INDEX "Session_expires_isDeleted_idx" ON "public"."Session"("expires", "isDeleted");

-- CreateIndex
CREATE INDEX "Subscription_userId_status_isDeleted_idx" ON "public"."Subscription"("userId", "status", "isDeleted");

-- CreateIndex
CREATE INDEX "Subscription_workspaceId_status_isDeleted_idx" ON "public"."Subscription"("workspaceId", "status", "isDeleted");

-- CreateIndex
CREATE INDEX "Subscription_status_expiresAt_idx" ON "public"."Subscription"("status", "expiresAt");

-- CreateIndex
CREATE INDEX "User_isDeleted_createdAt_idx" ON "public"."User"("isDeleted", "createdAt");

-- CreateIndex
CREATE INDEX "User_role_isDeleted_createdAt_idx" ON "public"."User"("role", "isDeleted", "createdAt");

-- CreateIndex
CREATE INDEX "User_email_isDeleted_idx" ON "public"."User"("email", "isDeleted");

-- CreateIndex
CREATE INDEX "UserToken_token_used_idx" ON "public"."UserToken"("token", "used");

-- CreateIndex
CREATE INDEX "UserToken_userId_type_used_idx" ON "public"."UserToken"("userId", "type", "used");

-- CreateIndex
CREATE INDEX "UserToken_expiresAt_used_idx" ON "public"."UserToken"("expiresAt", "used");

-- CreateIndex
CREATE INDEX "Workspace_ownerId_isDeleted_createdAt_idx" ON "public"."Workspace"("ownerId", "isDeleted", "createdAt");

-- CreateIndex
CREATE INDEX "WorkspaceInvitation_workspaceId_status_isDeleted_idx" ON "public"."WorkspaceInvitation"("workspaceId", "status", "isDeleted");

-- CreateIndex
CREATE INDEX "WorkspaceInvitation_userId_status_isDeleted_idx" ON "public"."WorkspaceInvitation"("userId", "status", "isDeleted");

-- CreateIndex
CREATE INDEX "WorkspaceMember_userId_isDeleted_idx" ON "public"."WorkspaceMember"("userId", "isDeleted");

-- CreateIndex
CREATE INDEX "WorkspaceMember_workspaceId_isDeleted_role_idx" ON "public"."WorkspaceMember"("workspaceId", "isDeleted", "role");
