-- Returns nearest paper chunks by embedding (L2 distance)
-- @param {Json} $1:query_embedding Embedding vector as JSON array (will be cast)
-- @param {Int} $2:limit Number of rows to return
-- NOTE: Requires pgvector extension. Casting JSON to vector assumes text '[]' style; ensure upstream uses correct format.
SELECT
  pc.id,
  pc."paperId",
  pc.idx,
  pc.page,
  pc.content,
  (pc.embedding <-> CAST($1::json->>'vector' AS vector)) AS distance
FROM "PaperChunk" pc
WHERE pc.embedding IS NOT NULL
ORDER BY pc.embedding <-> CAST($1::json->>'vector' AS vector)
LIMIT $2;
