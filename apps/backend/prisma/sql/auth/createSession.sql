-- @param {String} $1:sessionToken
-- @param {String} $2:userId
-- @param {String} $3:expires

INSERT INTO "Session" ("sessionToken", "userId", "expires", "createdAt", "updatedAt")
VALUES ($1, $2, $3::timestamp, NOW(), NOW())
RETURNING id, "sessionToken", "userId", "expires", "createdAt";
