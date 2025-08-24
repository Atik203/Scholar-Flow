-- Count total papers
SELECT
    COUNT(*) as total
FROM
    "Paper" p
WHERE
    p."isDeleted" = false;