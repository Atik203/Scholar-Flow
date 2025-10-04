-- Get role distribution statistics
-- @name getRoleDistribution
SELECT
  role,
  COUNT(*)::int as count
FROM "User"
WHERE "isDeleted" = false
GROUP BY role
ORDER BY count DESC;
