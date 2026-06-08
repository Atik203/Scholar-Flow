import express from "express";
import { rateLimiter } from "../../middleware/rateLimiter";
import { validateRequestBody, validateRequestParams } from "../../middleware/validateRequest";
import { publicController } from "./public.controller";
import { newsletterSchema, contactSchema, pageContentParamsSchema } from "./public.validation";

export const publicRoutes: express.Router = express.Router();

publicRoutes.get("/faqs", rateLimiter, publicController.getFaqs as any);
publicRoutes.get("/faqs/categories", rateLimiter, publicController.getFaqCategories as any);
publicRoutes.get("/testimonials", rateLimiter, publicController.getTestimonials as any);
publicRoutes.post(
  "/newsletter",
  rateLimiter,
  validateRequestBody(newsletterSchema) as any,
  publicController.subscribeNewsletter as any,
);
publicRoutes.post(
  "/contact",
  rateLimiter,
  validateRequestBody(contactSchema) as any,
  publicController.submitContact as any,
);
publicRoutes.get(
  "/page-content/:slug",
  rateLimiter,
  validateRequestParams(pageContentParamsSchema) as any,
  publicController.getPageContent as any,
);
