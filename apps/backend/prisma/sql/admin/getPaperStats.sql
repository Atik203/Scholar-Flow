-- Get paper processing statistics
-- @name getPaperStats
SELECT
  COUNT(*)::int as "totalPapers",
  COUNT(*) FILTER (WHERE "processingStatus" = 'PROCESSING')::int as "processingPapers",
  COUNT(*) FILTER (WHERE "processingStatus" = 'PROCESSED')::int as "completedPapers",
  COUNT(*) FILTER (WHERE "processingStatus" = 'FAILED')::int as "failedPapers",
  COALESCE(AVG(
    CASE 
      WHEN "processingStatus" = 'PROCESSED' AND "processedAt" IS NOT NULL 
      THEN EXTRACT(EPOCH FROM ("processedAt" - "createdAt"))
      ELSE NULL
    END
  ), 0)::int as "averageProcessingTime"
FROM "Paper"
WHERE "isDeleted" = false;
