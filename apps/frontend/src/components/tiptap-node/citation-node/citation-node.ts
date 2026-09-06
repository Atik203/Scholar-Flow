import { Node } from "@tiptap/core";

export interface CitationAttributes {
  paperId: string;
  title: string;
  authors: string;
  year: string;
  citationNumber: number;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    citation: {
      insertCitation: (attrs: CitationAttributes) => ReturnType;
    };
  }
}

export const CitationNode = Node.create({
  name: "citation",
  group: "inline",
  inline: true,
  atom: true,

  addAttributes() {
    return {
      paperId: { default: "" },
      title: { default: "" },
      authors: { default: "" },
      year: { default: "" },
      citationNumber: { default: 1 },
    };
  },

  parseHTML() {
    return [{ tag: "span[data-citation]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      {
        "data-citation": HTMLAttributes.paperId,
        class: "citation-node",
        title: HTMLAttributes.title,
      },
      `[${HTMLAttributes.citationNumber}]`,
    ];
  },

  addCommands() {
    return {
      insertCitation:
        (attrs: CitationAttributes) =>
        ({ chain }) =>
          chain().insertContent({ type: this.name, attrs }).run(),
    };
  },
});
