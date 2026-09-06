import { Request, Response } from "express";
import { AuthRequest } from "../../middleware/auth";
import catchAsync from "../../shared/catchAsync";
import prisma from "../../shared/prisma";
import {
  sendPaginatedResponse,
  sendSuccessResponse,
} from "../../shared/sendResponse";
import { AnnotationService } from "./annotation.service";
import {
  createAnnotationReplySchema,
  createAnnotationSchema,
  getAnnotationsQuerySchema,
  updateAnnotationSchema,
} from "./annotation.types";

/** Shared access gate: uploader OR workspace owner/member of the paper. */
async function assertPaperAccess(
  paperId: string,
  userId: string
): Promise<boolean> {
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

  return access[0]?.allowed === true;
}

export const annotationController = {
  /**
   * Create a new annotation
   */
  create: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const parsed = createAnnotationSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: "Invalid annotation data",
        errors: parsed.error.issues,
      });
      return;
    }

    const canAccess = await assertPaperAccess(parsed.data.paperId, userId);
    if (!canAccess) {
      res.status(403).json({
        success: false,
        message: "You do not have access to this paper",
      });
      return;
    }

    const annotation = await AnnotationService.createAnnotation(
      userId,
      parsed.data
    );

    sendSuccessResponse(res, annotation, "Annotation created successfully");
  }),

  /**
   * Get annotations for a paper
   */
  getPaperAnnotations: catchAsync(async (req: Request, res: Response) => {
    const parsed = getAnnotationsQuerySchema.safeParse({
      ...req.params,
      ...req.query,
    });

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: "Invalid query parameters",
        errors: parsed.error.issues,
      });
      return;
    }

    // Access gate: uploader OR workspace owner/member of the paper
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;
    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const canAccess = await assertPaperAccess(parsed.data.paperId, userId);
    if (!canAccess) {
      res.status(403).json({
        success: false,
        message: "You do not have access to this paper",
      });
      return;
    }

    const result = await AnnotationService.getPaperAnnotations(
      parsed.data
    );

    sendPaginatedResponse(res, result.annotations, result.pagination, "Annotations retrieved successfully");
  }),

  /**
   * Update an annotation
   */
  update: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const { id } = req.params;
    const parsed = updateAnnotationSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: "Invalid update data",
        errors: parsed.error.issues,
      });
      return;
    }

    // Ensure either text or anchor is provided
    if (!parsed.data.text && !parsed.data.anchor) {
      res.status(400).json({
        success: false,
        message: "Either text or anchor must be provided for update",
      });
      return;
    }

    try {
      const annotation = await AnnotationService.updateAnnotation(
        id,
        userId,
        parsed.data
      );
      sendSuccessResponse(res, annotation, "Annotation updated successfully");
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }),

  /**
   * Delete an annotation
   */
  delete: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const { id } = req.params;

    try {
      await AnnotationService.deleteAnnotation(id, userId);
      sendSuccessResponse(res, null, "Annotation deleted successfully");
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }),

  /**
   * Create a reply to an annotation
   */
  createReply: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const { id } = req.params;
    const parsed = createAnnotationReplySchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: "Invalid reply data",
        errors: parsed.error.issues,
      });
      return;
    }

    try {
      const reply = await AnnotationService.createAnnotationReply(
        id,
        userId,
        parsed.data
      );
      sendSuccessResponse(res, reply, "Reply created successfully");
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }),

  /**
   * Get annotation versions/history
   */
  getVersions: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const versions = await AnnotationService.getAnnotationVersions(id);
      sendSuccessResponse(
        res,
        versions,
        "Annotation versions retrieved successfully"
      );
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }),

  /**
   * Get user's annotations
   */
  getUserAnnotations: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await AnnotationService.getUserAnnotations(
      userId,
      page,
      limit
    );

    sendPaginatedResponse(
      res,
      result.annotations,
      result.pagination,
      "User annotations retrieved successfully"
    );
  }),
};
