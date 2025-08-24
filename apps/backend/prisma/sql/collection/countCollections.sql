-- Count total collections
SELECT
    COUNT(*) as total
FROM
    "Collection" c
WHERE
    c."isDeleted" = false;