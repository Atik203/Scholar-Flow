// phase-4/collection-suggestions — src/app/modules/Recommendation/recommendation.service.sql

import prisma from "../../shared/prisma";
import { aiService } from "../AI/ai.service";

export interface SuggestedCollection {
  name: string;
  description: string;
  paperCount: number;
  topics: string[];
  relevanceScore: number;
}

export interface SuggestedPaper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  abstract: string;
  reason: string;
  similarity: number;
  tags: string[];
}

export interface RecommendedPaper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  topic: string;
  citationCount: number;
}

export class RecommendationService {
  /**
   * GET /collections/suggested
   * Given the user's papers, suggest collection groupings using AI.
   * Falls back to tag-based clustering if AI is unavailable.
   */
  static async getSuggestedCollections(userId: string, limit = 5): Promise<SuggestedCollection[]> {
    const userPapers = await prisma.$queryRaw<Array<{ title: string; tags: string[]; abstract: string | null }>>`
      SELECT p.title, p.tags, p.abstract
      FROM "Paper" p
      WHERE p."uploaderId" = ${userId} AND p."isDeleted" = false
      ORDER BY p."createdAt" DESC
      LIMIT 50
    `;

    if (!userPapers.length) {
      return [];
    }

    // Try AI first, fall back to tag clustering
    try {
      const titles = userPapers.map((p) => p.title).filter(Boolean);
      const tags = [...new Set(userPapers.flatMap((p) => p.tags || []))].slice(0, 20);

      const prompt = [
        "You are a research librarian. Given these paper titles and tags, suggest",
        `${limit} logical collection groupings. Return ONLY a JSON array of objects`,
        'with keys: name, description, topics (array of strings), relevanceScore (0-100).',
        "",
        "Paper titles:",
        ...titles.map((t, i) => `${i + 1}. ${t}`),
        "",
        tags.length ? `Existing tags: ${tags.join(", ")}` : "",
      ].join("\n");

      const result = await aiService.generateSummary({
        paperId: userId,
        text: prompt,
        instructions: "Group these papers into logical collections",
        wordLimit: 300,
        workspaceId: null as any,
        uploaderId: userId,
      });

      // Parse the summary as JSON
      const jsonMatch = result.summary.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]) as SuggestedCollection[];
        return parsed.slice(0, limit);
      }
    } catch (e) {
      // Fall through to heuristic
    }

    // Heuristic: tag-based clustering
    return tagBasedClustering(userPapers, limit);
  }

  /**
   * GET /collections/:id/suggestions
   * Given a collection, suggest papers from the user's library that would fit.
   */
  static async getCollectionSuggestions(
    collectionId: string,
    userId: string,
    limit = 5
  ): Promise<SuggestedPaper[]> {
    // Get collection's papers and tags
    const collectionPapers = await prisma.$queryRaw<
      Array<{ id: string; title: string; tags: string[]; abstract: string | null }>
    >`
      SELECT p.id, p.title, p.tags, p.abstract
      FROM "CollectionPaper" cp
      JOIN "Paper" p ON p.id = cp."paperId"
      WHERE cp."collectionId" = ${collectionId}
        AND cp."isDeleted" = false AND p."isDeleted" = false
      LIMIT 30
    `;

    if (!collectionPapers.length) {
      return [];
    }

    const collectionTags = [...new Set(collectionPapers.flatMap((p) => p.tags || []))];

    // Get user's papers NOT already in this collection
    const userPapers = await prisma.$queryRaw<
      Array<{ id: string; title: string; tags: string[]; abstract: string | null; year: number }>
    >`
      SELECT p.id, p.title, p.tags, p.abstract,
             COALESCE((p.metadata->>'year')::int, 2024) as year
      FROM "Paper" p
      WHERE p."uploaderId" = ${userId}
        AND p."isDeleted" = false
        AND p.id NOT IN (
          SELECT "paperId" FROM "CollectionPaper"
          WHERE "collectionId" = ${collectionId} AND "isDeleted" = false
        )
      ORDER BY p."createdAt" DESC
      LIMIT 50
    `;

    if (!userPapers.length) {
      return [];
    }

    // Tag overlap scoring
    return userPapers
      .map((paper) => {
        const paperTags = (paper.tags || []).map((t) => t.toLowerCase());
        const overlap = collectionTags.filter((ct) =>
          paperTags.includes(ct.toLowerCase())
        );
        return {
          id: paper.id,
          title: paper.title,
          authors: [],
          year: paper.year || 2024,
          abstract: paper.abstract || "",
          reason: overlap.length > 0
            ? `Shares tags: ${overlap.slice(0, 3).join(", ")}`
            : "In your library",
          similarity: Math.min(100, overlap.length * 25 + 5),
          tags: paper.tags || [],
        };
      })
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);
  }

  /**
   * GET /papers/recommended
   * During collection creation, recommend papers based on tags/topics.
   */
  static async getRecommendedPapers(userId: string, topics?: string[], limit = 10): Promise<RecommendedPaper[]> {
    const userPapers = await prisma.$queryRaw<
      Array<{ id: string; title: string; tags: string[]; year: number; citationCount: number }>
    >`
      SELECT p.id, p.title, p.tags,
             COALESCE((p.metadata->>'year')::int, 2024) as year,
             p."citationCount"
      FROM "Paper" p
      WHERE p."uploaderId" = ${userId} AND p."isDeleted" = false
      ORDER BY p."createdAt" DESC
      LIMIT 100
    `;

    if (!topics || !topics.length) {
      return userPapers.slice(0, limit).map((p) => ({
        id: p.id,
        title: p.title,
        authors: [],
        year: p.year,
        topic: (p.tags || [])[0] || "General",
        citationCount: p.citationCount || 0,
      }));
    }

    // Score by topic overlap
    const scored = userPapers
      .map((paper) => {
        const paperTags = (paper.tags || []).map((t) => t.toLowerCase());
        const topicLower = topics.map((t) => t.toLowerCase());
        const matchCount = topicLower.filter((t) =>
          paperTags.some((pt) => pt.includes(t) || t.includes(pt))
        ).length;
        const bestTopic = topics.find(
          (t) =>
            paperTags.includes(t.toLowerCase()) ||
            paper.title.toLowerCase().includes(t.toLowerCase())
        ) || topics[0];

        return {
          id: paper.id,
          title: paper.title,
          authors: [],
          year: paper.year,
          topic: bestTopic,
          citationCount: paper.citationCount || 0,
          _score: matchCount,
        };
      })
      .sort((a, b) => b._score - a._score);

    return scored.slice(0, limit);
  }
}

function tagBasedClustering(
  papers: Array<{ title: string; tags: string[]; abstract: string | null }>,
  limit: number
): SuggestedCollection[] {
  const tagFreq = new Map<string, number>();
  for (const p of papers) {
    for (const t of p.tags || []) {
      tagFreq.set(t, (tagFreq.get(t) || 0) + 1);
    }
  }

  const topTags = [...tagFreq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit * 2);

  const groups = new Map<string, { titles: string[]; count: number }>();
  for (const p of papers) {
    const pTags = (p.tags || []).map((t) => t.toLowerCase());
    for (const [tag] of topTags) {
      if (pTags.includes(tag.toLowerCase())) {
        const g = groups.get(tag) || { titles: [], count: 0 };
        g.titles.push(p.title);
        g.count++;
        groups.set(tag, g);
      }
    }
  }

  return topTags.slice(0, limit).map(([tag, freq]) => {
    const g = groups.get(tag);
    return {
      name: `${tag} Papers`,
      description: `Curated collection of papers related to ${tag}`,
      paperCount: g?.count || 0,
      topics: [tag],
      relevanceScore: Math.min(100, freq * 10),
    };
  });
}

export const recommendationService = {
  getSuggestedCollections: RecommendationService.getSuggestedCollections,
  getCollectionSuggestions: RecommendationService.getCollectionSuggestions,
  getRecommendedPapers: RecommendationService.getRecommendedPapers,
};
