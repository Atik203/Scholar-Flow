-- CreateIndex
CREATE INDEX "Session_userId_expires_idx" ON "public"."Session"("userId", "expires");

-- CreateIndex
CREATE INDEX "Session_expires_idx" ON "public"."Session"("expires");

-- CreateIndex
CREATE INDEX "User_createdAt_role_idx" ON "public"."User"("createdAt", "role");

-- CreateIndex
CREATE INDEX "User_role_isDeleted_idx" ON "public"."User"("role", "isDeleted");
