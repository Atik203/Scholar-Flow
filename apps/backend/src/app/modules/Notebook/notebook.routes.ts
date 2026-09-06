import express from "express";
import { authMiddleware } from "../../middleware/auth";
import { performanceMonitor } from "../../middleware/performanceMonitor";
import { rateLimiter } from "../../middleware/rateLimiter";
import {
  validateRequestBody,
  validateRequestParams,
} from "../../middleware/validateRequest";
import { notebookController } from "./notebook.controller";
import {
  createNotebookSchema,
  createSectionSchema,
  createNoteInNotebookSchema,
  moveNoteSchema,
  notebookParamsSchema,
  sectionParamsSchema,
  updateNotebookSchema,
  updateSectionSchema,
} from "./notebook.validation";

export const notebookRoutes: express.Router = express.Router();

notebookRoutes.use(performanceMonitor as any);
notebookRoutes.use(authMiddleware as any);
notebookRoutes.use(rateLimiter as any);

// List
notebookRoutes.get("/", notebookController.list as any);

// Create
notebookRoutes.post(
  "/",
  validateRequestBody(createNotebookSchema) as any,
  notebookController.create as any
);

// One
notebookRoutes.get(
  "/:id",
  validateRequestParams(notebookParamsSchema) as any,
  notebookController.get as any
);

// Update
notebookRoutes.patch(
  "/:id",
  validateRequestParams(notebookParamsSchema) as any,
  validateRequestBody(updateNotebookSchema) as any,
  notebookController.update as any
);

// Delete
notebookRoutes.delete(
  "/:id",
  validateRequestParams(notebookParamsSchema) as any,
  notebookController.remove as any
);

// Sections
notebookRoutes.get(
  "/:id/sections",
  validateRequestParams(notebookParamsSchema) as any,
  notebookController.listSections as any
);

notebookRoutes.post(
  "/:id/sections",
  validateRequestParams(notebookParamsSchema) as any,
  validateRequestBody(createSectionSchema) as any,
  notebookController.createSection as any
);

notebookRoutes.patch(
  "/:id/sections/:sectionId",
  validateRequestParams(sectionParamsSchema) as any,
  validateRequestBody(updateSectionSchema) as any,
  notebookController.updateSection as any
);

notebookRoutes.delete(
  "/:id/sections/:sectionId",
  validateRequestParams(sectionParamsSchema) as any,
  notebookController.deleteSection as any
);

// Notes in a notebook
notebookRoutes.get(
  "/:id/notes",
  validateRequestParams(notebookParamsSchema) as any,
  notebookController.listNotes as any
);

notebookRoutes.post(
  "/:id/notes",
  validateRequestParams(notebookParamsSchema) as any,
  validateRequestBody(createNoteInNotebookSchema) as any,
  notebookController.createNote as any
);

// Move note (in note routes, but controller lives here)
notebookRoutes.patch(
  "/notes/:id/move",
  validateRequestBody(moveNoteSchema) as any,
  notebookController.moveNote as any
);
