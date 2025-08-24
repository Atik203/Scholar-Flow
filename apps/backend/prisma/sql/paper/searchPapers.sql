-- Search papers by title, authors, or content with similarity scoring
-- @param {String} $1:searchTerm

SELECT 
  p.id,
  p.title,
  p.authors,
  p."fileName",
  p."uploadedAt",
  u.email as "uploaderEmail",
  -- Calculate relevance score based on multiple factors
  (
    CASE 
      WHEN p.title ILIKE '%' || $1 || '%' THEN 10 
      ELSE 0 
    END +
    CASE 
      WHEN p.authors ILIKE '%' || $1 || '%' THEN 8 
      ELSE 0 
    END +
    CASE 
      WHEN p."extractedText" ILIKE '%' || $1 || '%' THEN 5 
      ELSE 0 
    END
  ) as relevance_score
FROM "Paper" p
LEFT JOIN "User" u ON p."uploaderId" = u.id
WHERE 
  p."isDeleted" = false
  AND (
    p.title ILIKE '%' || $1 || '%' 
    OR p.authors ILIKE '%' || $1 || '%' 
    OR p."extractedText" ILIKE '%' || $1 || '%'
  )
ORDER BY relevance_score DESC, p."createdAt" DESC;
