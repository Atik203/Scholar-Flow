-- @param {String} $1:id

SELECT id, email, name, image, role, "createdAt", "updatedAt", "isDeleted"
FROM "User"
WHERE id = $1 AND "isDeleted" = false;
