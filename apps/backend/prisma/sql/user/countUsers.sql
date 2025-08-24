-- Counts users for pagination meta (mirrors filters in getUsersWithPagination if extended)
SELECT COUNT(*)::int AS total
FROM "User" u
WHERE u."isDeleted" = false;
