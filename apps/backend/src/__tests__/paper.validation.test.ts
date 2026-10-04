import { describe, expect, it } from "@jest/globals";
import {
  listPapersQuerySchema,
  shareViaEmailSchema,
  uploadPaperSchema,
} from "../app/modules/papers/paper.validation";

const PAPER_ID = "5f0e8400-e29b-41d4-a716-446655440000";

describe("paper validation schemas", () => {
  it("coerces upload form fields (authors JSON, year string)", () => {
    const result = uploadPaperSchema.safeParse({
      authors: '["Ada Lovelace","Alan Turing"]',
      year: "2024",
      tags: '["ai","research"]',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.authors).toEqual(["Ada Lovelace", "Alan Turing"]);
      expect(result.data.year).toBe(2024);
      expect(result.data.tags).toEqual(["ai", "research"]);
    }
  });

  it("validates share permissions", () => {
    expect(
      shareViaEmailSchema.safeParse({
        paperId: PAPER_ID,
        recipientEmail: "reader@example.com",
        permission: "edit",
      }).success
    ).toBe(true);
    expect(
      shareViaEmailSchema.safeParse({
        paperId: PAPER_ID,
        recipientEmail: "reader@example.com",
        permission: "admin",
      }).success
    ).toBe(false);
  });

  it("validates list query limits", () => {
    const ok = listPapersQuerySchema.safeParse({ limit: "20" });
    expect(ok.success).toBe(true);
    if (ok.success) {
      expect(ok.data.limit).toBe(20);
    }
    expect(listPapersQuerySchema.safeParse({ limit: "abc" }).success).toBe(false);
  });
});
