import { z } from "zod";

export const faqQuerySchema = z.object({
  category: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});

export const testimonialQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
});

export const newsletterSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required").max(500),
  message: z.string().min(1, "Message is required").max(5000),
});

export const pageContentParamsSchema = z.object({
  slug: z.string().min(1),
});

export type FaqQueryInput = z.infer<typeof faqQuerySchema>;
export type TestimonialQueryInput = z.infer<typeof testimonialQuerySchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type PageContentParams = z.infer<typeof pageContentParamsSchema>;
