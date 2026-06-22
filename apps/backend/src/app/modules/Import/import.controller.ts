// phase-4/paper-importer

import { Request, Response } from "express";
import ApiError from "../../errors/ApiError";
import { AuthenticatedRequest } from "../../interfaces/common";
import catchAsync from "../../shared/catchAsync";
import prisma from "../../shared/prisma";
import { sendSuccessResponse } from "../../shared/sendResponse";
import { ImportService } from "./import.service";

export const importController = {
  importByDOI: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const { doi, workspaceId } = req.body;
    if (!doi || !workspaceId) {
      throw new ApiError(400, "doi and workspaceId are required");
    }
    const result = await ImportService.importByDOI(doi, workspaceId, authReq.user.id);
    sendSuccessResponse(res, result, "Paper imported via DOI", 201);
  }),

  importByArxiv: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const { arxivId, workspaceId } = req.body;
    if (!arxivId || !workspaceId) {
      throw new ApiError(400, "arxivId and workspaceId are required");
    }
    const result = await ImportService.importByArxiv(arxivId, workspaceId, authReq.user.id);
    sendSuccessResponse(res, result, "Paper imported via arXiv", 201);
  }),

  importByURL: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const { url, workspaceId } = req.body;
    if (!url || !workspaceId) {
      throw new ApiError(400, "url and workspaceId are required");
    }
    const result = await ImportService.importByURL(url, workspaceId, authReq.user.id);
    sendSuccessResponse(res, { id: result.paper.id, title: result.paper.title }, "Paper imported via URL", 201);
  }),

  importBySmartURL: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const { url, workspaceId } = req.body;
    if (!url || !workspaceId) {
      throw new ApiError(400, "url and workspaceId are required");
    }
    const result = await ImportService.importBySmartURL(url, workspaceId, authReq.user.id);
    sendSuccessResponse(res, { id: result.paper.id, title: result.paper.title, hasPdf: result.hasPdf }, "Paper imported via Smart URL", 201);
  }),

  importByFile: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const { content, format, workspaceId } = req.body;
    if (!content || !format || !workspaceId) {
      throw new ApiError(400, "content, format, and workspaceId are required");
    }

    let papers;
    if (format === "bibtex") {
      papers = ImportService.parseBibTeX(content);
    } else if (format === "ris") {
      papers = ImportService.parseRIS(content);
    } else {
      throw new ApiError(400, "Unsupported format. Use 'bibtex' or 'ris'.");
    }

    const imported: any[] = [];
    for (const p of papers) {
      try {
        const metadata = { authors: p.authors, year: p.year, source: p.source };
        const result = await prisma.$queryRaw<any[]>`
          INSERT INTO "Paper" (id, "workspaceId", "uploaderId", title, abstract, metadata, source, doi, tags, "citationCount", "processingStatus", "createdAt", "updatedAt", "isDeleted")
          VALUES (gen_random_uuid(), ${workspaceId}, ${authReq.user.id}, ${p.title}, ${p.abstract || null}, ${JSON.stringify(metadata)}::jsonb, ${p.source}, ${p.doi || null}, ARRAY[]::text[], 0, 'UPLOADED', NOW(), NOW(), false)
          RETURNING id, title, source, doi
        `;
        imported.push({ id: result[0].id, title: p.title, source: p.source, status: "success" });
      } catch (e) {
        imported.push({ title: p.title, source: p.source, status: "error", error: (e as Error).message });
      }
    }

    sendSuccessResponse(
      res,
      { total: papers.length, imported: imported.filter((i) => i.status === "success").length, papers: imported },
      `Imported ${imported.filter((i) => i.status === "success").length} of ${papers.length} papers`,
      201
    );
  }),

  // Stubs for OAuth-based import sources
  importByZotero: catchAsync(async (req: Request, res: Response) => {
    throw new ApiError(501, "Zotero import is not yet available (coming in Phase 4C)");
  }),

  importByMendeley: catchAsync(async (req: Request, res: Response) => {
    throw new ApiError(501, "Mendeley import is not yet available (coming in Phase 4C)");
  }),

  importByEndnote: catchAsync(async (req: Request, res: Response) => {
    throw new ApiError(501, "EndNote import is not yet available (coming in Phase 4C)");
  }),

  getImportHistory: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const papers = await prisma.$queryRaw<any[]>`
      SELECT id, title, source, doi, "createdAt"
      FROM "Paper"
      WHERE "uploaderId" = ${authReq.user.id}
        AND source IN ('doi', 'arxiv', 'url', 'bibtex', 'ris', 'zotero', 'mendeley', 'endnote')
        AND "isDeleted" = false
      ORDER BY "createdAt" DESC
      LIMIT 20
    `;
    sendSuccessResponse(res, papers, "Import history retrieved");
  }),
};
