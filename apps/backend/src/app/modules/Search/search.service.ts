import { Prisma } from "../../shared/prisma";
import prisma from "../../shared/prisma";
import { USER_ROLES } from "../Auth/auth.constant";

export type GlobalSearchType =
  | "all"
  | "papers"
  | "collections"
  | "workspaces"
  | "notes"
  | "people";

export class SearchService {
  /**
   * Global multi-entity search
   *
   * Phase D.1 — extended the `type` union to include "notes" and
   * "people". People search is ADMIN-only and scoped to the
   * requester's team members (users sharing a workspace with them);
   * non-admin roles silently receive an empty people result set.
   */
  static async globalSearch(
    userId: string,
    query: string,
    type: GlobalSearchType = "all",
    limit: number,
    skip: number,
    workspaceId?: string,
    role?: string
  ) {
    const results: Record<string, any> = {};

    const q = query.toLowerCase();

    // 1. Search Papers (trigram similarity for fast ILIKE-style search)
    if (type === "all" || type === "papers") {
      const workspaceFilter = workspaceId
        ? Prisma.sql`AND p."workspaceId" = ${workspaceId}`
        : Prisma.empty;

      // Access control: only papers the user uploaded, or that live in a
      // non-deleted workspace where they are owner or an active member.
      // Mirrors the access checks applied to collections/workspaces below
      // and the semantic search filter (uploaderId).
      const items = await prisma.$queryRaw<any[]>`
        SELECT
          p.id,
          p.title,
          p.abstract,
          p.metadata,
          p.source,
          p."workspaceId",
          p."createdAt",
          GREATEST(
            COALESCE(similarity(p.title, ${q}), 0),
            COALESCE(similarity(p.abstract, ${q}), 0)
          ) AS "matchScore"
        FROM "Paper" p
        WHERE p."isDeleted" = false
          AND (
            p.title % ${q}
            OR p.abstract % ${q}
          )
          AND (
            p."uploaderId" = ${userId}
            OR EXISTS (
              SELECT 1
              FROM "Workspace" w
              WHERE w.id = p."workspaceId"
                AND w."isDeleted" = false
                AND (
                  w."ownerId" = ${userId}
                  OR EXISTS (
                    SELECT 1 FROM "WorkspaceMember" wm
                    WHERE wm."workspaceId" = w.id
                      AND wm."userId" = ${userId}
                      AND wm."isDeleted" = false
                  )
                )
            )
          )
          ${workspaceFilter}
        ORDER BY "matchScore" DESC, p."createdAt" DESC
        LIMIT ${limit} OFFSET ${skip}
      `;

      const totalCount = await prisma.paper.count({
        where: {
          isDeleted: false,
          AND: [
            {
              OR: [
                { title: { contains: q, mode: "insensitive" } },
                { abstract: { contains: q, mode: "insensitive" } },
              ],
            },
            ...(workspaceId ? [{ workspaceId }] : []),
            {
              OR: [
                { uploaderId: userId },
                {
                  workspace: {
                    isDeleted: false,
                    OR: [
                      { ownerId: userId },
                      { members: { some: { userId, isDeleted: false } } },
                    ],
                  },
                },
              ],
            },
          ],
        },
      });

      results.papers = { total: totalCount, items };
    }

    // 2. Search Collections
    if (type === "all" || type === "collections") {
      const collAndConditions: Prisma.CollectionWhereInput[] = [
        { isDeleted: false },
        {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
          ]
        },
        {
          OR: [
            { ownerId: userId },
            { members: { some: { userId, isDeleted: false } } },
            { isPublic: true }
          ]
        }
      ];

      if (workspaceId) {
        collAndConditions.push({ workspaceId });
      }

      const finalCollectionWhere: Prisma.CollectionWhereInput = {
         AND: collAndConditions
      };


      const [totalCount, items] = await Promise.all([
        prisma.collection.count({ where: finalCollectionWhere }),
        prisma.collection.findMany({
          where: finalCollectionWhere,
          take: limit,
          skip,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            name: true,
            description: true,
            isPublic: true,
            workspaceId: true,
          }
        }),
      ]);
      results.collections = { total: totalCount, items };
    }

    // 3. Search Workspaces
    if (type === "all" || type === "workspaces") {
      const workspaceWhere: Prisma.WorkspaceWhereInput = {
        AND: [
          { isDeleted: false },
          {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
            ]
          },
          {
            OR: [
              { ownerId: userId },
              { members: { some: { userId, isDeleted: false } } }
            ]
          }
        ]
      };

      const [totalCount, items] = await Promise.all([
        prisma.workspace.count({ where: workspaceWhere }),
        prisma.workspace.findMany({
          where: workspaceWhere,
          take: limit,
          skip,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            name: true,
            description: true,
          }
        }),
      ]);
      results.workspaces = { total: totalCount, items };
    }

    // 4. Search Notes (Phase 6 ResearchNote)
    if (type === "all" || type === "notes") {
      const noteWhere: Prisma.ResearchNoteWhereInput = {
        isDeleted: false,
        userId,
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { content: { contains: q, mode: "insensitive" } },
        ],
      };
      const [totalCount, items] = await Promise.all([
        prisma.researchNote.count({ where: noteWhere }),
        prisma.researchNote.findMany({
          where: noteWhere,
          take: limit,
          skip,
          orderBy: { updatedAt: "desc" },
          select: {
            id: true,
            title: true,
            excerpt: true,
            noteType: true,
            visibility: true,
            updatedAt: true,
          },
        }),
      ]);
      results.notes = { total: totalCount, items };
    }

    // 5. Search People (Users) — ADMIN only, scoped to the admin's team
    // members (users sharing a workspace with them). Non-admins get an
    // empty result set — never a 403 — because the "all" search runs
    // every branch in a single request.
    if (type === "all" || type === "people") {
      if (role !== USER_ROLES.ADMIN) {
        results.people = { total: 0, items: [] };
      } else {
        const myWorkspaceIds = await prisma.workspace.findMany({
          where: {
            isDeleted: false,
            OR: [
              { ownerId: userId },
              { members: { some: { userId, isDeleted: false } } },
            ],
          },
          select: { id: true },
        });

        // Team members only: exclude soft-deleted users and self, never
        // expose the password hash.
        const peopleWhere: Prisma.UserWhereInput = {
          isDeleted: false,
          id: { not: userId },
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
            { firstName: { contains: q, mode: "insensitive" } },
            { lastName: { contains: q, mode: "insensitive" } },
          ],
          memberships: {
            some: {
              workspaceId: { in: myWorkspaceIds.map((w) => w.id) },
              isDeleted: false,
            },
          },
        };

        const [totalCount, items] = await Promise.all([
          prisma.user.count({ where: peopleWhere }),
          prisma.user.findMany({
            where: peopleWhere,
            take: limit,
            skip,
            orderBy: { name: "asc" },
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              role: true,
              institution: true,
            },
          }),
        ]);
        results.people = { total: totalCount, items };
      }
    }

    // Determine the total results sum
    let aggregateTotal = 0;
    if (results.papers) aggregateTotal += results.papers.total;
    if (results.collections) aggregateTotal += results.collections.total;
    if (results.workspaces) aggregateTotal += results.workspaces.total;
    if (results.notes) aggregateTotal += results.notes.total;
    if (results.people) aggregateTotal += results.people.total;

    return {
      results,
      meta: { limit, skip, total: aggregateTotal },
    };
  }

  /**
   * Save a search query to history
   */
  static async saveSearchQuery(
    userId: string,
    query: string,
    filters?: any,
    searchResultsSummary?: any
  ) {
    if (!query || query.trim().length === 0) return null;
    
    return prisma.searchHistory.create({
      data: {
        userId,
        query: query.trim(),
        filters: filters || null,
        results: searchResultsSummary || null,
      }
    });
  }

  /**
   * Get search history for a user
   */
  static async getSearchHistory(
    userId: string,
    limit: number,
    skip: number
  ) {
    const where: Prisma.SearchHistoryWhereInput = {
      userId,
      isDeleted: false
    };

    const [total, data] = await Promise.all([
      prisma.searchHistory.count({ where }),
      prisma.searchHistory.findMany({
        where,
        take: limit,
        skip,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return {
      meta: { total, skip, limit },
      result: data,
    };
  }

  /**
   * Get top sources (papers + collections + workspaces) for a query.
   * Used by the AI summary endpoint to attach citations.
   */
  static async getTopSources(
    userId: string,
    query: string,
    limit: number,
    workspaceId?: string,
    role?: string
  ): Promise<
    Array<{
      id: string;
      type: "paper" | "collection" | "workspace";
      title: string;
      description?: string | null;
      href: string;
    }>
  > {
    // Re-use globalSearch for the three core categories.
    const result = await SearchService.globalSearch(
      userId,
      query,
      "all",
      limit,
      0,
      workspaceId,
      role
    );

    const out: Array<{
      id: string;
      type: "paper" | "collection" | "workspace";
      title: string;
      description?: string | null;
      href: string;
    }> = [];

    for (const p of result.results.papers?.items ?? []) {
      out.push({
        id: p.id,
        type: "paper",
        title: p.title ?? "Untitled paper",
        description: p.abstract ?? null,
        href: `/dashboard/papers/${p.id}`,
      });
    }
    for (const c of result.results.collections?.items ?? []) {
      out.push({
        id: c.id,
        type: "collection",
        title: c.name ?? "Untitled collection",
        description: c.description ?? null,
        href: `/dashboard/collections/${c.id}`,
      });
    }
    for (const w of result.results.workspaces?.items ?? []) {
      out.push({
        id: w.id,
        type: "workspace",
        title: w.name ?? "Untitled workspace",
        description: w.description ?? null,
        href: `/dashboard/workspaces/${w.id}`,
      });
    }

    return out.slice(0, limit);
  }

  /**
   * Summarize a query using OpenAI with the top internal sources
   * attached as citations. Returns a short prose summary plus the
   * source list. Used by the global search Perplexity-style AI panel.
   *
   * Implementation note: uses raw fetch against the OpenAI Chat
   * Completions API (no streaming) so this code path has no SDK
   * dependency. If OPENAI_API_KEY is missing, returns a
   * deterministic stub summary that points at the sources so the
   * UI still renders a useful response.
   */
  static async aiSummarize(
    userId: string,
    query: string,
    workspaceId?: string,
    model = "gpt-4o-mini",
    role?: string
  ): Promise<{
    summary: string;
    sources: Array<{
      id: string;
      type: "paper" | "collection" | "workspace";
      title: string;
      href: string;
    }>;
    fallback: string | null;
  }> {
    const sources = await SearchService.getTopSources(userId, query, 5, workspaceId, role);

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return {
        summary: `AI summary is unavailable because the backend has no OPENAI_API_KEY configured. Here are the top matching results instead.\n\nQuery: "${query}"`,
        sources: sources.map((s) => ({
          id: s.id,
          type: s.type,
          title: s.title,
          href: s.href,
        })),
        fallback: "OPENAI_KEY_MISSING",
      };
    }

    try {
      const contextLines = sources
        .map(
          (s, i) =>
            `[${i + 1}] (${s.type}) ${s.title}${
              s.description ? ` — ${String(s.description).slice(0, 200)}` : ""
            }`
        )
        .join("\n");

      const prompt = `You are a research assistant. Summarize the following internal sources to answer the user's query in 2-4 sentences. Use the numbered citations inline (e.g., [1], [2]). Do not invent sources.\n\nSources:\n${contextLines}\n\nQuery: ${query}\n\nSummary:`;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000);
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: "You answer research questions using only the provided sources." },
            { role: "user", content: prompt },
          ],
          max_tokens: 500,
          temperature: 0.2,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!response.ok) {
        return {
          summary: `AI summary failed (OpenAI returned ${response.status}). Showing top matching results instead.`,
          sources: sources.map((s) => ({
            id: s.id,
            type: s.type,
            title: s.title,
            href: s.href,
          })),
          fallback: "OPENAI_REQUEST_FAILED",
        };
      }

      const data = (await response.json()) as {
        choices: Array<{ message: { content: string } }>;
      };
      const summary =
        data.choices?.[0]?.message?.content?.trim() ??
        "No summary could be generated.";
      return {
        summary,
        sources: sources.map((s) => ({
          id: s.id,
          type: s.type,
          title: s.title,
          href: s.href,
        })),
        fallback: null,
      };
    } catch {
      return {
        summary: `AI summary failed (network error). Showing top matching results instead.`,
        sources: sources.map((s) => ({
          id: s.id,
          type: s.type,
          title: s.title,
          href: s.href,
        })),
        fallback: "OPENAI_REQUEST_FAILED",
      };
    }
  }
  
  /**
   * Get trending papers for a user (papers they can access, newest first).
   * Access scope: own uploads, or papers in a non-deleted workspace where
   * the user is owner or an active member. Never leaks rows from
   * workspaces the user cannot see.
   */
  static async getTrendingPapers(userId: string, limit: number) {
    return prisma.paper.findMany({
      where: {
        isDeleted: false,
        OR: [
          { uploaderId: userId },
          {
            workspace: {
              isDeleted: false,
              OR: [
                { ownerId: userId },
                { members: { some: { userId, isDeleted: false } } },
              ],
            },
          },
        ],
      },
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        abstract: true,
        source: true,
        createdAt: true,
      },
    });
  }

  /**
   * Get personalized recommendations — papers the user can access,
   * newest first. Same access scope as getTrendingPapers.
   */
  static async getRecommendations(userId: string, limit: number) {
    return prisma.paper.findMany({
      where: {
        isDeleted: false,
        OR: [
          { uploaderId: userId },
          {
            workspace: {
              isDeleted: false,
              OR: [
                { ownerId: userId },
                { members: { some: { userId, isDeleted: false } } },
              ],
            },
          },
        ],
      },
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        abstract: true,
        source: true,
        createdAt: true,
      },
    });
  }

  /**
   * Semantic vector search across paper chunks (pgvector).
   * Generates query embedding via OpenAI, then L2 distance search.
   */
  static async semanticSearch(
    userId: string,
    query: string,
    limit = 10,
    workspaceId?: string
  ) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return { results: [], fallback: "OPENAI_KEY_MISSING" };
    }

    // 1. Generate query embedding
    let queryVector: number[];
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(
        "https://api.openai.com/v1/embeddings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "text-embedding-3-small",
            input: query.trim().slice(0, 8000),
          }),
          signal: controller.signal,
        }
      );
      clearTimeout(timeout);

      if (!response.ok) {
        return { results: [], fallback: "EMBEDDING_FAILED" };
      }

      const data = (await response.json()) as {
        data: Array<{ embedding: number[] }>;
      };
      queryVector = data.data[0]?.embedding;
      if (!queryVector || queryVector.length !== 1536) {
        return { results: [], fallback: "EMBEDDING_FAILED" };
      }
    } catch {
      return { results: [], fallback: "EMBEDDING_FAILED" };
    }

    // 2. Vector similarity search
    const vectorStr = `[${queryVector.join(",")}]`;

    const workspaceFilter = workspaceId
      ? Prisma.sql`AND p."workspaceId" = ${workspaceId}`
      : Prisma.empty;

    const results = await prisma.$queryRaw<
      Array<{
        id: string;
        paperId: string;
        idx: number;
        page: number | null;
        content: string;
        distance: number;
        title: string | null;
      }>
    >`
      SELECT
        c.id,
        c."paperId",
        c.idx,
        c.page,
        c.content,
        c.embedding <-> ${vectorStr}::vector AS distance,
        p.title
      FROM "PaperChunk" c
      JOIN "Paper" p ON p.id = c."paperId"
        AND p."isDeleted" = false
        AND p."uploaderId" = ${userId}
        ${workspaceFilter}
      WHERE c.embedding IS NOT NULL
        AND c."isDeleted" = false
      ORDER BY c.embedding <-> ${vectorStr}::vector
      LIMIT ${limit}
    `;

    return { results, fallback: null };
  }
}

