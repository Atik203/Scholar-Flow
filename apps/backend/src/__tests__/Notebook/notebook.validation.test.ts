import {
  createNotebookSchema,
  createSectionSchema,
  createNoteInNotebookSchema,
  moveNoteSchema,
  updateNotebookSchema,
} from "./notebook.validation";

declare const describe: (name: string, fn: () => void) => void;
declare const it: (name: string, fn: () => void) => void;
declare const expect: any;

describe("Notebook validation schemas", () => {
  describe("createNotebookSchema", () => {
    it("accepts a valid notebook", () => {
      const r = createNotebookSchema.parse({ name: "Literature" });
      expect(r.name).toBe("Literature");
      expect(r.color).toBe("blue"); // default
    });

    it("rejects an empty name", () => {
      expect(() => createNotebookSchema.parse({ name: "" })).toThrow();
    });

    it("rejects an unknown color", () => {
      expect(() =>
        createNotebookSchema.parse({ name: "Lit", color: "neon" })
      ).toThrow();
    });

    it("accepts all valid colors", () => {
      for (const c of ["blue", "purple", "green", "orange", "pink"]) {
        const r = createNotebookSchema.parse({ name: "n", color: c });
        expect(r.color).toBe(c);
      }
    });
  });

  describe("createSectionSchema", () => {
    it("accepts a valid section", () => {
      const r = createSectionSchema.parse({ name: "General" });
      expect(r.order).toBeUndefined();
    });

    it("accepts explicit order", () => {
      const r = createSectionSchema.parse({ name: "Methods", order: 3 });
      expect(r.order).toBe(3);
    });
  });

  describe("createNoteInNotebookSchema", () => {
    it("applies defaults for type and visibility", () => {
      const r = createNoteInNotebookSchema.parse({
        title: "My note",
        content: "body",
      });
      expect(r.noteType).toBe("QUICK");
      expect(r.visibility).toBe("PRIVATE");
      expect(r.tags).toEqual([]);
    });

    it("rejects empty title", () => {
      expect(() =>
        createNoteInNotebookSchema.parse({ title: "", content: "x" })
      ).toThrow();
    });

    it("rejects empty content", () => {
      expect(() =>
        createNoteInNotebookSchema.parse({ title: "x", content: "" })
      ).toThrow();
    });

    it("rejects too many tags", () => {
      const tags = Array.from({ length: 21 }, (_, i) => `t${i}`);
      expect(() =>
        createNoteInNotebookSchema.parse({ title: "x", content: "y", tags })
      ).toThrow();
    });
  });

  describe("moveNoteSchema", () => {
    it("accepts both nulls (remove from notebook)", () => {
      const r = moveNoteSchema.parse({ notebookId: null, sectionId: null });
      expect(r.notebookId).toBeNull();
    });
  });

  describe("updateNotebookSchema", () => {
    it("accepts a partial update", () => {
      const r = updateNotebookSchema.parse({ name: "Renamed" });
      expect(r.name).toBe("Renamed");
    });

    it("rejects unknown color", () => {
      expect(() =>
        updateNotebookSchema.parse({ color: "neon" })
      ).toThrow();
    });
  });
});
