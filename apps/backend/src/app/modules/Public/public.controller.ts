import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { sendSuccessResponse, sendPaginatedResponse } from "../../shared/sendResponse";
import { PublicService } from "./public.service";

export const publicController = {
  getFaqs: catchAsync(async (req: Request, res: Response) => {
    const { category, page = "1", limit = "50" } = req.query as Record<string, string | undefined>;
    const result = await PublicService.getFaqs(
      category,
      parseInt(page, 10),
      parseInt(limit, 10),
    );
    sendPaginatedResponse(res, result.result, result.meta, "FAQs retrieved");
  }),

  getFaqCategories: catchAsync(async (_req: Request, res: Response) => {
    const categories = await PublicService.getFaqCategories();
    sendSuccessResponse(res, categories, "FAQ categories retrieved");
  }),

  getTestimonials: catchAsync(async (req: Request, res: Response) => {
    const { page = "1", limit = "50" } = req.query as Record<string, string>;
    const result = await PublicService.getTestimonials(
      parseInt(page, 10),
      parseInt(limit, 10),
    );
    sendPaginatedResponse(res, result.result, result.meta, "Testimonials retrieved");
  }),

  subscribeNewsletter: catchAsync(async (req: Request, res: Response) => {
    const { email } = req.body;
    const subscriber = await PublicService.subscribeToNewsletter(email);
    sendSuccessResponse(res, subscriber, "Successfully subscribed to newsletter", 201);
  }),

  submitContact: catchAsync(async (req: Request, res: Response) => {
    const { name, email, subject, message } = req.body;
    const submission = await PublicService.createContactSubmission({ name, email, subject, message });
    sendSuccessResponse(res, submission, "Contact submission received", 201);
  }),

  getPageContent: catchAsync(async (req: Request, res: Response) => {
    const { slug } = req.params;
    const content = await PublicService.getPageContent(slug);
    if (!content) {
      return sendSuccessResponse(res, null, "Page content not found", 404);
    }
    sendSuccessResponse(res, content, "Page content retrieved");
  }),
};
