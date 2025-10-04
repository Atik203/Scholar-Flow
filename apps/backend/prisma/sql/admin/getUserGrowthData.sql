-- Get user growth data for the last 30 days
-- @name getUserGrowthData
SELECT
  DATE("createdAt") as date,
  COUNT(*)::int as "newUsers"
FROM "User"
WHERE "createdAt" >= NOW() - INTERVAL '30 days'
AND "isDeleted" = false
GROUP BY DATE("createdAt")
ORDER BY date ASC;er growth data for the last 30 days
-- @name getUserGrowthData
SELECT
  DATE("createdAt") as date,
  COUNT(*)::int as "newUsers"
FROM "User"
WHERE "createdAt" >= NOW() - INTERVAL '30 days'
GROUP BY DATE("createdAt")
ORDER BY date DESC;
