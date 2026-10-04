import { describe, expect, it } from "@jest/globals";
import { cn, formatCurrency } from "@/lib/utils";

describe("format utilities", () => {
  it("formats currency values", () => {
    expect(formatCurrency(1234.5)).toBe("$1,234.50");
    expect(formatCurrency(0)).toBe("$0.00");
  });

  it("merges conflicting tailwind classes", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });
});
