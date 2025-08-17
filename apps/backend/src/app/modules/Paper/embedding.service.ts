import prisma from "../../../shared/prisma";
// NOTE: pgvector column is Unsupported("vector") in Prisma schema.
// We insert using raw SQL because Prisma Client does not yet expose helpers for vector literal.

export const EMBEDDING_DIM = 1536; // adjust if model changes

export async function saveChunkEmbedding(
  paperChunkId: string,
  embedding: number[]
) {
  if (embedding.length !== EMBEDDING_DIM) {
    throw new Error(
      `Embedding length ${embedding.length} != expected ${EMBEDDING_DIM}`
    );
  }
  // Build vector literal: '[' || comma separated floats || ']'
  const literal = "[" + embedding.join(",") + "]";
  await prisma.$executeRawUnsafe(
    `UPDATE "PaperChunk" SET embedding = $1 WHERE id = $2`,
    literal,
    paperChunkId
  );
}

export interface SimilarChunkResult {
  id: string;
  paperId: string;
  idx: number;
  page: number | null;
  content: string;
  distance: number;
}

export async function searchSimilarChunks(
  queryEmbedding: number[],
  limit = 10
): Promise<SimilarChunkResult[]> {
  if (queryEmbedding.length !== EMBEDDING_DIM) {
    throw new Error(
      `Query embedding length ${queryEmbedding.length} != expected ${EMBEDDING_DIM}`
    );
  }
  const literal = "[" + queryEmbedding.join(",") + "]";
  const rows = await prisma.$queryRawUnsafe<any[]>(
    `SELECT id, "paperId", idx, page, content, (embedding <-> $1) AS distance
     FROM "PaperChunk"
     WHERE embedding IS NOT NULL
     ORDER BY embedding <-> $1
     LIMIT $2`,
    literal,
    limit
  );
  return rows as SimilarChunkResult[];
}

export const embeddingService = {
  saveChunkEmbedding,
  searchSimilarChunks,
};
