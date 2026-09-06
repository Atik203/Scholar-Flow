"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetManagerViewQuery } from "@/redux/api/citationApi";
import type { CitationPaper } from "@/redux/api/citationApi";
import type { Editor } from "@tiptap/core";
import { Bookmark, Plus, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

interface CitationSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editor: Editor | null;
  existingPaperIds: string[];
}

function formatAuthorShort(paper: CitationPaper): string {
  const authors = paper.authors ?? [];
  if (!authors.length) return "Unknown";
  if (authors.length === 1) return authors[0].split(" ").pop() || authors[0];
  return `${authors[0].split(" ").pop() || authors[0]} et al.`;
}

export function CitationSearchDialog({
  open,
  onOpenChange,
  editor,
  existingPaperIds,
}: CitationSearchDialogProps) {
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [inserting, setInserting] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading } = useGetManagerViewQuery({
    search: debounced || undefined,
    limit: 20,
  });

  const papers = useMemo(() => data?.data?.papers ?? [], [data]);

  const handleInsert = (paper: CitationPaper) => {
    if (!editor) return;
    setInserting(true);

    const authorsStr = (paper.authors ?? []).join("; ");
    const yearStr = paper.year?.toString() ?? "";
    const citationNumber = existingPaperIds.length + 1;

    editor
      .chain()
      .focus()
      .insertContent({
        type: "citation",
        attrs: {
          paperId: paper.id,
          title: paper.title,
          authors: authorsStr,
          year: yearStr,
          citationNumber,
        },
      })
      .run();

    setInserting(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Insert Citation</DialogTitle>
          <DialogDescription>
            Search your papers to insert a citation at the cursor position.
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title, author, or year..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            autoFocus
          />
        </div>

        <ScrollArea className="max-h-[50vh]">
          {isLoading ? (
            <div className="space-y-2 p-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : papers.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No papers found. Try a different search.
            </p>
          ) : (
            <div className="space-y-1">
              {papers.map((paper: CitationPaper) => {
                const alreadyCited = existingPaperIds.includes(paper.id);
                return (
                  <button
                    key={paper.id}
                    onClick={() => !alreadyCited && handleInsert(paper)}
                    disabled={alreadyCited || inserting}
                    className={cn(
                      "w-full text-left p-3 rounded-lg border hover:bg-accent transition-colors",
                      alreadyCited
                        ? "border-primary/30 bg-primary/5 opacity-60 cursor-not-allowed"
                        : "hover:border-primary/30"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{paper.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {formatAuthorShort(paper)}
                          {paper.year && ` (${paper.year})`}
                          {paper.journal && ` — ${paper.journal}`}
                        </p>
                      </div>
                      {alreadyCited ? (
                        <Bookmark className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      ) : (
                        <Plus className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
