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

/**
 * Discovery feed item — either a platform paper (kind "platform", points at
 * /dashboard/papers/[paperId]) or a live external record from arXiv/OpenAlex
 * (kind "external", opens externalUrl).
 */
export interface DiscoveryItem {
  kind: "platform" | "external";
  /** Platform paper id (platform items) or a stable external id (DOI/arXiv). */
  id: string;
  paperId?: string;
  externalUrl?: string;
  title: string;
  abstract?: string | null;
  source?: string | null;
  citationCount?: number | null;
  publishedAt?: string | null;
  authors?: string[];
  reason?: string;
}

/**
 * Live external APIs (arXiv export API + OpenAlex) are free, keyless, and
 * rate-friendly — but must NEVER be hammered per request. Module-level TTL
 * cache keeps each feed at most one upstream call per 10 minutes.
 */
const EXTERNAL_CACHE_TTL_MS = 10 * 60 * 1000;
const EXTERNAL_FETCH_TIMEOUT_MS = 10000;
const externalCache = new Map<string, { at: number; data: unknown }>();

function decodeXmlEntities(input: string): string {
  return input
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, code: string) =>
      String.fromCharCode(parseInt(code, 10))
    );
}

async function fetchWithTimeout(
  url: string,
  timeoutMs = EXTERNAL_FETCH_TIMEOUT_MS,
  headers?: Record<string, string>
): Promise<Response | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal, headers });
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Cached JSON GET against a free external API. Returns null on any failure
 * (timeout, non-2xx, invalid JSON) — callers must degrade gracefully.
 */
async function cachedExternalJson<T>(
  cacheKey: string,
  url: string,
  ttlMs = EXTERNAL_CACHE_TTL_MS
): Promise<T | null> {
  const hit = externalCache.get(cacheKey);
  if (hit && Date.now() - hit.at < ttlMs) return hit.data as T;

  const res = await fetchWithTimeout(url);
  if (!res || !res.ok) return null;

  let data: T;
  try {
    data = (await res.json()) as T;
  } catch {
    return null;
  }
  externalCache.set(cacheKey, { at: Date.now(), data });
  return data;
}

/**
 * arXiv export API returns Atom XML with a feed-level <title> ("arXiv Query:
 * ...") before the entries — every field is parsed from <entry> blocks only,
 * mirroring the single-entry parser in the Import module.
 */
function parseArxivEntries(
  xml: string
): Array<{
  id: string;
  title: string;
  summary: string;
  published: string;
  authors: string[];
}> {
  const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? [];
  const results: Array<{
    id: string;
    title: string;
    summary: string;
    published: string;
    authors: string[];
  }> = [];

  for (const entry of entries) {
    const content = (tag: string): string => {
      const m = entry.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
      if (!m) return "";
      return decodeXmlEntities(m[1].replace(/<[^>]*>/g, " "))
        .replace(/\s+/g, " ")
        .trim();
    };
    const id = content("id");
    const title = content("title");
    if (!id || !title) continue;

    const authorMatches = entry.matchAll(
      /<author>[\s\S]*?<name[^>]*>(.*?)<\/name>[\s\S]*?<\/author>/g
    );
    const authors = [...authorMatches]
      .map((m) => decodeXmlEntities(m[1].replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim())
      .filter(Boolean);

    results.push({
      id,
      title,
      summary: content("summary"),
      published: content("published"),
      authors,
    });
  }
  return results;
}

/**
 * OpenAlex stores abstracts as an inverted index — reconstruct the plain
 * text by unshuffling word positions (cheap, no dependency).
 */
function reconstructOpenAlexAbstract(
  inverted: Record<string, number[]> | undefined
): string | null {
  if (!inverted) return null;
  const words: string[] = [];
  for (const [word, positions] of Object.entries(inverted)) {
    for (const pos of positions) words[pos] = word;
  }
  return words.join(" ").trim() || null;
}

interface OpenAlexWork {
  id?: string;
  doi?: string | null;
  title?: string | null;
  abstract_inverted_index?: Record<string, number[]> | null;
  publication_date?: string | null;
  cited_by_count?: number | null;
  primary_location?: { landing_page_url?: string | null } | null;
  landing_page_url?: string | null;
  authorships?: Array<{ author?: { display_name?: string | null } | null } | null>;
}

function mapOpenAlexWork(work: OpenAlexWork, reason?: string): DiscoveryItem {
  const doi = work.doi?.replace(/^https?:\/\/doi\.org\//i, "") ?? null;
  const authors = (work.authorships ?? [])
    .map((a) => a?.author?.display_name)
    .filter((n): n is string => Boolean(n));
  return {
    kind: "external",
    id: doi ?? work.id ?? work.title ?? "openalex",
    externalUrl:
      work.primary_location?.landing_page_url ??
      work.landing_page_url ??
      (doi ? `https://doi.org/${doi}` : undefined),
    title: work.title ?? "Untitled work",
    abstract: reconstructOpenAlexAbstract(work.abstract_inverted_index ?? undefined),
    source: "openalex",
    citationCount: work.cited_by_count ?? null,
    publishedAt: work.publication_date ?? null,
    authors,
    reason,
  };
}

/**
 * Latest live papers from OpenAlex: recent journal articles sorted by
 * citation count. Free, keyless, cached — the primary trending signal.
 */
async function fetchOpenAlexRecent(limit: number): Promise<DiscoveryItem[]> {
  const perPage = Math.min(limit, 25);
  const url =
    `https://api.openalex.org/works?filter=from_publication_date:${daysAgo(30)},type:article` +
    `&sort=cited_by_count:desc&per-page=${perPage}`;
  const data = await cachedExternalJson<{ results?: OpenAlexWork[] }>("openalex-recent", url);
  if (!data?.results?.length) return [];
  const seen = new Set<string>();
  const items: DiscoveryItem[] = [];
  for (const work of data.results) {
    if (!work?.title) continue;
    const key = work.doi ?? work.title;
    if (seen.has(key)) continue;
    seen.add(key);
    items.push(mapOpenAlexWork(work));
  }
  return items.slice(0, limit);
}

interface ArxivEntry {
  id: string;
  title: string;
  summary: string;
  published: string;
  authors: string[];
}

/**
 * Live arXiv feed. category is an uppercase arXiv category (e.g. "cs.AI",
 * "stat.ML") or null for a general recent-submissions feed. start/maxResults
 * power pagination on the Explore page.
 */
async function fetchArxivFeed(
  category: string | null,
  start: number,
  limit: number
): Promise<DiscoveryItem[]> {
  const query = category
    ? `search_query=cat:${encodeURIComponent(category)}`
    : "search_query=all:electron&sortBy=submittedDate&sortOrder=descending";
  const url =
    category
      ? `https://export.arxiv.org/api/query?${query}&start=${start}&max_results=${limit}&sortBy=submittedDate&sortOrder=descending`
      : `https://export.arxiv.org/api/query?${query}`;
  const cacheKey = `arxiv:${category ?? "recent"}:${start}:${limit}`;
  const xml = await cachedExternalJson<string>(cacheKey, url);
  if (!xml) return [];

  return parseArxivEntries(xml)
    .map((entry: ArxivEntry): DiscoveryItem => ({
      kind: "external",
      id: entry.id.replace(/^https?:\/\/(?:www\.)?arxiv\.org\/(?:abs|pdf)\//i, ""),
      externalUrl: entry.id,
      title: entry.title,
      abstract: entry.summary || null,
      source: "arxiv",
      citationCount: null,
      publishedAt: entry.published || null,
      authors: entry.authors,
    }))
    .slice(0, limit);
}

/**
 * arXiv keyword search (relevance-sorted) — powers personalized
 * recommendations when the user has interest keywords.
 */
async function fetchArxivSearch(
  keyword: string,
  limit: number,
  reason?: string
): Promise<DiscoveryItem[]> {
  const url =
    `https://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(keyword)}` +
    `&start=0&max_results=${limit}&sortBy=relevance`;
  const cacheKey = `arxiv-search:${keyword.toLowerCase()}:${limit}`;
  const xml = await cachedExternalJson<string>(cacheKey, url);
  if (!xml) return [];

  return parseArxivEntries(xml)
    .map((entry: ArxivEntry): DiscoveryItem => ({
      kind: "external",
      id: entry.id.replace(/^https?:\/\/(?:www\.)?arxiv\.org\/(?:abs|pdf)\//i, ""),
      externalUrl: entry.id,
      title: entry.title,
      abstract: entry.summary || null,
      source: "arxiv",
      citationCount: null,
      publishedAt: entry.published || null,
      authors: entry.authors,
      reason: reason ?? undefined,
    }))
    .slice(0, limit);
}

/**
 * OpenAlex keyword search (relevance-sorted) — secondary personalized
 * signal when arXiv returns nothing for a keyword.
 */
async function fetchOpenAlexSearch(
  keyword: string,
  limit: number,
  reason?: string
): Promise<DiscoveryItem[]> {
  const url =
    `https://api.openalex.org/works?search=${encodeURIComponent(keyword)}` +
    `&per-page=${Math.min(limit, 25)}&sort=relevance_score:desc`;
  const cacheKey = `openalex-search:${keyword.toLowerCase()}:${limit}`;
  const data = await cachedExternalJson<{ results?: OpenAlexWork[] }>(cacheKey, url);
  return (data?.results ?? [])
    .filter((w) => w?.title)
    .map((w) => mapOpenAlexWork(w, reason))
    .slice(0, limit);
}

function daysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

/**
 * Union item shape helper — pinned platform fields (no full Paper rows leak).
 */
function toPlatformDiscoveryItem(paper: {
  id: string;
  title: string;
  abstract?: string | null;
  source?: string | null;
  createdAt: Date;
}): DiscoveryItem {
  return {
    kind: "platform",
    id: paper.id,
    paperId: paper.id,
    title: paper.title,
    abstract: paper.abstract,
    source: paper.source,
    publishedAt: paper.createdAt.toISOString(),
  };
}

/**
 * Whitelisted arXiv categories for the Explore page — exact arXiv primary
 * categories only (the export API matches `cat:` literally). Unknown values
 * are rejected with 400, never forwarded upstream.
 */
export const EXPLORE_CATEGORIES: Record<string, string> = {
  "cs.AI": "Artificial Intelligence",
  "cs.LG": "Machine Learning",
  "cs.CL": "NLP & Language",
  "cs.CV": "Computer Vision",
  "cs.SE": "Software Engineering",
  "cs.CR": "Security & Privacy",
  "cs.NE": "Neural Computing",
  "stat.ML": "Statistics & ML",
  "q-bio.NC": "Neurons & Cognition",
  "q-fin.TR": "Trading & Market Microstructure",
  "eess.AS": "Audio & Speech",
  "econ.GN": "General Economics",
};

export interface ExploreResult {
  items: DiscoveryItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

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

    // Auto-record to search history so the history page is populated.
    // Failure must never break the search response.
    try {
      await SearchService.saveSearchQuery(userId, q, { type }, {
        total: aggregateTotal,
        papers: results.papers?.total ?? 0,
        collections: results.collections?.total ?? 0,
        workspaces: results.workspaces?.total ?? 0,
        notes: results.notes?.total ?? 0,
        people: results.people?.total ?? 0,
      });
    } catch (historyError) {
      if (process.env.NODE_ENV !== "production") {
        console.error("[SearchService] history record failed:", historyError);
      }
    }

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
   * Browse live research by category (arXiv feed, submittedDate desc,
   * paginated via start index). No platform data — this is the external
   * world's latest output for a field.
   */
  static async getExplore(
    category: string,
    page: number,
    limit: number
  ): Promise<ExploreResult> {
    const cap = Math.min(20, Math.max(1, limit));
    const start = (page - 1) * cap;
    const items = await fetchArxivFeed(category, start, cap);

    return {
      items,
      meta: {
        page,
        limit: cap,
        total: items.length,
        totalPage: Math.max(1, Math.ceil(items.length / cap)),
      },
    };
  }

  /**
   * Get trending papers for a user — a live mix, not just platform data:
   *   1. OpenAlex recent articles by citation count (primary, keyless)
   *   2. arXiv recent submissions (freshness fallback)
   *   3. Platform papers the user can access (own uploads or non-deleted
   *      workspace with owner/active-member rights)
   * External calls are cached/TTL'd and degrade gracefully — the endpoint
   * never fails because an upstream API is down.
   */
  static async getTrendingPapers(userId: string, limit: number) {
    const cap = Math.min(20, Math.max(1, limit));
    const externalCount = Math.ceil(cap / 2);

    let external: DiscoveryItem[] = [];
    try {
      external = await fetchOpenAlexRecent(externalCount);
    } catch {
      external = [];
    }
    if (external.length === 0) {
      try {
        external = await fetchArxivFeed(null, 0, externalCount);
      } catch {
        external = [];
      }
    }

    const platform = (
      await prisma.paper.findMany({
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
        take: cap - external.length,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          abstract: true,
          source: true,
          createdAt: true,
        },
      })
    ).map(toPlatformDiscoveryItem);

    return [...external, ...platform].slice(0, cap);
  }

  /**
   * Get personalized recommendations for a user.
   *
   * Personalization signal: the user's top interest keywords, derived from
   * tags + metadata.keywords across their accessible (non-deleted) papers.
   * External arXiv/OpenAlex searches are performed per keyword with a
   * "Because you work on X" reason; if the user has no interests yet, or
   * every upstream call fails (cached/fallback safe), return accessible
   * platform papers newest-first so the page is never empty.
   */
  static async getRecommendations(userId: string, limit: number) {
    const cap = Math.min(20, Math.max(1, limit));

    const accessibleWhere = {
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
    };

    const recent = await prisma.paper.findMany({
      where: accessibleWhere,
      take: 50,
      orderBy: { createdAt: "desc" },
      select: { tags: true, metadata: true },
    });

    const freq = new Map<string, number>();
    for (const paper of recent) {
      for (const tag of paper.tags ?? []) {
        const key = tag.toLowerCase().trim();
        if (key.length >= 3) freq.set(key, (freq.get(key) ?? 0) + 1);
      }
      const keywords = (paper.metadata as { keywords?: unknown } | null)?.keywords;
      if (Array.isArray(keywords)) {
        for (const k of keywords.slice(0, 10)) {
          if (typeof k !== "string") continue;
          const key = k.toLowerCase().trim();
          if (key.length >= 3) freq.set(key, (freq.get(key) ?? 0) + 1);
        }
      }
    }

    const interests = [...freq.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([keyword]) => keyword);

    if (interests.length > 0) {
      const perKeyword = Math.max(1, Math.ceil((cap * 0.6) / interests.length));
      const out: DiscoveryItem[] = [];
      const seen = new Set<string>();

      for (const keyword of interests) {
        const reason = `Because you work on "${keyword}"`;
        let items: DiscoveryItem[] = [];
        try {
          items = await fetchArxivSearch(keyword, perKeyword, reason);
        } catch {
          items = [];
        }
        if (items.length === 0) {
          try {
            items = await fetchOpenAlexSearch(keyword, perKeyword, reason);
          } catch {
            items = [];
          }
        }
        for (const item of items) {
          if (seen.has(item.id)) continue;
          seen.add(item.id);
          out.push(item);
        }
      }

      if (out.length > 0) return out.slice(0, cap);
    }

    // No interests or all upstream calls failed → platform fallback
    // (previous behavior: newest accessible papers).
    const platform = (
      await prisma.paper.findMany({
        where: accessibleWhere,
        take: cap,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          abstract: true,
          source: true,
          createdAt: true,
        },
      })
    ).map(toPlatformDiscoveryItem);

    return platform;
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

      // Must match the embedding model used at chunk-index time
      const EMBEDDING_MODEL =
        process.env.EMBEDDING_MODEL || "text-embedding-3-small";

      const response = await fetch(
        "https://api.openai.com/v1/embeddings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: EMBEDDING_MODEL,
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
        c.embedding <=> ${vectorStr}::vector AS distance,
        p.title
      FROM "PaperChunk" c
      JOIN "Paper" p ON p.id = c."paperId"
        AND p."isDeleted" = false
      LEFT JOIN "Workspace" w
        ON w.id = p."workspaceId" AND w."isDeleted" = false
      LEFT JOIN "WorkspaceMember" m
        ON m."workspaceId" = p."workspaceId"
        AND m."userId" = ${userId}
        AND m."isDeleted" = false
      ${workspaceFilter}
      WHERE c.embedding IS NOT NULL
        AND c."isDeleted" = false
        AND (
          p."uploaderId" = ${userId}
          OR w."ownerId" = ${userId}
          OR m.id IS NOT NULL
        )
      ORDER BY c.embedding <=> ${vectorStr}::vector
      LIMIT ${limit}
    `;

    return { results, fallback: null };
  }
}

