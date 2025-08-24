-- @param {String} $1:id
-- @param {String} $2:email  
-- @param {String} $3:name
-- @param {String} $4:image
-- @param {String} $5:role

INSERT INTO "User" (id, email, name, image, role, "createdAt", "updatedAt")
VALUES ($1, $2, $3, $4, $5::"Role", NOW(), NOW())
ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  image = EXCLUDED.image,
  "updatedAt" = NOW()
RETURNING id, email, name, image, role, "createdAt", "updatedAt", "isDeleted";
