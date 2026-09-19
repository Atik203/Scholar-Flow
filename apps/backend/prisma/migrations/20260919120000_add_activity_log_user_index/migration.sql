-- Supports per-user activity lookups for team member lastActive/status
-- derivation (listMembers) without scanning the whole log table.
CREATE INDEX IF NOT EXISTS "ActivityLog_userId_createdAt_idx"
  ON "ActivityLog"("userId", "createdAt");
