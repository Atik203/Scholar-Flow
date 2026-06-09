import { Prisma } from "../../shared/prisma";
import prisma from "../../shared/prisma";

interface FaqRow {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isPublished: boolean;
  createdAt: Date;
}

interface TestimonialRow {
  id: string;
  name: string;
  title: string;
  company: string | null;
  avatar: string | null;
  content: string;
  rating: number;
  order: number;
  createdAt: Date;
}

interface NewsletterRow {
  id: string;
  email: string;
}

interface PageContentRow {
  id: string;
  slug: string;
  title: string;
  content: string;
  metadata: unknown;
  createdAt: Date;
}

interface CountRow {
  total: number;
}

export class PublicService {
  static async getFaqs(category?: string, page = 1, limit = 50) {
    const skip = (page - 1) * limit;
    const categoryFilter = category
      ? Prisma.sql`AND f."category" = ${category}`
      : Prisma.empty;

    const faqs = await prisma.$queryRaw<FaqRow[]>`
      SELECT f.id, f.question, f.answer, f.category, f."order", f."isPublished", f."createdAt"
      FROM "Faq" f
      WHERE f."isPublished" = true AND f."isDeleted" = false
      ${categoryFilter}
      ORDER BY f."category" ASC, f."order" ASC
      LIMIT ${limit} OFFSET ${skip}
    `;

    const countResult = await prisma.$queryRaw<CountRow[]>`
      SELECT COUNT(*)::int as total
      FROM "Faq" f
      WHERE f."isPublished" = true AND f."isDeleted" = false
      ${categoryFilter}
    `;

    const total = countResult[0]?.total ?? 0;
    return {
      result: faqs,
      meta: { page, limit, total, totalPage: Math.ceil(total / limit) },
    };
  }

  static async getFaqCategories() {
    const categories = await prisma.$queryRaw<Array<{ category: string }>>`
      SELECT DISTINCT f."category"
      FROM "Faq" f
      WHERE f."isPublished" = true AND f."isDeleted" = false
      ORDER BY f."category" ASC
    `;
    return categories.map((c) => c.category);
  }

  static async getTestimonials(page = 1, limit = 50) {
    const skip = (page - 1) * limit;

    const testimonials = await prisma.$queryRaw<TestimonialRow[]>`
      SELECT t.id, t.name, t.title, t.company, t.avatar, t.content, t.rating, t."order", t."createdAt"
      FROM "Testimonial" t
      WHERE t."isPublished" = true AND t."isDeleted" = false
      ORDER BY t."order" ASC
      LIMIT ${limit} OFFSET ${skip}
    `;

    const countResult = await prisma.$queryRaw<CountRow[]>`
      SELECT COUNT(*)::int as total
      FROM "Testimonial" t
      WHERE t."isPublished" = true AND t."isDeleted" = false
    `;

    const total = countResult[0]?.total ?? 0;
    return {
      result: testimonials,
      meta: { page, limit, total, totalPage: Math.ceil(total / limit) },
    };
  }

  static async subscribeToNewsletter(email: string) {
    const existing = await prisma.$queryRaw<NewsletterRow[]>`
      SELECT ns.id, ns.email
      FROM "NewsletterSubscriber" ns
      WHERE ns.email = ${email} AND ns."isDeleted" = false
      LIMIT 1
    `;

    if (existing.length > 0) {
      await prisma.$executeRaw`
        UPDATE "NewsletterSubscriber"
        SET "isActive" = true, "updatedAt" = NOW()
        WHERE email = ${email}
      `;
      return existing[0];
    }

    const result = await prisma.$queryRaw<NewsletterRow[]>`
      INSERT INTO "NewsletterSubscriber" (id, email, "subscribedAt", "isActive", "createdAt", "updatedAt")
      VALUES (gen_random_uuid(), ${email}, NOW(), true, NOW(), NOW())
      RETURNING id, email
    `;
    return result[0];
  }

  static async createContactSubmission(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) {
    const result = await prisma.$queryRaw<Array<{ id: string }>>`
      INSERT INTO "ContactSubmission" (id, name, email, subject, message, status, "createdAt", "updatedAt")
      VALUES (gen_random_uuid(), ${data.name}, ${data.email}, ${data.subject}, ${data.message}, 'NEW'::"ContactSubmissionStatus", NOW(), NOW())
      RETURNING id
    `;
    return result[0];
  }

  static async getPageContent(slug: string) {
    const result = await prisma.$queryRaw<PageContentRow[]>`
      SELECT pc.id, pc.slug, pc.title, pc.content, pc.metadata, pc."createdAt"
      FROM "PageContent" pc
      WHERE pc.slug = ${slug} AND pc."isPublished" = true AND pc."isDeleted" = false
      LIMIT 1
    `;
    return result[0] ?? null;
  }
}

export const publicService = {
  getFaqs: PublicService.getFaqs,
  getFaqCategories: PublicService.getFaqCategories,
  getTestimonials: PublicService.getTestimonials,
  subscribeToNewsletter: PublicService.subscribeToNewsletter,
  createContactSubmission: PublicService.createContactSubmission,
  getPageContent: PublicService.getPageContent,
};
