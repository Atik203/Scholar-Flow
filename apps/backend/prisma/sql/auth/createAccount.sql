-- @param {String} $1:userId
-- @param {String} $2:type
-- @param {String} $3:provider
-- @param {String} $4:providerAccountId
-- @param {String} $5:refreshToken
-- @param {String} $6:accessToken
-- @param {Int} $7:expiresAt
-- @param {String} $8:tokenType
-- @param {String} $9:scope
-- @param {String} $10:idToken

INSERT INTO "Account" (
  "userId", 
  "type", 
  "provider", 
  "providerAccountId", 
  "refresh_token", 
  "access_token", 
  "expires_at", 
  "token_type", 
  "scope", 
  "id_token",
  "session_state",
  "createdAt", 
  "updatedAt"
)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NULL, NOW(), NOW())
ON CONFLICT ("provider", "providerAccountId") DO UPDATE SET
  "refresh_token" = EXCLUDED."refresh_token",
  "access_token" = EXCLUDED."access_token",
  "expires_at" = EXCLUDED."expires_at",
  "token_type" = EXCLUDED."token_type",
  "scope" = EXCLUDED."scope",
  "id_token" = EXCLUDED."id_token",
  "session_state" = EXCLUDED."session_state",
  "updatedAt" = NOW()
RETURNING id, "userId", "provider", "providerAccountId", "createdAt";
