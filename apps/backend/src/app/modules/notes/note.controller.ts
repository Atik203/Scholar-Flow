import { Request, Response } from "express";
import { AuthenticatedRequest } from "../../middleware/auth";
import { NoteService } from "./note.service";
import {
  createNoteSchema,
  updateNoteSchema,
  getNotesQuerySchema,
  searchNotesSchema,
} from "./note.types";
import { catchAsync } from "../../middleware/routeHandler";
import { sendSuccessResponse, sendPaginatedResponse } from "../../shared/responseHelpers";

export const noteController = {
  /**
   * Create a new note
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

    const parsed = createNoteSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid note data",
        errors: parsed.error.issues,
      });
    }

    const note = await NoteService.createNote(userId, parsed.data);

    sendSuccessResponse(res, note, "Note created successfully");
  }),

  /**
   * Get notes
   */
  getNotes: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const parsed = getNotesQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid query parameters",
        errors: parsed.error.issues,
      });
    }

    const result = await NoteService.getNotes(userId, parsed.data);

    sendPaginatedResponse(
      res,
      result.notes,
      result.pagination,
      "Notes retrieved successfully"
    );
  }),

  /**
   * Get note by ID
   */
  getNote: catchAsync(async (req: Request, res: Response) => {
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
      const note = await NoteService.getNoteById(id, userId);
      if (!note) {
        return res.status(404).json({
          success: false,
          message: "Note not found",
        });
      }

      sendSuccessResponse(res, note, "Note retrieved successfully");
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }),

  /**
   * Update note
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
    const parsed = updateNoteSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid update data",
        errors: parsed.error.issues,
      });
    }

    try {
      const note = await NoteService.updateNote(id, userId, parsed.data);
      sendSuccessResponse(res, note, "Note updated successfully");
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }),

  /**
   * Delete note
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
      await NoteService.deleteNote(id, userId);
      sendSuccessResponse(res, null, "Note deleted successfully");
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }),

  /**
   * Search notes
   */
  search: catchAsync(async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const parsed = searchNotesSchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid search parameters",
        errors: parsed.error.issues,
      });
    }

    const result = await NoteService.searchNotes(userId, parsed.data);

    sendPaginatedResponse(
      res,
      result.notes,
      result.pagination,
      "Search results retrieved successfully"
    );
  }),
};
