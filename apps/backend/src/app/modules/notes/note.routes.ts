import express from "express";
import { authMiddleware } from "../../middleware/auth";
import { paperOperationLimiter } from "../../middleware/rateLimiter";
import { validateRequestBody } from "../../middleware/validateRequest";
import { noteController } from "./note.controller";
import {
  createNoteSchema,
  updateNoteSchema,
  searchNotesSchema,
} from "./note.types";

export const noteRoutes: express.Router = express.Router();

// Create note
noteRoutes.post(
  "/",
  paperOperationLimiter,
  authMiddleware as any,
  validateRequestBody(createNoteSchema) as any,
  noteController.create as any
);

// Get notes
noteRoutes.get(
  "/",
  paperOperationLimiter,
  authMiddleware as any,
  noteController.getNotes as any
);

// Get note by ID
noteRoutes.get(
  "/:id",
  paperOperationLimiter,
  authMiddleware as any,
  noteController.getNote as any
);

// Update note
noteRoutes.put(
  "/:id",
  paperOperationLimiter,
  authMiddleware as any,
  validateRequestBody(updateNoteSchema) as any,
  noteController.update as any
);

// Delete note
noteRoutes.delete(
  "/:id",
  paperOperationLimiter,
  authMiddleware as any,
  noteController.delete as any
);

// Search notes
noteRoutes.get(
  "/search",
  paperOperationLimiter,
  authMiddleware as any,
  noteController.search as any
);
