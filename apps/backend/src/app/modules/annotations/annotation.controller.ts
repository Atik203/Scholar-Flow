import { Request, Response } from "express";
import { AuthenticatedRequest } from "../../middleware/auth";
import { AnnotationService } from "./annotation.service";
import {
  createAnnotationSchema,
  updateAnnotationSchema,
  createAnnotationReplySchema,
  getAnnotationsQuerySchema,
} from "./annotation.types";
import { catchAsync } from "../../middleware/routeHandler";
import { sendSuccessResponse, sendPaginatedResponse } from "../../shared/sendResponse";

export const annotationController = {
  /**
   * Create a new annotation
   */
  create: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const parsed = createAnnotationSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid annotation data",
        errors: parsed.error.issues,
      });
    }

    const annotation = await AnnotationService.createAnnotation(userId, parsed.data);

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
      return res.status(400).json({
        success: false,
        message: "Invalid query parameters",
        errors: parsed.error.issues,
      });
    }

    const annotations = await AnnotationService.getPaperAnnotations(parsed.data);

    sendSuccessResponse(res, annotations, "Annotations retrieved successfully");
  }),

  /**
   * Update an annotation
   */
  update: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { id } = req.params;
    const parsed = updateAnnotationSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid update data",
        errors: parsed.error.issues,
      });
    }

    try {
      const annotation = await AnnotationService.updateAnnotation(id, userId, parsed.data);
      sendSuccessResponse(res, annotation, "Annotation updated successfully");
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }),

  /**
   * Delete an annotation
   */
  delete: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { id } = req.params;

    try {
      await AnnotationService.deleteAnnotation(id, userId);
      sendSuccessResponse(res, null, "Annotation deleted successfully");
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }),

  /**
   * Create a reply to an annotation
   */
  createReply: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { id } = req.params;
    const parsed = createAnnotationReplySchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid reply data",
        errors: parsed.error.issues,
      });
    }

    try {
      const reply = await AnnotationService.createAnnotationReply(id, userId, parsed.data);
      sendSuccessResponse(res, reply, "Reply created successfully");
    } catch (error: any) {
      return res.status(400).json({
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
      sendSuccessResponse(res, versions, "Annotation versions retrieved successfully");
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }),

  /**
   * Get user's annotations
   */
  getUserAnnotations: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await AnnotationService.getUserAnnotations(userId, page, limit);

    sendPaginatedResponse(
      res,
      result.annotations,
      result.pagination,
      "User annotations retrieved successfully"
    );
  }),
};
