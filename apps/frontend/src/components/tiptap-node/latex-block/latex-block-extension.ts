import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { LatexBlockComponent } from "./latex-block-component";

export interface LatexBlockOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    latexBlock: {
      setLatexBlock: (options: { latex: string }) => ReturnType;
    };
  }
}

export const LatexBlock = Node.create<LatexBlockOptions>({
  name: "latexBlock",

  group: "block",

  atom: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      latex: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-latex") || "",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="latex-block"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(
        { "data-type": "latex-block" },
        this.options.HTMLAttributes,
        HTMLAttributes
      ),
    ];
  },

  addCommands() {
    return {
      setLatexBlock:
        (options) =>
        ({ chain }) => {
          return chain()
            .insertContent({
              type: this.name,
              attrs: options,
            })
            .run();
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(LatexBlockComponent);
  },
});
