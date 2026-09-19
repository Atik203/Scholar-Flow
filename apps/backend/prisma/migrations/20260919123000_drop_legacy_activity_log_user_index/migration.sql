-- The previous revision added an index to the legacy "ActivityLog" table,
-- but the live per-user activity data lives in "ActivityLogEntry" (which
-- already has a userId+createdAt index). Drop the redundant index.
DROP INDEX IF EXISTS "ActivityLog_userId_createdAt_idx";
