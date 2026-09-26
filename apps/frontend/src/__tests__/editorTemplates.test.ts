import { describe, expect, it } from "@jest/globals";
import { editorTemplates } from "@/lib/editorTemplates";

describe("editor templates", () => {
  it("exposes the expected academic templates with unique ids", () => {
    const ids = editorTemplates.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual(
      expect.arrayContaining(["blank", "ieee", "acm", "springer", "arxiv"])
    );
  });

  it("gives every template a name, description and citation style", () => {
    for (const template of editorTemplates) {
      expect(template.name.length).toBeGreaterThan(0);
      expect(template.description.length).toBeGreaterThan(0);
      expect(template.citationStyle.length).toBeGreaterThan(0);
    }
  });

  it("ships the IEEE template with the standard sections", () => {
    const ieee = editorTemplates.find((t) => t.id === "ieee");
    expect(ieee?.citationStyle).toBe("IEEE");
    expect(ieee?.sections).toEqual(
      expect.arrayContaining(["Abstract", "Introduction", "References"])
    );
  });
});
