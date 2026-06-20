"use client";

import { useTiptapEditor } from "@/hooks/use-tiptap-editor";
import { Button } from "@/components/tiptap-ui-primitive/button";
import type { Editor } from "@tiptap/react";
import { Sigma } from "lucide-react";

function insertInlineLatex(editor: Editor) {
  const latex = editor.state.selection.empty
    ? ""
    : editor.state.doc.textBetween(
        editor.state.selection.from,
        editor.state.selection.to
      );
  editor.chain().focus().setLatexInline({ latex }).run();
}

export function LatexInlineButton() {
  const { editor } = useTiptapEditor();
  if (!editor) return null;

  return (
    <Button
      onClick={() => insertInlineLatex(editor)}
      tooltip="Inline LaTeX ($...$)"
    >
      <Sigma className="h-4 w-4" />
    </Button>
  );
}
