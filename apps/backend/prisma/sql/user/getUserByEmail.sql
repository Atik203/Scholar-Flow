-- @param {String} $1:email

SELECT id, email, name, image, role, "createdAt", "updatedAt", "isDeleted"
FROM "User"
WHERE email = $1 AND "isDeleted" = false;
