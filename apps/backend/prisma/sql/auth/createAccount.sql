-- @param {String} $1:id
-- @param {String} $2:userId
-- @param {String} $3:type
-- @param {String} $4:provider
-- @param {String} $5:providerAccountId
-- @param {String} $6:refreshToken
-- @param {String} $7:accessToken
-- @param {Int} $8:expiresAt
-- @param {String} $9:tokenType
-- @param {String} $10:scope
-- @param {String} $11:idToken
-- @param {String} $12:sessionState

INSERT INTO "Account" (
  "id",
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
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW())
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
