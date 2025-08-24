-- Returns a page of users with basic fields
-- @param {Int} $1:limit Number of records to return
-- @param {Int} $2:skip Number of records to skip (offset)
SELECT
  u.id,
  u.email,
  u.role,
  u."createdAt",
  u."updatedAt"
FROM "User" u
WHERE u."isDeleted" = false
ORDER BY u."createdAt" DESC
LIMIT $1 OFFSET $2;
