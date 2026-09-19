import prisma from "../shared/prisma";
import ApiError from "../errors/ApiError";

export interface InsertCitationInput {
  sourcePaperId: string;
  targetPaperId: string;
  context?: string;
  location?: string;
}

export interface CitationWithTarget {
  id: string;
  context: string | null;
  location: string | null;
  createdAt: Date;
  targetPaper: {
    id: string;
    title: string;
    metadata: any;
    doi: string | null;
  };
}

/**
 * Shared access gate: uploader OR workspace owner/member of the paper.
 * Mirrors the annotations module so citation writes cannot bypass paper ACLs.
 */
async function assertPaperAccess(paperId: string, userId: string): Promise<void> {
  const access = await prisma.$queryRaw<Array<{ allowed: boolean }>>`
    SELECT EXISTS (
      SELECT 1
      FROM "Paper" p
      LEFT JOIN "Workspace" w
        ON w.id = p."workspaceId" AND w."isDeleted" = false
      LEFT JOIN "WorkspaceMember" m
        ON m."workspaceId" = p."workspaceId"
        AND m."userId" = ${userId}
        AND m."isDeleted" = false
      WHERE p.id = ${paperId}
        AND p."isDeleted" = false
        AND (
          p."uploaderId" = ${userId}
          OR w."ownerId" = ${userId}
          OR m.id IS NOT NULL
        )
    ) AS "allowed"
  `;

  if (access[0]?.allowed !== true) {
    throw new ApiError(403, "You do not have access to this paper");
  }
}

export const citationInsertService = {
  async insertCitation(userId: string, input: InsertCitationInput) {
    await assertPaperAccess(input.sourcePaperId, userId);
    await assertPaperAccess(input.targetPaperId, userId);

    const existing = await prisma.citation.findFirst({
      where: {
        sourcePaperId: input.sourcePaperId,
        targetPaperId: input.targetPaperId,
        context: input.context ?? null,
        isDeleted: false,
      },
    });
    if (existing) return existing;

    return prisma.citation.create({
      data: {
        sourcePaperId: input.sourcePaperId,
        targetPaperId: input.targetPaperId,
        context: input.context,
        location: input.location,
      },
      include: {
        targetPaper: {
          select: { id: true, title: true, metadata: true, doi: true },
        },
      },
    });
  },

  async listCitationsForPaper(
    userId: string,
    sourcePaperId: string
  ): Promise<CitationWithTarget[]> {
    await assertPaperAccess(sourcePaperId, userId);

    return prisma.citation.findMany({
      where: { sourcePaperId, isDeleted: false },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        context: true,
        location: true,
        createdAt: true,
        targetPaper: {
          select: { id: true, title: true, metadata: true, doi: true },
        },
      },
    });
  },

  async deleteCitation(userId: string, id: string) {
    const citation = await prisma.citation.findFirst({
      where: { id, isDeleted: false },
      select: { id: true, sourcePaperId: true },
    });
    if (!citation) {
      throw new ApiError(404, "Citation not found");
    }

    await assertPaperAccess(citation.sourcePaperId, userId);

    return prisma.citation.update({
      where: { id },
      data: { isDeleted: true },
    });
  },
};
