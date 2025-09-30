-- Get comprehensive system statistics
-- @name getSystemStats
SELECT
  (SELECT COUNT(*)::int FROM "User" WHERE "isDeleted" = false) as "totalUsers",
  (SELECT COUNT(*)::int FROM "Paper" WHERE "isDeleted" = false) as "totalPapers",
  (SELECT COUNT(*)::int FROM "Session" WHERE "expires" > NOW()) as "activeSessions",
  (SELECT COALESCE(SUM("sizeBytes"), 0)::int FROM "PaperFile" WHERE "isDeleted" = false) as "totalStorageBytes",
  (
    SELECT COUNT(*)::int FROM "User" 
    WHERE "createdAt" >= NOW() - INTERVAL '30 days'
    AND "isDeleted" = false
  ) as "newUsersLast30Days",
  (
    SELECT COUNT(*)::int FROM "User" 
    WHERE "createdAt" >= NOW() - INTERVAL '60 days' 
    AND "createdAt" < NOW() - INTERVAL '30 days'
    AND "isDeleted" = false
  ) as "newUsersPrevious30Days",
  (
    SELECT COUNT(*)::int FROM "Paper" 
    WHERE "createdAt" >= NOW() - INTERVAL '30 days'
    AND "isDeleted" = false
  ) as "newPapersLast30Days",
  (
    SELECT COUNT(*)::int FROM "Paper" 
    WHERE "createdAt" >= NOW() - INTERVAL '60 days' 
    AND "createdAt" < NOW() - INTERVAL '30 days'
    AND "isDeleted" = false
  ) as "newPapersPrevious30Days",
  (
    SELECT COALESCE(SUM(pf."sizeBytes"), 0)::int FROM "PaperFile" pf
    INNER JOIN "Paper" p ON pf."paperId" = p.id
    WHERE p."createdAt" >= NOW() - INTERVAL '30 days'
    AND pf."isDeleted" = false
    AND p."isDeleted" = false
  ) as "storageAddedLast30Days",
  (
    SELECT COALESCE(SUM(pf."sizeBytes"), 0)::int FROM "PaperFile" pf
    INNER JOIN "Paper" p ON pf."paperId" = p.id
    WHERE p."createdAt" >= NOW() - INTERVAL '60 days' 
    AND p."createdAt" < NOW() - INTERVAL '30 days'
    AND pf."isDeleted" = false
    AND p."isDeleted" = false
  ) as "storageAddedPrevious30Days";
