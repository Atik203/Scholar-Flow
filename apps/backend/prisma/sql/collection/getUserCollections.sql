-- Get user collections with paper count
-- @param {String} $1:userId

SELECT 
  c.id,
  c.name,
  c.description,
  c."isPublic",
  c."createdAt",
  c."updatedAt",
  COUNT(cp.id) as "paperCount"
FROM "Collection" c
LEFT JOIN "CollectionPaper" cp ON c.id = cp."collectionId"
WHERE c."ownerId" = $1 AND c."isDeleted" = false
GROUP BY c.id
ORDER BY c."createdAt" DESC;
