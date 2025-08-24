"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.embeddingService = exports.EMBEDDING_DIM = void 0;
exports.saveChunkEmbedding = saveChunkEmbedding;
exports.searchSimilarChunks = searchSimilarChunks;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
exports.EMBEDDING_DIM = 1536;
const useVector = process.env.USE_PGVECTOR === "true" || process.env.USE_PGVECTOR === "1";
async function saveChunkEmbedding(paperChunkId, embedding) {
    if (!useVector) {
        throw new Error("Vector operations disabled. Set USE_PGVECTOR=true to enable.");
    }
    if (embedding.length !== exports.EMBEDDING_DIM) {
        throw new Error(`Embedding length ${embedding.length} != expected ${exports.EMBEDDING_DIM}`);
    }
    const literal = "[" + embedding.join(",") + "]";
    await prisma_1.default.$executeRaw `
    UPDATE "PaperChunk" SET embedding = ${literal}::vector WHERE id = ${paperChunkId}
  `;
}
async function searchSimilarChunks(queryEmbedding, limit = 10) {
    if (!useVector) {
        return [];
    }
    if (queryEmbedding.length !== exports.EMBEDDING_DIM) {
        throw new Error(`Query embedding length ${queryEmbedding.length} != expected ${exports.EMBEDDING_DIM}`);
    }
    const literal = "[" + queryEmbedding.join(",") + "]";
    const rows = await prisma_1.default.$queryRaw `
    SELECT id, "paperId", idx, page, content, (embedding <-> ${literal}::vector) AS distance
    FROM "PaperChunk"
    WHERE embedding IS NOT NULL
    ORDER BY embedding <-> ${literal}::vector
    LIMIT ${limit}
  `;
    return rows;
}
exports.embeddingService = {
    saveChunkEmbedding,
    searchSimilarChunks,
};
//# sourceMappingURL=embedding.service.js.map