"use client";

import { NodeViewContent, NodeViewWrapper, type ReactNodeViewProps } from "@tiptap/react";
import katex from "katex";
import { useEffect, useRef, useState } from "react";

export function LatexInlineComponent({
  node,
  updateAttributes,
  selected,
}: ReactNodeViewProps) {
  const [editing, setEditing] = useState(!node.attrs.latex);
  const [inputValue, setInputValue] = useState(node.attrs.latex as string || "");
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!editing && inputValue) {
      try {
        katex.render(inputValue, containerRef.current!, {
          throwOnError: false,
          displayMode: false,
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
    if (e.key === "Enter") {
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
        as="span"
        className="latex-inline-editing inline-flex items-center gap-1"
      >
        <span className="text-xs text-muted-foreground font-mono mr-1">$</span>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSubmit}
          placeholder="x^2 + y^2 = r^2"
          className="border rounded px-2 py-0.5 text-sm w-32 bg-background focus:outline-none focus:ring-1 focus:ring-primary"
          autoFocus
        />
        <span className="text-xs text-muted-foreground font-mono ml-1">$</span>
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper
      as="span"
      className={`latex-inline inline-block align-middle ${
        selected ? "ring-2 ring-primary/30 rounded" : ""
      }`}
      onClick={() => setEditing(true)}
    >
      <span
        ref={containerRef}
        className="latex-rendered cursor-pointer px-0.5 hover:bg-muted/50 rounded"
        title={error ? `Error: ${error}` : "Click to edit"}
      />
      {error && (
        <span className="text-xs text-destructive ml-1" title={error}>
          {"\u26A0"}
        </span>
      )}
      <NodeViewContent />
    </NodeViewWrapper>
  );
}
