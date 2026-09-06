import prisma from "../shared/prisma";

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

export const citationInsertService = {
  async insertCitation(input: InsertCitationInput) {
    const existing = await prisma.citation.findFirst({
      where: {
        sourcePaperId: input.sourcePaperId,
        targetPaperId: input.targetPaperId,
        context: input.context ?? null,
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

  async listCitationsForPaper(sourcePaperId: string): Promise<CitationWithTarget[]> {
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

  async deleteCitation(id: string) {
    return prisma.citation.update({
      where: { id },
      data: { isDeleted: true },
    });
  },
};
