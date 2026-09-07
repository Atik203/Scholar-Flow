import cron from "node-cron";
import prisma from "../shared/prisma";
import { documentExtractionService } from "./documentExtractionService";

/**
 * Embedding backfill sweep
 *
 * Embeddings are generated fire-and-forget after extraction. A transient
 * OpenAI failure leaves chunks permanently unsearchable (no retry path).
 * This hourly sweep finds PROCESSED papers with unembedded chunks and
 * re-runs embedding generation for them.
 *
 * Runs hourly. Gated on OPENAI_API_KEY + USE_PGVECTOR=true (same guards as
 * the generator itself).
 */

const logDebug = (...args: unknown[]) => {
  if (process.env.NODE_ENV !== "production") {
    console.log("[EmbeddingBackfill]", ...args);
  }
};

const findPapersNeedingEmbeddings = async (
  limit: number
): Promise<Array<{ id: string }>> => {
  return prisma.$queryRaw<Array<{ id: string }>>`
    SELECT DISTINCT c."paperId" AS id
    FROM "PaperChunk" c
    JOIN "Paper" p ON p.id = c."paperId"
    WHERE p."processingStatus" = 'PROCESSED'
      AND p."isDeleted" = false
      AND c."isDeleted" = false
      AND c.embedding IS NULL
    LIMIT ${limit}
  `;
};

export const runEmbeddingBackfill = async (limit = 10): Promise<number> => {
  if (!process.env.OPENAI_API_KEY || process.env.USE_PGVECTOR !== "true") {
    return 0;
  }

  const papers = await findPapersNeedingEmbeddings(limit);

  for (const paper of papers) {
    try {
      await documentExtractionService.generateEmbeddingsForPaper(paper.id);
      logDebug(`Backfilled embeddings for paper ${paper.id}`);
    } catch (error) {
      console.error(
        `[EmbeddingBackfill] Failed for paper ${paper.id}:`,
        error instanceof Error ? error.message : error
      );
    }
  }

  if (papers.length > 0) {
    logDebug(`Backfill pass complete: ${papers.length} paper(s) processed`);
  }

  return papers.length;
};

let backfillStarted = false;

export const startEmbeddingBackfill = (): void => {
  if (backfillStarted || process.env.VERCEL === "1") {
    return;
  }

  // Hourly at minute 15 (after the subscription sweeper at minute 5)
  cron.schedule("15 * * * *", () => {
    runEmbeddingBackfill().catch((error) => {
      console.error("[EmbeddingBackfill] Backfill run failed:", error);
    });
  });

  backfillStarted = true;
  logDebug("Embedding backfill sweeper started (hourly)");
};
