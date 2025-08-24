-- @param {String} $1:sessionToken

UPDATE "Session" 
SET "isDeleted" = true, "updatedAt" = NOW()
WHERE "sessionToken" = $1;
