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

export type ReportType = "USAGE" | "FINANCIAL" | "USER" | "CONTENT" | "SYSTEM";

export interface ReportColumn {
  key: string;
  label: string;
  format?: "text" | "date" | "number" | "boolean";
}

/**
 * Column registry per report type — single source of truth for preview tables
 * and CSV/JSON exports. Exports deliberately omit internal IDs and surface
 * user names/emails for readability.
 */
export const REPORT_COLUMNS: Record<ReportType, ReportColumn[]> = {
  USAGE: [
    { key: "createdAt", label: "Date", format: "date" },
    { key: "userName", label: "User Name" },
    { key: "userEmail", label: "User Email" },
    { key: "kind", label: "Kind" },
    { key: "units", label: "Units", format: "number" },
  ],
  FINANCIAL: [
    { key: "createdAt", label: "Date", format: "date" },
    { key: "userName", label: "User Name" },
    { key: "userEmail", label: "User Email" },
    { key: "amount", label: "Amount" },
    { key: "currency", label: "Currency" },
    { key: "status", label: "Status" },
    { key: "provider", label: "Provider" },
    { key: "transactionId", label: "Transaction ID" },
  ],
  USER: [
    { key: "createdAt", label: "Joined", format: "date" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    { key: "emailVerified", label: "Email Verified", format: "boolean" },
  ],
  CONTENT: [
    { key: "createdAt", label: "Created", format: "date" },
    { key: "title", label: "Title" },
    { key: "uploaderName", label: "Uploader Name" },
    { key: "uploaderEmail", label: "Uploader Email" },
    { key: "processingStatus", label: "Processing" },
    { key: "citationCount", label: "Citations", format: "number" },
  ],
  SYSTEM: [
    { key: "createdAt", label: "Created", format: "date" },
    { key: "userName", label: "User Name" },
    { key: "userEmail", label: "User Email" },
    { key: "expires", label: "Expires", format: "date" },
    { key: "tokenPrefix", label: "Token Prefix" },
  ],
};

interface ReportQueryOptions {
  limit: number;
  skip?: number;
  search?: string;
}

const insensitive = (
  value: string
): { contains: string; mode: "insensitive" } => ({
  contains: value,
  mode: "insensitive",
});

const buildCsv = (rows: ReportRow[], columns: ReportColumn[]): string => {
  const escape = (v: unknown) => {
    if (v === null || v === undefined) return "";
    let s = String(v);
    // Neutralize CSV formula injection: cells starting with = + - @
    // execute as formulas when the export is opened in Excel.
    if (/^[=+\-@]/.test(s)) {
      s = `'${s}`;
    }
    if (s.includes(",") || s.includes('"') || s.includes("\n")) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };
  const lines: string[] = [];
  lines.push(columns.map((c) => escape(c.label)).join(","));
  for (const row of rows) {
    lines.push(columns.map((c) => escape(row[c.key])).join(","));
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

  /**
   * Status counts for the current filter (search/type), independent of pagination
   */
  async getReportStats(params: {
    type?: "USAGE" | "FINANCIAL" | "USER" | "CONTENT" | "SYSTEM";
    search?: string;
  }) {
    const base: Prisma.AdminReportWhereInput = { isDeleted: false };
    if (params.type) base.type = params.type;
    if (params.search) {
      base.OR = [
        { name: { contains: params.search, mode: "insensitive" } },
        { description: { contains: params.search, mode: "insensitive" } },
      ];
    }

    const [total, ready, generating, scheduled, failed] = await Promise.all([
      prisma.adminReport.count({ where: base }),
      prisma.adminReport.count({ where: { ...base, status: "READY" } }),
      prisma.adminReport.count({ where: { ...base, status: "GENERATING" } }),
      prisma.adminReport.count({ where: { ...base, status: "SCHEDULED" } }),
      prisma.adminReport.count({ where: { ...base, status: "FAILED" } }),
    ]);

    return { total, ready, generating, scheduled, failed };
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
  async generateReport(
    id: string,
    formatOverride?: "CSV" | "JSON"
  ): Promise<{
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
      const format = formatOverride ?? report.format;
      const rows = await this.fetchReportRows(report.type, { limit: MAX_ROWS });
      const filename = `${this.slugify(report.name)}-${
        new Date().toISOString().split("T")[0]
      }.${format.toLowerCase()}`;
      const mimeType = format === "JSON" ? "application/json" : "text/csv";
      const content =
        format === "JSON"
          ? JSON.stringify(rows, null, 2)
          : buildCsv(rows, REPORT_COLUMNS[report.type]);

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

  /**
   * Preview a report type as paginated table data (no saved report needed)
   */
  async previewReport(params: {
    type: ReportType;
    page: number;
    limit: number;
    search?: string;
  }): Promise<{
    columns: ReportColumn[];
    rows: ReportRow[];
    meta: { page: number; limit: number; total: number; totalPage: number };
  }> {
    const skip = (params.page - 1) * params.limit;
    const [total, rows] = await Promise.all([
      this.countReportRows(params.type, params.search),
      this.fetchReportRows(params.type, {
        limit: params.limit,
        skip,
        search: params.search,
      }),
    ]);

    return {
      columns: REPORT_COLUMNS[params.type],
      rows,
      meta: {
        page: params.page,
        limit: params.limit,
        total,
        totalPage: Math.max(1, Math.ceil(total / params.limit)),
      },
    };
  },

  /**
   * One-off export of a report type (no saved report required)
   */
  async exportReport(params: {
    type: ReportType;
    format: "CSV" | "JSON";
  }): Promise<{
    filename: string;
    mimeType: string;
    content: string;
    size: number;
  }> {
    const rows = await this.fetchReportRows(params.type, { limit: MAX_ROWS });
    const filename = `scholar-flow-${params.type.toLowerCase()}-${
      new Date().toISOString().split("T")[0]
    }.${params.format.toLowerCase()}`;
    const mimeType =
      params.format === "JSON" ? "application/json" : "text/csv";
    const content =
      params.format === "JSON"
        ? JSON.stringify(rows, null, 2)
        : buildCsv(rows, REPORT_COLUMNS[params.type]);

    return { filename, mimeType, content, size: content.length };
  },

  async countReportRows(type: ReportType, search?: string): Promise<number> {
    switch (type) {
      case "USER": {
        const where: Prisma.UserWhereInput = { isDeleted: false };
        if (search) {
          where.OR = [
            { name: insensitive(search) },
            { email: insensitive(search) },
          ];
        }
        return prisma.user.count({ where });
      }
      case "FINANCIAL": {
        const where: Prisma.PaymentWhereInput = { isDeleted: false };
        if (search) {
          where.OR = [
            { transactionId: insensitive(search) },
            { user: { email: insensitive(search) } },
            { user: { name: insensitive(search) } },
          ];
        }
        return prisma.payment.count({ where });
      }
      case "CONTENT": {
        const where: Prisma.PaperWhereInput = { isDeleted: false };
        if (search) {
          where.OR = [
            { title: insensitive(search) },
            { uploader: { email: insensitive(search) } },
            { uploader: { name: insensitive(search) } },
          ];
        }
        return prisma.paper.count({ where });
      }
      case "USAGE": {
        const where: Prisma.UsageEventWhereInput = { isDeleted: false };
        if (search) {
          where.OR = [
            { kind: insensitive(search) },
            { user: { email: insensitive(search) } },
            { user: { name: insensitive(search) } },
          ];
        }
        return prisma.usageEvent.count({ where });
      }
      case "SYSTEM": {
        const where: Prisma.SessionWhereInput = { isDeleted: false };
        if (search) {
          where.OR = [
            { user: { email: insensitive(search) } },
            { user: { name: insensitive(search) } },
          ];
        }
        return prisma.session.count({ where });
      }
      default:
        return 0;
    }
  },

  async fetchReportRows(
    type: ReportType,
    options: ReportQueryOptions
  ): Promise<ReportRow[]> {
    const { limit, skip = 0, search } = options;

    switch (type) {
      case "USER": {
        const where: Prisma.UserWhereInput = { isDeleted: false };
        if (search) {
          where.OR = [
            { name: insensitive(search) },
            { email: insensitive(search) },
          ];
        }
        const users = await prisma.user.findMany({
          where,
          take: limit,
          skip,
          orderBy: { createdAt: "desc" },
          select: {
            email: true,
            name: true,
            role: true,
            createdAt: true,
            emailVerified: true,
          },
        });
        return users.map((u) => ({
          email: u.email,
          name: u.name,
          role: u.role,
          emailVerified: Boolean(u.emailVerified),
          createdAt: u.createdAt.toISOString(),
        }));
      }
      case "FINANCIAL": {
        const where: Prisma.PaymentWhereInput = { isDeleted: false };
        if (search) {
          where.OR = [
            { transactionId: insensitive(search) },
            { user: { email: insensitive(search) } },
            { user: { name: insensitive(search) } },
          ];
        }
        const payments = await prisma.payment.findMany({
          where,
          take: limit,
          skip,
          orderBy: { createdAt: "desc" },
          select: {
            amountCents: true,
            currency: true,
            status: true,
            createdAt: true,
            provider: true,
            transactionId: true,
            user: { select: { name: true, email: true } },
          },
        });
        return payments.map((p) => ({
          userName: p.user?.name ?? "",
          userEmail: p.user?.email ?? "",
          amount: (p.amountCents / 100).toFixed(2),
          currency: p.currency,
          status: p.status,
          provider: p.provider,
          transactionId: p.transactionId,
          createdAt: p.createdAt.toISOString(),
        }));
      }
      case "CONTENT": {
        const where: Prisma.PaperWhereInput = { isDeleted: false };
        if (search) {
          where.OR = [
            { title: insensitive(search) },
            { uploader: { email: insensitive(search) } },
            { uploader: { name: insensitive(search) } },
          ];
        }
        const papers = await prisma.paper.findMany({
          where,
          take: limit,
          skip,
          orderBy: { createdAt: "desc" },
          select: {
            title: true,
            processingStatus: true,
            citationCount: true,
            createdAt: true,
            uploader: { select: { name: true, email: true } },
          },
        });
        return papers.map((p) => ({
          title: p.title,
          uploaderName: p.uploader?.name ?? "",
          uploaderEmail: p.uploader?.email ?? "",
          processingStatus: p.processingStatus,
          citationCount: p.citationCount,
          createdAt: p.createdAt.toISOString(),
        }));
      }
      case "USAGE": {
        const where: Prisma.UsageEventWhereInput = { isDeleted: false };
        if (search) {
          where.OR = [
            { kind: insensitive(search) },
            { user: { email: insensitive(search) } },
            { user: { name: insensitive(search) } },
          ];
        }
        const events = await prisma.usageEvent.findMany({
          where,
          take: limit,
          skip,
          orderBy: { createdAt: "desc" },
          select: {
            kind: true,
            units: true,
            createdAt: true,
            user: { select: { name: true, email: true } },
          },
        });
        return events.map((e) => ({
          userName: e.user?.name ?? "",
          userEmail: e.user?.email ?? "",
          kind: e.kind,
          units: e.units,
          createdAt: e.createdAt.toISOString(),
        }));
      }
      case "SYSTEM": {
        const where: Prisma.SessionWhereInput = { isDeleted: false };
        if (search) {
          where.OR = [
            { user: { email: insensitive(search) } },
            { user: { name: insensitive(search) } },
          ];
        }
        const sessions = await prisma.session.findMany({
          where,
          take: limit,
          skip,
          orderBy: { createdAt: "desc" },
          select: {
            sessionToken: true,
            expires: true,
            createdAt: true,
            user: { select: { name: true, email: true } },
          },
        });
        return sessions.map((s) => ({
          userName: s.user?.name ?? "",
          userEmail: s.user?.email ?? "",
          expires: s.expires.toISOString(),
          createdAt: s.createdAt.toISOString(),
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

