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
    const htmlDocx = require("html-docx-js");

    // Get paper content
    const paper = await editorPaperService.getEditorPaperContent(
      paperId,
      userId
    );
    if (!paper) {
      throw new Error("Paper not found or access denied");
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
        </style>
      </head>
      <body>
        <h1>${paper.title}</h1>
        <p><em>Created: ${paper.createdAt.toLocaleDateString()}</em></p>
        <p><em>Last Updated: ${paper.updatedAt.toLocaleDateString()}</em></p>
        ${paper.isDraft ? "<p><strong>Draft Version</strong></p>" : ""}
        <hr>
        ${paper.contentHtml || "<p>No content available.</p>"}
      </body>
      </html>
    `;

    // Generate DOCX and convert Blob to Buffer
    const docxBlob = htmlDocx.asBlob(htmlContent);

    // Convert Blob to Buffer properly
    const arrayBuffer = await docxBlob.arrayBuffer();
    return Buffer.from(arrayBuffer);
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
