import prisma from "../../shared/prisma";
import { UpdatePaperMetadataInput, UploadPaperInput } from "./paper.validation";

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
    return prisma.paper.create({
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
  },

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
