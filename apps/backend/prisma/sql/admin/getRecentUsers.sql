-- Get recent users with their activity stats
-- @name getRecentUsers
-- @param $1:int - limit (number of users to fetch)
-- @param $2:int - offset (pagination offset)
SELECT
  u.id,
  u.name,
  u.email,
  u.role,
  u."emailVerified",
  u."createdAt",
  (
    SELECT MAX(s."createdAt")
    FROM "Session" s
    WHERE s."userId" = u.id
  ) as "lastLogin",
  (
    SELECT COUNT(*)::int
    FROM "Paper" p
    WHERE p."uploaderId" = u.id
    AND p."isDeleted" = false
  ) as "paperCount",
  (
    SELECT COUNT(DISTINCT wm."workspaceId")::int
    FROM "WorkspaceMember" wm
    WHERE wm."userId" = u.id
  ) as "workspaceCount"
FROM "User" u
WHERE u."isDeleted" = false
ORDER BY u."createdAt" DESC
LIMIT $1
OFFSET $2;
