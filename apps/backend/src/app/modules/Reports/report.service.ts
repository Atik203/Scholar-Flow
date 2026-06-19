/**
 * Reports Service
 *
 * Phase 7 admin report management. Backed by the AdminReport model.
 * Generation is synchronous for v1 (CSV/JSON, capped at 10k rows).
 * PDF generation is deferred to a later phase.
 */

import { Prisma } from "../../shared/prisma";
import prisma from "../../shared/prisma";
import ApiError from "../../errors/ApiError";

const MAX_ROWS = 10000;

export type ReportRow = Record<string, string | number | boolean | null>;

const buildCsv = (rows: ReportRow[]): string => {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const escape = (v: unknown) => {
    if (v === null || v === undefined) return "";
    const s = String(v);
    if (s.includes(",") || s.includes('"') || s.includes("\n")) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };
  const lines: string[] = [];
  lines.push(headers.join(","));
  for (const row of rows) {
    lines.push(headers.map((h) => escape(row[h])).join(","));
  }
  return lines.join("\n");
};

const formatBytes = (n: number): string => {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
};

export const reportService = {
  async listReports(params: {
    type?: "USAGE" | "FINANCIAL" | "USER" | "CONTENT" | "SYSTEM";
    status?: "READY" | "GENERATING" | "SCHEDULED" | "FAILED";
    enabled?: boolean;
    search?: string;
    page: number;
    limit: number;
  }) {
    const where: Prisma.AdminReportWhereInput = { isDeleted: false };
    if (params.type) where.type = params.type;
    if (params.status) where.status = params.status;
    if (params.enabled !== undefined) where.enabled = params.enabled;
    if (params.search) {
      where.OR = [
        { name: { contains: params.search, mode: "insensitive" } },
        { description: { contains: params.search, mode: "insensitive" } },
      ];
    }

    const [total, items] = await Promise.all([
      prisma.adminReport.count({ where }),
      prisma.adminReport.findMany({
        where,
        orderBy: [{ createdAt: "desc" }],
        skip: (params.page - 1) * params.limit,
        take: params.limit,
        include: {
          createdBy: {
            select: { id: true, name: true, email: true },
          },
        },
      }),
    ]);

    return {
      items,
      meta: {
        page: params.page,
        limit: params.limit,
        total,
        totalPage: Math.max(1, Math.ceil(total / params.limit)),
      },
    };
  },

  async getReport(id: string) {
    const report = await prisma.adminReport.findFirst({
      where: { id, isDeleted: false },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });
    if (!report) throw new ApiError(404, "Report not found");
    return report;
  },

  async createReport(
    createdById: string,
    data: {
      name: string;
      description?: string;
      type: "USAGE" | "FINANCIAL" | "USER" | "CONTENT" | "SYSTEM";
      format: "CSV" | "JSON";
      schedule?: string;
      recipients: string[];
      enabled: boolean;
      config?: Record<string, unknown>;
    }
  ) {
    return prisma.adminReport.create({
      data: {
        name: data.name,
        description: data.description,
        type: data.type,
        format: data.format,
        schedule: data.schedule,
        recipients: data.recipients,
        enabled: data.enabled,
        config: data.config
          ? (data.config as Prisma.InputJsonValue)
          : Prisma.JsonNull,
        createdById,
      },
    });
  },

  async updateReport(
    id: string,
    patch: {
      name?: string;
      description?: string;
      format?: "CSV" | "JSON";
      schedule?: string;
      nextRunAt?: Date;
      recipients?: string[];
      enabled?: boolean;
      config?: Record<string, unknown>;
    }
  ) {
    const existing = await prisma.adminReport.findFirst({
      where: { id, isDeleted: false },
      select: { id: true },
    });
    if (!existing) throw new ApiError(404, "Report not found");

    const data: Prisma.AdminReportUpdateInput = {};
    if (patch.name !== undefined) data.name = patch.name;
    if (patch.description !== undefined) data.description = patch.description;
    if (patch.format !== undefined) data.format = patch.format;
    if (patch.schedule !== undefined) data.schedule = patch.schedule;
    if (patch.nextRunAt !== undefined) data.nextRunAt = patch.nextRunAt;
    if (patch.recipients !== undefined) data.recipients = patch.recipients;
    if (patch.enabled !== undefined) data.enabled = patch.enabled;
    if (patch.config !== undefined) {
      data.config = patch.config as Prisma.InputJsonValue;
    }

    return prisma.adminReport.update({ where: { id }, data });
  },

  async softDeleteReport(id: string) {
    const existing = await prisma.adminReport.findFirst({
      where: { id, isDeleted: false },
      select: { id: true },
    });
    if (!existing) throw new ApiError(404, "Report not found");

    await prisma.adminReport.update({
      where: { id },
      data: { isDeleted: true, enabled: false },
    });
    return { success: true, id };
  },

  /**
   * Generate a report synchronously. Returns the generated content as a
   * string (CSV or JSON) plus metadata. The caller can stream the content
   * to the client as a file download.
   */
  async generateReport(id: string): Promise<{
    filename: string;
    mimeType: string;
    content: string;
    size: number;
  }> {
    const report = await prisma.adminReport.findFirst({
      where: { id, isDeleted: false },
    });
    if (!report) throw new ApiError(404, "Report not found");

    // Mark generating
    await prisma.adminReport.update({
      where: { id },
      data: { status: "GENERATING" },
    });

    try {
      const rows = await this.fetchReportRows(report.type, MAX_ROWS);
      const capped = rows.length > MAX_ROWS ? rows.slice(0, MAX_ROWS) : rows;
      const filename = `${this.slugify(report.name)}-${
        new Date().toISOString().split("T")[0]
      }.${report.format.toLowerCase()}`;
      const mimeType = report.format === "JSON" ? "application/json" : "text/csv";
      const content =
        report.format === "JSON"
          ? JSON.stringify(capped, null, 2)
          : buildCsv(capped);

      // Mark ready
      await prisma.adminReport.update({
        where: { id },
        data: {
          status: "READY",
          generatedAt: new Date(),
          fileSize: formatBytes(content.length),
        },
      });

      return {
        filename,
        mimeType,
        content,
        size: content.length,
      };
    } catch (err) {
      await prisma.adminReport.update({
        where: { id },
        data: { status: "FAILED" },
      });
      throw err;
    }
  },

  async fetchReportRows(
    type: "USAGE" | "FINANCIAL" | "USER" | "CONTENT" | "SYSTEM",
    limit: number
  ): Promise<ReportRow[]> {
    switch (type) {
      case "USER": {
        const users = await prisma.user.findMany({
          where: { isDeleted: false },
          take: limit,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            createdAt: true,
            emailVerified: true,
          },
        });
        return users.map((u) => ({
          id: u.id,
          email: u.email,
          name: u.name,
          role: u.role,
          emailVerified: u.emailVerified ? "yes" : "no",
          createdAt: u.createdAt.toISOString(),
        }));
      }
      case "FINANCIAL": {
        const payments = await prisma.payment.findMany({
          where: { isDeleted: false },
          take: limit,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            userId: true,
            amountCents: true,
            currency: true,
            status: true,
            createdAt: true,
            provider: true,
          },
        });
        return payments.map((p) => ({
          id: p.id,
          userId: p.userId,
          amount: (p.amountCents / 100).toFixed(2),
          currency: p.currency,
          status: p.status,
          provider: p.provider,
          createdAt: p.createdAt.toISOString(),
        }));
      }
      case "CONTENT": {
        const papers = await prisma.paper.findMany({
          where: { isDeleted: false },
          take: limit,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            title: true,
            uploaderId: true,
            processingStatus: true,
            citationCount: true,
            createdAt: true,
          },
        });
        return papers.map((p) => ({
          id: p.id,
          title: p.title,
          uploaderId: p.uploaderId,
          processingStatus: p.processingStatus,
          citationCount: p.citationCount,
          createdAt: p.createdAt.toISOString(),
        }));
      }
      case "USAGE": {
        const events = await prisma.usageEvent.findMany({
          where: { isDeleted: false },
          take: limit,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            userId: true,
            kind: true,
            units: true,
            createdAt: true,
          },
        });
        return events.map((e) => ({
          id: e.id,
          userId: e.userId,
          kind: e.kind,
          units: e.units,
          createdAt: e.createdAt.toISOString(),
        }));
      }
      case "SYSTEM": {
        const sessions = await prisma.session.findMany({
          where: { isDeleted: false },
          take: limit,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            userId: true,
            sessionToken: true,
            expires: true,
          },
        });
        return sessions.map((s) => ({
          id: s.id,
          userId: s.userId,
          expiresAt: s.expires.toISOString(),
          // Truncated session token, not the raw token
          tokenPrefix: s.sessionToken.slice(0, 12) + "...",
        }));
      }
      default:
        return [];
    }
  },

  slugify(s: string): string {
    return s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "")
      .slice(0, 60);
  },
};

export default reportService;
