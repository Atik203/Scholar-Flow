-- @param {String} $1:sessionToken

SELECT s.id, s."sessionToken", s."userId", s."expires", s."createdAt",
       u.id as "user_id", u.email, u.name, u.image, u.role
FROM "Session" s
JOIN "User" u ON s."userId" = u.id
WHERE s."sessionToken" = $1 
  AND s."expires" > NOW() 
  AND u."isDeleted" = false 
  AND s."isDeleted" = false;
