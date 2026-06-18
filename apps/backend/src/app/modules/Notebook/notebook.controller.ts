import { Request, Response } from "express";
import { AuthRequest } from "../../middleware/auth";
import { NotebookService } from "./notebook.service";
import {
  createNotebookSchema,
  createSectionSchema,
  createNoteInNotebookSchema,
  moveNoteSchema,
  updateNotebookSchema,
  updateSectionSchema,
  listNotebooksQuerySchema,
  listSectionsQuerySchema,
  listNotesQuerySchema,
} from "./notebook.validation";
import catchAsync from "../../shared/catchAsync";
import { sendSuccessResponse } from "../../shared/sendResponse";

function getUserId(req: Request): string {
  const userId = (req as AuthRequest).user?.id;
  if (!userId) throw new Error("Authentication required");
  return userId;
}

export const notebookController = {
  list: catchAsync(async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const { limit } = listNotebooksQuerySchema.parse(req.query);
    const data = await NotebookService.listNotebooks(userId, limit);
    sendSuccessResponse(res, data, "Notebooks retrieved");
  }),

  get: catchAsync(async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const { id } = req.params as { id: string };
    const data = await NotebookService.getNotebook(userId, id);
    sendSuccessResponse(res, data, "Notebook retrieved");
  }),

  create: catchAsync(async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const parsed = createNotebookSchema.parse(req.body);
    const data = await NotebookService.createNotebook(userId, parsed);
    sendSuccessResponse(res, data, "Notebook created", 201);
  }),

  update: catchAsync(async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const { id } = req.params as { id: string };
    const parsed = updateNotebookSchema.parse(req.body);
    const data = await NotebookService.updateNotebook(userId, id, parsed);
    sendSuccessResponse(res, data, "Notebook updated");
  }),

  remove: catchAsync(async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const { id } = req.params as { id: string };
    const data = await NotebookService.deleteNotebook(userId, id);
    sendSuccessResponse(res, data, "Notebook deleted");
  }),

  // Sections
  listSections: catchAsync(async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const { id } = req.params as { id: string };
    listSectionsQuerySchema.parse(req.query);
    const data = await NotebookService.listSections(userId, id);
    sendSuccessResponse(res, data, `Retrieved ${data.length} sections`);
  }),

  createSection: catchAsync(async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const { id } = req.params as { id: string };
    const parsed = createSectionSchema.parse(req.body);
    const data = await NotebookService.createSection(userId, id, parsed);
    sendSuccessResponse(res, data, "Section created", 201);
  }),

  updateSection: catchAsync(async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const { id, sectionId } = req.params as {
      id: string;
      sectionId: string;
    };
    const parsed = updateSectionSchema.parse(req.body);
    const data = await NotebookService.updateSection(
      userId,
      id,
      sectionId,
      parsed
    );
    sendSuccessResponse(res, data, "Section updated");
  }),

  deleteSection: catchAsync(async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const { id, sectionId } = req.params as {
      id: string;
      sectionId: string;
    };
    const data = await NotebookService.deleteSection(userId, id, sectionId);
    sendSuccessResponse(res, data, "Section deleted");
  }),

  // Notes
  listNotes: catchAsync(async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const { id } = req.params as { id: string };
    const parsed = listNotesQuerySchema.parse(req.query);
    const data = await NotebookService.listNotesInNotebook(
      userId,
      id,
      parsed
    );
    sendSuccessResponse(res, data, `Retrieved ${data.length} notes`);
  }),

  createNote: catchAsync(async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const { id } = req.params as { id: string };
    const parsed = createNoteInNotebookSchema.parse(req.body);
    const data = await NotebookService.createNoteInNotebook(
      userId,
      id,
      parsed
    );
    sendSuccessResponse(res, data, "Note created", 201);
  }),

  moveNote: catchAsync(async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const { id } = req.params as { id: string };
    const parsed = moveNoteSchema.parse(req.body);
    const data = await NotebookService.moveNote(userId, id, parsed);
    sendSuccessResponse(res, data, "Note moved");
  }),
};
