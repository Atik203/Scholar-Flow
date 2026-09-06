"use client";

import { useTiptapEditor } from "@/hooks/use-tiptap-editor";
import { Button } from "@/components/tiptap-ui-primitive/button";
import type { Editor } from "@tiptap/react";
import { BetweenHorizonalEnd } from "lucide-react";

function insertBlockLatex(editor: Editor) {
  editor.chain().focus().setLatexBlock({ latex: "" }).run();
}

export function LatexBlockButton() {
  const { editor } = useTiptapEditor();
  if (!editor) return null;

  return (
    <Button
      onClick={() => insertBlockLatex(editor)}
      tooltip="Block LaTeX ($$...$$)"
    >
      <BetweenHorizonalEnd className="h-4 w-4" />
    </Button>
  );
}
