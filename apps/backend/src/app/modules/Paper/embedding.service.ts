import prisma from "../../shared/prisma";
// NOTE: pgvector column is Unsupported("vector") in Prisma schema.
// Use parameterized raw queries and cast to ::vector to avoid SQL injection and ensure type correctness.

export const EMBEDDING_DIM = 1536; // adjust if model changes
const useVector =
  process.env.USE_PGVECTOR === "true" || process.env.USE_PGVECTOR === "1";

export async function saveChunkEmbedding(
  paperChunkId: string,
  embedding: number[]
) {
  if (!useVector) {
    throw new Error(
      "Vector operations disabled. Set USE_PGVECTOR=true to enable."
    );
  }
  if (embedding.length !== EMBEDDING_DIM) {
    throw new Error(
      `Embedding length ${embedding.length} != expected ${EMBEDDING_DIM}`
    );
  }
  // Build vector literal safely and cast
  const literal = "[" + embedding.join(",") + "]";
  await prisma.$executeRaw`
    UPDATE "PaperChunk" SET embedding = ${literal}::vector WHERE id = ${paperChunkId}
  `;
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
  if (!useVector) {
    return [];
  }
  if (queryEmbedding.length !== EMBEDDING_DIM) {
    throw new Error(
      `Query embedding length ${queryEmbedding.length} != expected ${EMBEDDING_DIM}`
    );
  }
  const literal = "[" + queryEmbedding.join(",") + "]";
  const rows = await prisma.$queryRaw<SimilarChunkResult[]>`
    SELECT id, "paperId", idx, page, content, (embedding <-> ${literal}::vector) AS distance
    FROM "PaperChunk"
    WHERE embedding IS NOT NULL
    ORDER BY embedding <-> ${literal}::vector
    LIMIT ${limit}
  `;
  return rows as SimilarChunkResult[];
}

export const embeddingService = {
  saveChunkEmbedding,
  searchSimilarChunks,
};
