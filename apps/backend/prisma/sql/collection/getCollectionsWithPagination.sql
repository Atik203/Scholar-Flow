-- Get all collections with pagination
-- @param {Int} $1:limit
-- @param {Int} $2:skip

SELECT 
  c.id,
  c.name,
  c.description,
  c."isPublic",
  c."createdAt",
  c."updatedAt",
  u.email as "ownerEmail",
  COUNT(cp.id) as "paperCount"
FROM "Collection" c
LEFT JOIN "User" u ON c."ownerId" = u.id
LEFT JOIN "CollectionPaper" cp ON c.id = cp."collectionId"
WHERE c."isDeleted" = false
GROUP BY c.id, u.email
ORDER BY c."createdAt" DESC
LIMIT $1 OFFSET $2;
