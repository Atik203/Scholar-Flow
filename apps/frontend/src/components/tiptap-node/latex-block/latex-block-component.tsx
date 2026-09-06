"use client";

import { NodeViewContent, NodeViewWrapper, type ReactNodeViewProps } from "@tiptap/react";
import katex from "katex";
import { useEffect, useRef, useState } from "react";

export function LatexBlockComponent({
  node,
  updateAttributes,
  selected,
}: ReactNodeViewProps) {
  const [editing, setEditing] = useState(!node.attrs.latex);
  const [inputValue, setInputValue] = useState(node.attrs.latex as string || "");
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editing && inputValue) {
      try {
        katex.render(inputValue, containerRef.current!, {
          throwOnError: false,
          displayMode: true,
        });
        setError(null);
      } catch {
        setError("Invalid LaTeX");
        if (containerRef.current) {
          containerRef.current.textContent = inputValue;
        }
      }
    }
  }, [editing, inputValue]);

  const handleSubmit = () => {
    const trimmed = inputValue.trim();
    if (trimmed) {
      updateAttributes({ latex: trimmed });
      setEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape") {
      setEditing(false);
      setInputValue((node.attrs.latex as string) || "");
    }
  };

  if (editing) {
    return (
      <NodeViewWrapper
        as="div"
        className="latex-block-editing border rounded-lg p-4 bg-muted/30 my-2"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground font-mono">
            LaTeX (block) — Shift+Enter to apply
          </span>
        </div>
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSubmit}
          placeholder="E = mc^2"
          className="w-full border rounded p-3 text-sm bg-background font-mono min-h-[80px] focus:outline-none focus:ring-1 focus:ring-primary resize-y"
          autoFocus
        />
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper
      as="div"
      className={`latex-block my-3 p-4 rounded-lg bg-muted/20 ${
        selected ? "ring-2 ring-primary/30" : ""
      }`}
    >
      <div
        ref={containerRef}
        className="latex-rendered flex justify-center py-2 cursor-pointer overflow-x-auto"
        onClick={() => setEditing(true)}
        title="Click to edit"
      />
      {error && (
        <p className="text-xs text-destructive text-center mt-1">{"\u26A0"} {error}</p>
      )}
      <NodeViewContent />
    </NodeViewWrapper>
  );
}
