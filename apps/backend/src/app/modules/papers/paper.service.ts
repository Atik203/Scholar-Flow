import axios from "axios";
import htmlDocx from "html-docx-js";
import puppeteer from "puppeteer";
import sanitizeHtml from "sanitize-html";
import { queueDocumentExtraction } from "../../services/pdfProcessingQueue";
import prisma from "../../shared/prisma";
import {
  CreateEditorPaperInput,
  PublishDraftInput,
  UpdateEditorContentInput,
  UpdatePaperMetadataInput,
  UploadPaperInput,
} from "./paper.validation";

interface CreateUploadArgs {
  input: UploadPaperInput;
  file: {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
    size: number;
  };
  uploaderId: string;
  workspaceId: string;
  objectKey: string;
}

const MAX_SUMMARY_SOURCE_LENGTH = 60000;

type PaperSummaryRecord = {
  id: string;
  workspaceId: string;
  uploaderId: string;
  workspaceOwnerId: string;
  title: string;
  abstract: string | null;
  metadata: Record<string, unknown> | null;
  contentHtml: string | null;
  updatedAt: Date;
};

type StoredSummaryPayload = {
  summary: string;
  highlights?: string[];
  followUpQuestions?: string[];
  tokensUsed?: number | null;
  provider?: string;
};

type InsightThreadRecord = {
  id: string;
  paperId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  title: string | null;
};

type InsightMessageRecord = {
  id: string;
  threadId: string;
  paperId: string;
  role: string;
  content: string;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
};

const htmlToPlainText = (html: string | null | undefined) => {
  if (!html) {
    return "";
  }

  const stripped = sanitizeHtml(html, {
    allowedTags: [],
    allowedAttributes: {},
  });

  return stripped.replace(/\s+/g, " ").trim();
};

const truncateText = (text: string, limit: number) =>
  text.length > limit ? text.slice(0, limit) : text;

const normalizeMetadata = (
  metadata: unknown
): Record<string, unknown> | null => {
  if (!metadata) {
    return null;
  }

  if (typeof metadata === "object" && !Array.isArray(metadata)) {
    return metadata as Record<string, unknown>;
  }

  if (typeof metadata === "string") {
    try {
      const parsed = JSON.parse(metadata);
      return typeof parsed === "object" && parsed !== null ? parsed : null;
    } catch {
      return null;
    }
  }

  return null;
};

const serializeSummaryPayload = (payload: StoredSummaryPayload) =>
  JSON.stringify(payload);

const deserializeSummaryPayload = (value: string): StoredSummaryPayload => {
  if (!value) {
    return { summary: "" };
  }

  try {
    const parsed = JSON.parse(value);
    if (typeof parsed === "object" && parsed !== null) {
      const normalized = parsed as StoredSummaryPayload;
      if (typeof normalized.summary === "string") {
        return normalized;
      }
    }
  } catch {
    // Fallback to treating the raw string as summary text
  }

  return { summary: value };
};

const normalizeInsightMetadata = (
  value: unknown
): Record<string, unknown> | null => {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  return null;
};

export const paperService = {
  async createUploadedPaper(args: CreateUploadArgs) {
    const { input, file, uploaderId, workspaceId, objectKey } = args;
    console.log("Creating uploaded paper with authors:", input.authors);

    const createStart = Date.now();
    const created = await prisma.paper.create({
      data: {
        workspaceId,
        uploaderId,
        title: input.title || file.originalname,
        metadata: {
          authors: input.authors || [],
          year: input.year,
          source: input.source || "upload",
        },
        source: input.source || "upload",
        file: {
          create: {
            storageProvider: "s3",
            objectKey,
            contentType: file.mimetype,
            sizeBytes: file.size,
            originalFilename: file.originalname,
          },
        },
      },
      include: { file: true },
    });
    console.log(`[PaperService] Prisma create: ${Date.now() - createStart}ms`);

    // Dev verification: confirm relation back to user reflects the new paper
    const verifyStart = Date.now();
    try {
      const [{ count }] = await prisma.$queryRaw<[{ count: bigint }]>`
        SELECT COUNT(*)::bigint as count FROM "Paper" WHERE "uploaderId" = ${uploaderId} AND "isDeleted" = false
      `;
      console.log(
        "[PaperUpload] User",
        uploaderId,
        "now has uploadedPapers count:",
        Number(count)
      );
    } catch (e) {
      console.warn("[PaperUpload] Failed to verify uploadedPapers count:", e);
    }
    console.log(
      `[PaperService] Count verification: ${Date.now() - verifyStart}ms`
    );

    // Queue document extraction for background processing (non-blocking)
    const queueStart = Date.now();
    // Fire and forget - don't wait for Redis queue operations
    queueDocumentExtraction(created.id)
      .then(() => {
        console.log(
          `[PaperUpload] Queued document extraction for paper: ${created.id} (async)`
        );
      })
      .catch((error) => {
        console.error(
          `[PaperUpload] Failed to queue document extraction for paper: ${created.id}`,
          error
        );
      });
    console.log(
      `[PaperService] PDF queue (non-blocking): ${Date.now() - queueStart}ms`
    );

    return created;
  },

  async countByUser(userId: string) {
    const result = await prisma.$queryRaw<[{ count: bigint }]>`
      SELECT COUNT(*)::bigint as count
      FROM "Paper"
      WHERE "uploaderId" = ${userId} AND "isDeleted" = false
    `;
    return Number(result[0]?.count || 0);
  },

  async listByUser(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    // Use $queryRaw for performance per backend instructions
    const [items, totalResult] = await Promise.all([
      prisma.$queryRaw<any[]>`
        SELECT p.id, p."workspaceId", p."uploaderId", p.title, p.abstract, p.metadata, 
               p.source, p.doi, p."processingStatus", p."createdAt", p."updatedAt",
               pf.id as "file_id", pf."storageProvider", pf."objectKey", pf."contentType", 
               pf."sizeBytes", pf."originalFilename", pf."extractedAt"
        FROM "Paper" p
        LEFT JOIN "PaperFile" pf ON p.id = pf."paperId"
        WHERE p."uploaderId" = ${userId} AND p."isDeleted" = false
        ORDER BY p."createdAt" DESC
        LIMIT ${limit} OFFSET ${skip}
      `,
      prisma.$queryRaw<[{ count: bigint }]>`
        SELECT COUNT(*) as count
        FROM "Paper"
        WHERE "uploaderId" = ${userId} AND "isDeleted" = false
      `,
    ]);

    const total = Number(totalResult[0]?.count || 0);

    // Transform flat result to nested structure
    const transformedItems = items.map((item) => ({
      id: item.id,
      workspaceId: item.workspaceId,
      uploaderId: item.uploaderId,
      title: item.title,
      abstract: item.abstract,
      metadata: item.metadata,
      source: item.source,
      doi: item.doi,
      processingStatus: item.processingStatus,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      file: item.file_id
        ? {
            id: item.file_id,
            storageProvider: item.storageProvider,
            objectKey: item.objectKey,
            contentType: item.contentType,
            sizeBytes: item.sizeBytes,
            originalFilename: item.originalFilename,
            extractedAt: item.extractedAt,
          }
        : null,
    }));

    return {
      items: transformedItems,
      meta: { page, limit, total, totalPage: Math.ceil(total / limit) },
    };
  },

  // Keep the workspace method for backward compatibility and future workspace sharing
  async listByWorkspace(workspaceId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    // Use $queryRaw for performance per backend instructions
    const [items, totalResult] = await Promise.all([
      prisma.$queryRaw<any[]>`
        SELECT p.id, p."workspaceId", p."uploaderId", p.title, p.abstract, p.metadata, 
               p.source, p.doi, p."processingStatus", p."createdAt", p."updatedAt",
               pf.id as "file_id", pf."storageProvider", pf."objectKey", pf."contentType", 
               pf."sizeBytes", pf."originalFilename", pf."extractedAt"
        FROM "Paper" p
        LEFT JOIN "PaperFile" pf ON p.id = pf."paperId"
        WHERE p."workspaceId" = ${workspaceId} AND p."isDeleted" = false
        ORDER BY p."createdAt" DESC
        LIMIT ${limit} OFFSET ${skip}
      `,
      prisma.$queryRaw<[{ count: bigint }]>`
        SELECT COUNT(*) as count
        FROM "Paper"
        WHERE "workspaceId" = ${workspaceId} AND "isDeleted" = false
      `,
    ]);

    const total = Number(totalResult[0]?.count || 0);

    // Transform flat result to nested structure
    const transformedItems = items.map((item) => ({
      id: item.id,
      workspaceId: item.workspaceId,
      uploaderId: item.uploaderId,
      title: item.title,
      abstract: item.abstract,
      metadata: item.metadata,
      source: item.source,
      doi: item.doi,
      processingStatus: item.processingStatus,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      file: item.file_id
        ? {
            id: item.file_id,
            storageProvider: item.storageProvider,
            objectKey: item.objectKey,
            contentType: item.contentType,
            sizeBytes: item.sizeBytes,
            originalFilename: item.originalFilename,
            extractedAt: item.extractedAt,
          }
        : null,
    }));

    return {
      items: transformedItems,
      meta: { page, limit, total, totalPage: Math.ceil(total / limit) },
    };
  },

  async getById(id: string) {
    const result = await prisma.$queryRaw<any[]>`
      SELECT p.id, p."workspaceId", p."uploaderId", p.title, p.abstract, p.metadata, 
             p.source, p.doi, p."processingStatus", p."createdAt", p."updatedAt",
             p."previewFileKey", p."previewMimeType", p."originalMimeType",
             pf.id as "file_id", pf."storageProvider", pf."objectKey", pf."contentType", 
             pf."sizeBytes", pf."originalFilename", pf."extractedAt"
      FROM "Paper" p
      LEFT JOIN "PaperFile" pf ON p.id = pf."paperId"
      WHERE p.id = ${id} AND p."isDeleted" = false
      LIMIT 1
    `;

    if (!result.length) return null;

    const item = result[0];
    return {
      id: item.id,
      workspaceId: item.workspaceId,
      uploaderId: item.uploaderId,
      title: item.title,
      abstract: item.abstract,
      metadata: item.metadata,
      source: item.source,
      doi: item.doi,
      processingStatus: item.processingStatus,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      previewFileKey: item.previewFileKey,
      previewMimeType: item.previewMimeType,
      originalMimeType: item.originalMimeType,
      file: item.file_id
        ? {
            id: item.file_id,
            storageProvider: item.storageProvider,
            objectKey: item.objectKey,
            contentType: item.contentType,
            sizeBytes: item.sizeBytes,
            originalFilename: item.originalFilename,
            extractedAt: item.extractedAt,
          }
        : null,
    };
  },

  async softDelete(id: string) {
    await prisma.$executeRaw`
      UPDATE "Paper" 
      SET "isDeleted" = true, "updatedAt" = NOW()
      WHERE id = ${id}
    `;
  },

  async updateMetadata(id: string, data: UpdatePaperMetadataInput) {
    // First get existing paper
    const existing = await prisma.$queryRaw<any[]>`
      SELECT metadata, title, abstract
      FROM "Paper"
      WHERE id = ${id} AND "isDeleted" = false
      LIMIT 1
    `;

    if (!existing.length) return null;

    const existingMeta = existing[0].metadata || {};
    const mergedMeta = {
      ...existingMeta,
      authors:
        data.authors !== undefined ? data.authors : existingMeta.authors || [],
      year: data.year !== undefined ? data.year : existingMeta.year,
    };

    // Update with merged metadata
    await prisma.$executeRaw`
      UPDATE "Paper" 
      SET title = ${data.title ?? existing[0].title},
          abstract = ${data.abstract ?? existing[0].abstract},
          metadata = ${JSON.stringify(mergedMeta)}::jsonb,
          "updatedAt" = NOW()
      WHERE id = ${id}
    `;

    // Return updated paper
    return this.getById(id);
  },

  async getPaperForSummary(
    paperId: string
  ): Promise<PaperSummaryRecord | null> {
    const result = await prisma.$queryRaw<
      Array<Omit<PaperSummaryRecord, "metadata"> & { metadata: any }>
    >`
      SELECT 
        p.id,
        p."workspaceId",
        p."uploaderId",
        w."ownerId" AS "workspaceOwnerId",
        p.title,
        p.abstract,
        p.metadata,
        p."contentHtml",
        p."updatedAt"
      FROM "Paper" p
      JOIN "Workspace" w ON w.id = p."workspaceId"
      WHERE p.id = ${paperId} AND p."isDeleted" = false
      LIMIT 1
    `;

    if (!result.length) {
      return null;
    }

    const record = result[0];

    return {
      ...record,
      metadata: normalizeMetadata(record.metadata),
    };
  },

  async userHasSummaryAccess(
    record: PaperSummaryRecord,
    userId: string
  ): Promise<boolean> {
    if (record.uploaderId === userId || record.workspaceOwnerId === userId) {
      return true;
    }

    const membership = await prisma.$queryRaw<Array<{ exists: number }>>`
      SELECT 1 as exists
      FROM "WorkspaceMember"
      WHERE "workspaceId" = ${record.workspaceId}
        AND "userId" = ${userId}
        AND "isDeleted" = false
      LIMIT 1
    `;

    return membership.length > 0;
  },

  async getSummarySourceText(
    paperId: string,
    record: PaperSummaryRecord
  ): Promise<{
    text: string;
    source: "chunks" | "content" | "abstract" | "metadata" | "empty";
    chunkCount: number;
  }> {
    const chunks = await prisma.$queryRaw<Array<{ content: string }>>`
      SELECT content
      FROM "PaperChunk"
      WHERE "paperId" = ${paperId} AND "isDeleted" = false
      ORDER BY idx ASC
      LIMIT 200
    `;

    const chunkText = chunks
      .map((chunk) => chunk.content?.trim())
      .filter((content): content is string => Boolean(content))
      .join("\n\n");

    if (chunkText) {
      return {
        text: truncateText(chunkText, MAX_SUMMARY_SOURCE_LENGTH),
        source: "chunks",
        chunkCount: chunks.length,
      };
    }

    const contentText = htmlToPlainText(record.contentHtml);
    if (contentText) {
      return {
        text: truncateText(contentText, MAX_SUMMARY_SOURCE_LENGTH),
        source: "content",
        chunkCount: chunks.length,
      };
    }

    if (record.abstract) {
      return {
        text: truncateText(record.abstract, MAX_SUMMARY_SOURCE_LENGTH),
        source: "abstract",
        chunkCount: chunks.length,
      };
    }

    const metadataAbstract = record.metadata?.abstract;
    if (typeof metadataAbstract === "string" && metadataAbstract.trim()) {
      return {
        text: truncateText(metadataAbstract, MAX_SUMMARY_SOURCE_LENGTH),
        source: "metadata",
        chunkCount: chunks.length,
      };
    }

    return {
      text: "",
      source: "empty",
      chunkCount: chunks.length,
    };
  },

  async findStoredSummary(
    paperId: string,
    promptHash: string
  ): Promise<
    | (StoredSummaryPayload & {
        model: string;
        updatedAt: Date;
      })
    | null
  > {
    const rows = await prisma.$queryRaw<
      Array<{ summary: string; model: string; updatedAt: Date }>
    >`
      SELECT summary, model, "updatedAt"
      FROM "AISummary"
      WHERE "paperId" = ${paperId}
        AND "promptHash" = ${promptHash}
        AND "isDeleted" = false
      ORDER BY "updatedAt" DESC
      LIMIT 1
    `;

    if (!rows.length) {
      return null;
    }

    const parsed = deserializeSummaryPayload(rows[0].summary);

    return {
      ...parsed,
      model: rows[0].model,
      updatedAt: rows[0].updatedAt,
    };
  },

  async upsertSummaryRecord(args: {
    paperId: string;
    model: string;
    promptHash: string;
    payload: StoredSummaryPayload;
  }) {
    const summaryJson = serializeSummaryPayload(args.payload);

    await prisma.$executeRaw`
      INSERT INTO "AISummary" (id, "paperId", model, summary, "promptHash", "createdAt", "updatedAt")
      VALUES (
        gen_random_uuid(),
        ${args.paperId},
        ${args.model},
        ${summaryJson},
        ${args.promptHash},
        NOW(),
        NOW()
      )
      ON CONFLICT ("paperId", model, "promptHash")
      DO UPDATE SET
        summary = EXCLUDED.summary,
        "updatedAt" = NOW(),
        "isDeleted" = false
    `;
  },

  async getInsightThread(
    paperId: string,
    userId: string
  ): Promise<InsightThreadRecord | null> {
    const rows = await prisma.$queryRaw<
      Array<{
        id: string;
        paperId: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        title: string | null;
      }>
    >`
      SELECT id, "paperId", "userId", "createdAt", "updatedAt", title
      FROM "AIInsightThread"
      WHERE "paperId" = ${paperId}
        AND "userId" = ${userId}
        AND "isDeleted" = false
      ORDER BY "updatedAt" DESC
      LIMIT 1
    `;

    if (!rows.length) {
      return null;
    }

    return rows[0];
  },

  async getOrCreateInsightThread(
    paperId: string,
    userId: string,
    threadId?: string
  ): Promise<InsightThreadRecord> {
    // If threadId is provided, try to get that specific thread
    if (threadId) {
      const rows = await prisma.$queryRaw<
        Array<{
          id: string;
          paperId: string;
          userId: string;
          createdAt: Date;
          updatedAt: Date;
          title: string | null;
        }>
      >`
        SELECT id, "paperId", "userId", "createdAt", "updatedAt", title
        FROM "AIInsightThread"
        WHERE id = ${threadId}
          AND "paperId" = ${paperId}
          AND "userId" = ${userId}
          AND "isDeleted" = false
      `;

      if (rows.length) {
        return rows[0];
      }
    }

    // Otherwise, get or create a default thread for this user/paper
    const existing = await this.getInsightThread(paperId, userId);
    if (existing) {
      return existing;
    }

    const rows = await prisma.$queryRaw<
      Array<{
        id: string;
        paperId: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        title: string | null;
      }>
    >`
      INSERT INTO "AIInsightThread" (id, "paperId", "userId", title, metadata, "createdAt", "updatedAt", "isDeleted")
      VALUES (gen_random_uuid(), ${paperId}, ${userId}, NULL, NULL, NOW(), NOW(), false)
      RETURNING id, "paperId", "userId", "createdAt", "updatedAt", title
    `;

    if (!rows.length) {
      throw new Error("Failed to create AI insight thread");
    }

    return rows[0];
  },

  async recordInsightMessage(
    threadId: string,
    messageData: {
      role: "user" | "assistant" | "system";
      content: string;
      metadata?: Record<string, unknown> | null;
    }
  ): Promise<InsightMessageRecord> {
    // Get paperId from thread
    const threadRows = await prisma.$queryRaw<Array<{ paperId: string }>>`
      SELECT "paperId" FROM "AIInsightThread" WHERE id = ${threadId} AND "isDeleted" = false
    `;

    if (!threadRows.length) {
      throw new Error("Thread not found");
    }

    const paperId = threadRows[0].paperId;
    const metadataJson = messageData.metadata
      ? JSON.stringify(messageData.metadata)
      : null;

    const rows = await prisma.$queryRaw<
      Array<{
        id: string;
        threadId: string;
        paperId: string;
        role: string;
        content: string;
        metadata: unknown;
        createdAt: Date;
      }>
    >`
      INSERT INTO "AIInsightMessage" (id, "threadId", "paperId", role, content, metadata, "createdById", "createdAt", "updatedAt", "isDeleted")
      VALUES (
        gen_random_uuid(),
        ${threadId},
        ${paperId},
        ${messageData.role},
        ${messageData.content},
        ${metadataJson}::jsonb,
        NULL,
        NOW(),
        NOW(),
        false
      )
      RETURNING id, "threadId", "paperId", role, content, metadata, "createdAt"
    `;

    if (!rows.length) {
      throw new Error("Failed to persist AI insight message");
    }

    await prisma.$executeRaw`
      UPDATE "AIInsightThread"
      SET "updatedAt" = NOW()
      WHERE id = ${threadId}
    `;

    const row = rows[0];
    return {
      id: row.id,
      threadId: row.threadId,
      paperId: row.paperId,
      role: row.role,
      content: row.content,
      metadata: normalizeInsightMetadata(row.metadata),
      createdAt: row.createdAt,
    };
  },

  async listInsightMessages(
    threadId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<InsightMessageRecord[]> {
    const offset = (page - 1) * limit;

    const rows = await prisma.$queryRaw<
      Array<{
        id: string;
        threadId: string;
        paperId: string;
        role: string;
        content: string;
        metadata: unknown;
        createdAt: Date;
      }>
    >`
      SELECT id, "threadId", "paperId", role, content, metadata, "createdAt"
      FROM "AIInsightMessage"
      WHERE "threadId" = ${threadId}
        AND "isDeleted" = false
      ORDER BY "createdAt" DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;

    return rows.reverse().map((row) => ({
      id: row.id,
      threadId: row.threadId,
      paperId: row.paperId,
      role: row.role,
      content: row.content,
      metadata: normalizeInsightMetadata(row.metadata),
      createdAt: row.createdAt,
    }));
  },

  async getRecentInsightMessages(
    threadId: string,
    limit = 6
  ): Promise<InsightMessageRecord[]> {
    const rows = await prisma.$queryRaw<
      Array<{
        id: string;
        threadId: string;
        paperId: string;
        role: string;
        content: string;
        metadata: unknown;
        createdAt: Date;
      }>
    >`
      SELECT id, "threadId", "paperId", role, content, metadata, "createdAt"
      FROM "AIInsightMessage"
      WHERE "threadId" = ${threadId}
        AND "isDeleted" = false
      ORDER BY "createdAt" DESC
      LIMIT ${limit}
    `;

    return rows
      .map((row) => ({
        id: row.id,
        threadId: row.threadId,
        paperId: row.paperId,
        role: row.role,
        content: row.content,
        metadata: normalizeInsightMetadata(row.metadata),
        createdAt: row.createdAt,
      }))
      .reverse();
  },

  async listInsightConversation(
    paperId: string,
    userId: string
  ): Promise<{
    thread: InsightThreadRecord;
    messages: InsightMessageRecord[];
  } | null> {
    const thread = await this.getInsightThread(paperId, userId);
    if (!thread) {
      return null;
    }

    const messages = await this.listInsightMessages(thread.id);
    return { thread, messages };
  },

  async getUserInsightThreads(
    paperId: string,
    userId: string
  ): Promise<
    Array<{
      id: string;
      createdAt: Date;
      updatedAt: Date;
      _count?: { messages: number };
      messages?: Array<{
        role: string;
        content: string;
        createdAt: Date;
      }>;
    }>
  > {
    const rows = await prisma.$queryRaw<
      Array<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        messageCount: bigint;
        lastMessageRole: string | null;
        lastMessageContent: string | null;
        lastMessageCreatedAt: Date | null;
      }>
    >`
      SELECT 
        t.id,
        t."createdAt",
        t."updatedAt",
        COUNT(m.id) as "messageCount",
        (
          SELECT role FROM "AIInsightMessage" m2 
          WHERE m2."threadId" = t.id AND m2."isDeleted" = false 
          ORDER BY m2."createdAt" DESC 
          LIMIT 1
        ) as "lastMessageRole",
        (
          SELECT content FROM "AIInsightMessage" m3 
          WHERE m3."threadId" = t.id AND m3."isDeleted" = false 
          ORDER BY m3."createdAt" DESC 
          LIMIT 1
        ) as "lastMessageContent",
        (
          SELECT "createdAt" FROM "AIInsightMessage" m4 
          WHERE m4."threadId" = t.id AND m4."isDeleted" = false 
          ORDER BY m4."createdAt" DESC 
          LIMIT 1
        ) as "lastMessageCreatedAt"
      FROM "AIInsightThread" t
      LEFT JOIN "AIInsightMessage" m ON t.id = m."threadId" AND m."isDeleted" = false
      WHERE t."paperId" = ${paperId}
        AND t."userId" = ${userId}
        AND t."isDeleted" = false
      GROUP BY t.id, t."createdAt", t."updatedAt"
      ORDER BY t."updatedAt" DESC
    `;

    return rows.map((row) => ({
      id: row.id,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      _count: { messages: Number(row.messageCount) },
      messages: row.lastMessageContent
        ? [
            {
              role: row.lastMessageRole!,
              content: row.lastMessageContent,
              createdAt: row.lastMessageCreatedAt!,
            },
          ]
        : [],
    }));
  },
};

// HTML sanitization configuration for rich text editor content
const sanitizeOptions = {
  allowedTags: [
    "p",
    "br",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "s",
    "sub",
    "sup",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "ul",
    "ol",
    "li",
    "blockquote",
    "pre",
    "code",
    "a",
    "img",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
    "div",
    "span",
  ],
  allowedAttributes: {
    a: ["href", "title", "target"],
    img: ["src", "alt", "title", "width", "height"],
    div: ["class"],
    span: ["class", "style"],
    p: ["class"],
    h1: ["class"],
    h2: ["class"],
    h3: ["class"],
    h4: ["class"],
    h5: ["class"],
    h6: ["class"],
    blockquote: ["class"],
    pre: ["class"],
    code: ["class"],
    table: ["class"],
    thead: ["class"],
    tbody: ["class"],
    tr: ["class"],
    th: ["class"],
    td: ["class"],
  },
  allowedSchemes: ["http", "https", "mailto"],
};

// Editor-specific paper service functions
export const editorPaperService = {
  // Create a new editor-based paper (draft by default)
  async createEditorPaper(input: CreateEditorPaperInput, uploaderId: string) {
    const sanitizedContent = input.content
      ? sanitizeHtml(input.content, sanitizeOptions)
      : "";

    // Create metadata with authors
    const metadata = {
      source: "editor",
      createdInEditor: true,
      authors: input.authors || [],
    };

    const result = await prisma.$queryRaw<
      {
        id: string;
        title: string;
        isDraft: boolean;
        isPublished: boolean;
        createdAt: Date;
      }[]
    >`
      INSERT INTO "Paper" (
        id, "workspaceId", "uploaderId", title, "contentHtml", 
        source, "isDraft", "isPublished", "processingStatus", 
        metadata, "createdAt", "updatedAt"
      ) VALUES (
        gen_random_uuid(), ${input.workspaceId}, ${uploaderId}, 
        ${input.title}, ${sanitizedContent}, 'editor', 
        ${input.isDraft ?? true}, false, 'PROCESSED',
        ${JSON.stringify(metadata)}::jsonb,
        NOW(), NOW()
      )
      RETURNING id, title, "isDraft", "isPublished", "createdAt"
    `;

    return result[0]; // Return the first (and only) result
  },

  // Get editor paper content
  async getEditorPaperContent(paperId: string, userId: string) {
    const result = await prisma.$queryRaw<
      Array<{
        id: string;
        title: string;
        contentHtml: string | null;
        isDraft: boolean;
        isPublished: boolean;
        createdAt: Date;
        updatedAt: Date;
        uploaderId: string;
      }>
    >`
      SELECT 
        p.id, p.title, p."contentHtml", p."isDraft", p."isPublished",
        p."createdAt", p."updatedAt", p."uploaderId"
      FROM "Paper" p
      INNER JOIN "WorkspaceMember" wm ON wm."workspaceId" = p."workspaceId"
      WHERE p.id = ${paperId} 
        AND wm."userId" = ${userId}
        AND p."isDeleted" = false
        AND p.source = 'editor'
    `;

    return result[0] || null;
  },

  // Update editor paper content
  async updateEditorContent(
    paperId: string,
    input: UpdateEditorContentInput,
    userId: string
  ) {
    const sanitizedContent = sanitizeHtml(input.content, sanitizeOptions);

    const result = await prisma.$executeRaw`
      UPDATE "Paper" 
      SET 
        "contentHtml" = ${sanitizedContent},
        title = COALESCE(${input.title}, title),
        "isDraft" = COALESCE(${input.isDraft}, "isDraft"),
        "updatedAt" = NOW()
      WHERE id = ${paperId} 
        AND "uploaderId" = ${userId}
        AND "isDeleted" = false
        AND source = 'editor'
      RETURNING id, title, "isDraft", "updatedAt"
    `;

    return result;
  },

  // Publish a draft paper
  async publishDraft(
    paperId: string,
    input: PublishDraftInput,
    userId: string
  ) {
    const result = await prisma.$executeRaw`
      UPDATE "Paper" 
      SET 
        "isPublished" = true,
        "isDraft" = false,
        title = COALESCE(${input.title}, title),
        abstract = COALESCE(${input.abstract}, abstract),
        "updatedAt" = NOW()
      WHERE id = ${paperId} 
        AND "uploaderId" = ${userId}
        AND "isDeleted" = false
        AND source = 'editor'
        AND "isDraft" = true
      RETURNING id, title, "isPublished", "updatedAt"
    `;

    return result;
  },

  // Get user's editor papers (drafts and published)
  async getUserEditorPapers(
    userId: string,
    isDraft?: boolean,
    limit: number = 10,
    offset: number = 0
  ) {
    if (isDraft !== undefined) {
      return await prisma.$queryRaw<
        Array<{
          id: string;
          title: string;
          abstract: string | null;
          isDraft: boolean;
          isPublished: boolean;
          createdAt: Date;
          updatedAt: Date;
          workspaceId: string;
        }>
      >`
        SELECT 
          p.id, p.title, p.abstract, p."isDraft", p."isPublished",
          p."createdAt", p."updatedAt", p."workspaceId"
        FROM "Paper" p
        WHERE p."uploaderId" = ${userId}
          AND p."isDeleted" = false
          AND p.source = 'editor'
          AND p."isDraft" = ${isDraft}
        ORDER BY p."updatedAt" DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    }

    return await prisma.$queryRaw<
      Array<{
        id: string;
        title: string;
        abstract: string | null;
        isDraft: boolean;
        isPublished: boolean;
        createdAt: Date;
        updatedAt: Date;
        workspaceId: string;
      }>
    >`
      SELECT 
        p.id, p.title, p.abstract, p."isDraft", p."isPublished",
        p."createdAt", p."updatedAt", p."workspaceId"
      FROM "Paper" p
      WHERE p."uploaderId" = ${userId}
        AND p."isDeleted" = false
        AND p.source = 'editor'
      ORDER BY p."updatedAt" DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
  },

  // Delete editor paper (soft delete)
  async deleteEditorPaper(paperId: string, userId: string) {
    return await prisma.$executeRaw`
      UPDATE "Paper" 
      SET "isDeleted" = true, "updatedAt" = NOW()
      WHERE id = ${paperId} 
        AND "uploaderId" = ${userId}
        AND source = 'editor'
    `;
  },

  // Auto-save functionality (updates content without changing draft status)
  async autoSaveContent(paperId: string, content: string, userId: string) {
    const sanitizedContent = sanitizeHtml(content, sanitizeOptions);

    return await prisma.$executeRaw`
      UPDATE "Paper" 
      SET 
        "contentHtml" = ${sanitizedContent},
        "updatedAt" = NOW()
      WHERE id = ${paperId} 
        AND "uploaderId" = ${userId}
        AND "isDeleted" = false
        AND source = 'editor'
    `;
  },
};

// Export service functions
export const exportService = {
  // Generate PDF from HTML content
  async generatePDF(paperId: string, userId: string): Promise<Buffer> {
    // Get paper content
    const paper = await editorPaperService.getEditorPaperContent(
      paperId,
      userId
    );
    if (!paper) {
      throw new Error("Paper not found or access denied");
    }

    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
      ],
    });

    try {
      const page = await browser.newPage();

      // Create HTML document with styling
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>${paper.title}</title>
          <style>
            body {
              font-family: 'Times New Roman', serif;
              line-height: 1.6;
              margin: 40px;
              color: #333;
            }
            h1, h2, h3, h4, h5, h6 {
              color: #2c3e50;
              margin-top: 24px;
              margin-bottom: 16px;
            }
            h1 { font-size: 28px; text-align: center; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
            h2 { font-size: 24px; }
            h3 { font-size: 20px; }
            p { margin-bottom: 12px; text-align: justify; }
            blockquote {
              border-left: 4px solid #3498db;
              margin: 16px 0;
              padding: 8px 16px;
              background-color: #f8f9fa;
            }
            pre {
              background-color: #f4f4f4;
              border: 1px solid #ddd;
              border-radius: 4px;
              padding: 12px;
              overflow-x: auto;
            }
            code {
              background-color: #f4f4f4;
              padding: 2px 4px;
              border-radius: 3px;
              font-family: 'Courier New', monospace;
            }
            table {
              border-collapse: collapse;
              width: 100%;
              margin: 16px 0;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
            }
            ul, ol {
              margin-bottom: 12px;
            }
            li {
              margin-bottom: 4px;
            }
            .title-page {
              text-align: center;
              margin-bottom: 40px;
            }
            .paper-info {
              color: #7f8c8d;
              font-style: italic;
              margin-bottom: 20px;
            }
          </style>
        </head>
        <body>
          <div class="title-page">
            <h1>${paper.title}</h1>
            <div class="paper-info">
              <p>Created: ${paper.createdAt.toLocaleDateString()}</p>
              <p>Last Updated: ${paper.updatedAt.toLocaleDateString()}</p>
              ${paper.isDraft ? "<p><strong>Draft Version</strong></p>" : ""}
            </div>
          </div>
          <div class="content">
            ${paper.contentHtml || "<p>No content available.</p>"}
          </div>
        </body>
        </html>
      `;

      await page.setContent(htmlContent, { waitUntil: "networkidle0" });

      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: {
          top: "20mm",
          right: "15mm",
          bottom: "20mm",
          left: "15mm",
        },
      });

      return Buffer.from(pdfBuffer);
    } finally {
      await browser.close();
    }
  },

  // Generate DOCX from HTML content (using html-docx-js)
  async generateDOCX(paperId: string, userId: string): Promise<Buffer> {
    // Get paper content
    const paper = await editorPaperService.getEditorPaperContent(
      paperId,
      userId
    );
    if (!paper) {
      throw new Error("Paper not found or access denied");
    }

    // Process images: convert external URLs to base64 for DOCX compatibility
    let processedContent = paper.contentHtml || "<p>No content available.</p>";

    try {
      // Find all img tags and convert them to base64
      const imgRegex = /<img[^>]+src="([^"]+)"[^>]*>/g;
      const images: Array<{ original: string; base64: string }> = [];
      let match;

      while ((match = imgRegex.exec(processedContent)) !== null) {
        const imgUrl = match[1];

        // Skip if already processed or if it's already base64
        if (
          images.some((img) => img.original === imgUrl) ||
          imgUrl.startsWith("data:")
        ) {
          continue;
        }

        try {
          console.log(`[DOCX Export] Converting image to base64: ${imgUrl}`);
          const response = await axios.get(imgUrl, {
            responseType: "arraybuffer",
            timeout: 10000, // 10 second timeout
          });

          const contentType = response.headers["content-type"] || "image/png";
          const base64 = Buffer.from(response.data).toString("base64");
          const base64Url = `data:${contentType};base64,${base64}`;

          images.push({ original: imgUrl, base64: base64Url });
        } catch (imgError) {
          const errorMessage =
            imgError instanceof Error ? imgError.message : String(imgError);
          console.warn(
            `[DOCX Export] Failed to convert image ${imgUrl}:`,
            errorMessage
          );
          // Keep the original URL as fallback (might not work in DOCX but won't break)
        }
      }

      // Replace all original URLs with base64 versions
      for (const img of images) {
        processedContent = processedContent.replaceAll(
          img.original,
          img.base64
        );
      }

      console.log(`[DOCX Export] Converted ${images.length} images to base64`);
    } catch (error) {
      console.warn("[DOCX Export] Error processing images:", error);
      // Continue with original content if image processing fails
    }

    // Create HTML document with basic styling for DOCX
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${paper.title}</title>
        <style>
          body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5; }
          h1 { font-size: 18pt; font-weight: bold; text-align: center; margin-bottom: 20px; }
          h2 { font-size: 16pt; font-weight: bold; margin-top: 20px; margin-bottom: 10px; }
          h3 { font-size: 14pt; font-weight: bold; margin-top: 15px; margin-bottom: 8px; }
          p { margin-bottom: 12px; text-align: justify; }
          blockquote { margin: 15px 0; padding: 10px 20px; border-left: 4px solid #ddd; }
          pre, code { font-family: 'Courier New', monospace; }
          table { border-collapse: collapse; width: 100%; margin: 15px 0; }
          th, td { border: 1px solid #000; padding: 6px; }
          th { font-weight: bold; }
          img { max-width: 400px; height: auto; display: block; margin: 10px auto; }
        </style>
      </head>
      <body>
        <h1>${paper.title}</h1>
        <p><em>Created: ${paper.createdAt.toLocaleDateString()}</em></p>
        <p><em>Last Updated: ${paper.updatedAt.toLocaleDateString()}</em></p>
        ${paper.isDraft ? "<p><strong>Draft Version</strong></p>" : ""}
        <hr>
        ${processedContent}
      </body>
      </html>
    `;

    // Generate DOCX and convert to Buffer for storage/download
    const docxBlob = htmlDocx.asBlob(htmlContent) as Buffer | Blob;

    if (Buffer.isBuffer(docxBlob)) {
      return docxBlob;
    }

    if (
      "arrayBuffer" in docxBlob &&
      typeof docxBlob.arrayBuffer === "function"
    ) {
      const arrayBuffer = await docxBlob.arrayBuffer();
      return Buffer.from(arrayBuffer);
    }

    throw new Error("DOCX export returned unsupported blob type");
  },
};

// Development helpers (not for production) to ensure uploader/workspace exist during early integration tests
export async function ensureDevUserAndWorkspace(devEmail?: string) {
  const email =
    devEmail || process.env.DEV_UPLOAD_USER_EMAIL || "dev-uploader@example.com";
  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    user = await prisma.user.create({
      data: { email, name: "Dev Uploader", role: "RESEARCHER" },
    });
  }
  let workspace = await prisma.workspace.findFirst({
    where: { ownerId: user.id },
  });
  if (!workspace) {
    workspace = await prisma.workspace.create({
      data: { name: "Dev Workspace", ownerId: user.id },
    });
    await prisma.workspaceMember.create({
      data: { workspaceId: workspace.id, userId: user.id, role: "RESEARCHER" },
    });
  }
  return { user, workspace };
}
