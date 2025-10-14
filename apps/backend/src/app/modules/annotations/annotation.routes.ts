import express from "express";
import { authMiddleware } from "../../middleware/auth";
import { paperOperationLimiter } from "../../middleware/rateLimiter";
import { validateRequestBody } from "../../middleware/validateRequest";
import { annotationController } from "./annotation.controller";
import {
  createAnnotationSchema,
  updateAnnotationSchema,
  createAnnotationReplySchema,
} from "./annotation.types";

export const annotationRoutes: express.Router = express.Router();

// Create annotation
annotationRoutes.post(
  "/",
  paperOperationLimiter,
  authMiddleware as any,
  validateRequestBody(createAnnotationSchema) as any,
  annotationController.create as any
);

// Get annotations for a paper
annotationRoutes.get(
  "/paper/:paperId",
  paperOperationLimiter,
  annotationController.getPaperAnnotations as any
);

// Get user's annotations
annotationRoutes.get(
  "/user",
  paperOperationLimiter,
  authMiddleware as any,
  annotationController.getUserAnnotations as any
);

// Update annotation
annotationRoutes.put(
  "/:id",
  paperOperationLimiter,
  authMiddleware as any,
  validateRequestBody(updateAnnotationSchema) as any,
  annotationController.update as any
);

// Delete annotation
annotationRoutes.delete(
  "/:id",
  paperOperationLimiter,
  authMiddleware as any,
  annotationController.delete as any
);

// Create reply to annotation
annotationRoutes.post(
  "/:id/reply",
  paperOperationLimiter,
  authMiddleware as any,
  validateRequestBody(createAnnotationReplySchema) as any,
  annotationController.createReply as any
);

// Get annotation versions
annotationRoutes.get(
  "/:id/versions",
  paperOperationLimiter,
  annotationController.getVersions as any
);
