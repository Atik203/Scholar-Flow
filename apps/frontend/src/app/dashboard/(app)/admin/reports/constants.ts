import type { AdminReportType } from "@/redux/api/adminReportsApi";

export const REPORT_TYPE_OPTIONS: AdminReportType[] = [
  "USAGE",
  "FINANCIAL",
  "USER",
  "CONTENT",
  "SYSTEM",
];

export const REPORT_TYPE_LABELS: Record<AdminReportType, string> = {
  USAGE: "Usage",
  FINANCIAL: "Financial",
  USER: "Users",
  CONTENT: "Content",
  SYSTEM: "System",
};
