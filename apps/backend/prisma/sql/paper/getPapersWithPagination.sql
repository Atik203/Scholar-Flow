-- Get papers with metadata and chunk count
-- @param {Int} $1:limit
-- @param {Int} $2:skip

SELECT 
  p.id,
  p.title,
  p.authors,
  p."fileName",
  p."fileSize",
  p."uploadedAt",
  p."extractedText",
  p."createdAt",
  u.email as "uploaderEmail",
  COUNT(pc.id) as "chunkCount"
FROM "Paper" p
LEFT JOIN "User" u ON p."uploaderId" = u.id
LEFT JOIN "PaperChunk" pc ON p.id = pc."paperId"
WHERE p."isDeleted" = false
GROUP BY p.id, u.email
ORDER BY p."createdAt" DESC
LIMIT $1 OFFSET $2;
