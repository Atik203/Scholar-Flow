export declare const EMBEDDING_DIM = 1536;
export declare function saveChunkEmbedding(paperChunkId: string, embedding: number[]): Promise<void>;
export interface SimilarChunkResult {
    id: string;
    paperId: string;
    idx: number;
    page: number | null;
    content: string;
    distance: number;
}
export declare function searchSimilarChunks(queryEmbedding: number[], limit?: number): Promise<SimilarChunkResult[]>;
export declare const embeddingService: {
    saveChunkEmbedding: typeof saveChunkEmbedding;
    searchSimilarChunks: typeof searchSimilarChunks;
};
//# sourceMappingURL=embedding.service.d.ts.map