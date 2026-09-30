import { describe, expect, it } from "@jest/globals";
import { cn, typography } from "@/lib/typography";

describe("typography helpers", () => {
  it("exposes the design scale and merges classes", () => {
    expect(typography.h1).toContain("text-4xl");
    expect(typography.muted).toContain("text-muted-foreground");
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  it("includes the code, heading and quote scales", () => {
    expect(typography.h6).toContain("text-base");
    expect(typography.code).toContain("font-mono");
    expect(typography.blockquote).toContain("italic");
  });
});
