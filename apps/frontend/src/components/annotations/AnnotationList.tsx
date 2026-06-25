"use client";

import { useState, useMemo } from "react";
import { Annotation, AnnotationType } from "@/redux/api/annotationApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import {
  Search,
  X,
  Filter,
  Highlighter,
  Underline,
  Strikethrough,
  MessageSquareText,
  Square,
  Pencil,
  MessageSquare,
  ChevronUp,
  ChevronDown,
  MoreVertical,
} from "lucide-react";

interface AnnotationListProps {
  annotations: Annotation[];
  totalPages: number;
  onAnnotationClick: (annotation: Annotation) => void;
  onDelete: (id: string) => void;
  onPageJump: (page: number) => void;
  isLoading?: boolean;
}

const ANNOTATION_TYPES: AnnotationType[] = [
  "HIGHLIGHT",
  "UNDERLINE",
  "COMMENT",
  "INK",
  "NOTE",
  "AREA",
  "STRIKETHROUGH",
];

const TYPE_ICONS: Record<AnnotationType, typeof Highlighter> = {
  HIGHLIGHT: Highlighter,
  UNDERLINE: Underline,
  STRIKETHROUGH: Strikethrough,
  AREA: Square,
  COMMENT: MessageSquareText,
  NOTE: Pencil,
  INK: Pencil,
};

const COLOR_OPTIONS = [
  "#fef08a",
  "#bbf7d0",
  "#bfdbfe",
  "#fecaca",
  "#e9d5ff",
  "#fbcfe8",
];

type SortMode = "page-asc" | "page-desc" | "date-desc" | "date-asc";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function Skeleton() {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="animate-pulse bg-muted rounded h-16" />
      ))}
    </div>
  );
}

export function AnnotationList({
  annotations,
  totalPages,
  onAnnotationClick,
  onDelete,
  onPageJump,
  isLoading = false,
}: AnnotationListProps) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<AnnotationType | null>(null);
  const [colorFilter, setColorFilter] = useState<string | null>(null);
  const [sort, setSort] = useState<SortMode>("page-asc");

  const hasActiveFilters = search.length > 0 || typeFilter !== null || colorFilter !== null;

  const filtered = useMemo(() => {
    let list = annotations;

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.text.toLowerCase().includes(q) ||
          a.anchor.selectedText?.toLowerCase().includes(q)
      );
    }

    if (typeFilter) {
      list = list.filter((a) => a.type === typeFilter);
    }

    if (colorFilter) {
      list = list.filter((a) => a.color === colorFilter);
    }

    const sorted = [...list];
    switch (sort) {
      case "page-asc":
        sorted.sort((a, b) => a.anchor.page - b.anchor.page);
        break;
      case "page-desc":
        sorted.sort((a, b) => b.anchor.page - a.anchor.page);
        break;
      case "date-desc":
        sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "date-asc":
        sorted.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
    }

    return sorted;
  }, [annotations, search, typeFilter, colorFilter, sort]);

  const grouped = useMemo(() => {
    const map = new Map<number, Annotation[]>();
    for (const a of filtered) {
      const page = a.anchor.page;
      if (!map.has(page)) map.set(page, []);
      map.get(page)!.push(a);
    }
    const keys = Array.from(map.keys());
    if (sort === "page-asc" || sort === "date-asc") keys.sort((a, b) => a - b);
    if (sort === "page-desc" || sort === "date-desc")
      keys.sort((a, b) => b - a);
    return { map, keys };
  }, [filtered, sort]);

  const clearFilters = () => {
    setSearch("");
    setTypeFilter(null);
    setColorFilter(null);
  };

  const SortButton = () => {
    const next: Record<SortMode, SortMode> = {
      "page-asc": "page-desc",
      "page-desc": "date-desc",
      "date-desc": "date-asc",
      "date-asc": "page-asc",
    };

    const labels: Record<SortMode, string> = {
      "page-asc": "Page ↑",
      "page-desc": "Page ↓",
      "date-desc": "Newest",
      "date-asc": "Oldest",
    };

    return (
      <Button
        variant="ghost"
        size="sm"
        className="h-8 text-xs gap-1"
        onClick={() => setSort(next[sort])}
      >
        {sort === "page-desc" || sort === "date-desc" ? (
          <ChevronDown className="h-3 w-3" />
        ) : (
          <ChevronUp className="h-3 w-3" />
        )}
        {labels[sort]}
      </Button>
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full border-l bg-background w-80">
        <div className="flex items-center justify-between px-4 h-12 border-b">
          <span className="font-semibold text-sm">Annotations</span>
        </div>
        <Skeleton />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full border-l bg-background w-full max-w-80">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-12 border-b shrink-0">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          <span className="font-semibold text-sm">Annotations</span>
          <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
            {annotations.length}
          </span>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={clearFilters}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="px-3 pt-3 pb-1.5 shrink-0">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search annotations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-xs"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Type filter chips */}
      <div className="px-3 py-1.5 flex flex-wrap gap-1 shrink-0">
        {ANNOTATION_TYPES.map((t) => {
          const Icon = TYPE_ICONS[t];
          const active = typeFilter === t;
          return (
            <button
              key={t}
              onClick={() => setTypeFilter(active ? null : t)}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium transition-colors ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <Icon className="h-3 w-3" />
              {t.charAt(0) + t.slice(1).toLowerCase()}
            </button>
          );
        })}
      </div>

      {/* Color filter + Sort */}
      <div className="flex items-center justify-between px-3 py-1.5 shrink-0">
        <div className="flex items-center gap-1">
          {COLOR_OPTIONS.map((c) => (
            <button
              key={c}
              onClick={() => setColorFilter(colorFilter === c ? null : c)}
              className={`h-5 w-5 rounded-full border-2 transition-all ${
                colorFilter === c
                  ? "border-primary scale-110"
                  : "border-transparent"
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        <SortButton />
      </div>

      {/* List */}
      <ScrollArea className="flex-1">
        {grouped.keys.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <Filter className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm font-medium">No annotations found</p>
            {hasActiveFilters && (
              <Button
                variant="link"
                size="sm"
                className="mt-1 h-auto text-xs"
                onClick={clearFilters}
              >
                Clear filters
              </Button>
            )}
          </div>
        ) : (
          <div className="pb-4">
            {grouped.keys.map((page) => {
              const items = grouped.map.get(page)!;
              return (
                <div key={page}>
                  {/* Page group header */}
                  <button
                    onClick={() => onPageJump(page)}
                    className="sticky top-0 z-10 w-full flex items-center gap-2 px-4 py-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors text-left border-b"
                  >
                    Page {page}
                    <span className="text-[10px] text-muted-foreground ml-auto">
                      {items.length}
                    </span>
                  </button>

                  {items.map((annotation) => {
                    const Icon = TYPE_ICONS[annotation.type] || MessageSquareText;
                    const replyCount = annotation.children?.length ?? 0;

                    return (
                      <DropdownMenu key={annotation.id}>
                        <DropdownMenuTrigger asChild>
                          <button
                            onClick={() => onAnnotationClick(annotation)}
                            onContextMenu={(e) => {
                              e.preventDefault();
                            }}
                            className="w-full text-left group"
                          >
                            <div className="flex px-4 py-2.5 hover:bg-muted/50 transition-colors border-b border-border/40">
                              {/* Color bar */}
                              <div
                                className="w-1 shrink-0 rounded-full mr-3 mt-0.5"
                                style={{ backgroundColor: annotation.color }}
                              />

                              <div className="flex-1 min-w-0">
                                {/* Type icon + meta row */}
                                <div className="flex items-center gap-1.5 mb-1">
                                  <Icon className="h-3 w-3 text-muted-foreground shrink-0" />
                                  <span className="text-[10px] font-medium text-muted-foreground uppercase">
                                    {annotation.type}
                                  </span>
                                  {replyCount > 0 && (
                                    <span className="ml-auto inline-flex items-center gap-0.5 text-[10px] text-muted-foreground">
                                      <MessageSquare className="h-2.5 w-2.5" />
                                      {replyCount}
                                    </span>
                                  )}
                                </div>

                                {/* Text */}
                                <p className="text-xs leading-relaxed line-clamp-2">
                                  {annotation.text ||
                                    annotation.anchor.selectedText}
                                </p>

                                {/* Footer */}
                                <div className="flex items-center gap-2 mt-1.5">
                                  <Avatar className="h-4 w-4">
                                    {annotation.user.image ? (
                                      <AvatarImage
                                        src={annotation.user.image}
                                        alt={annotation.user.name}
                                      />
                                    ) : null}
                                    <AvatarFallback className="text-[8px]">
                                      {getInitials(annotation.user.name)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-[10px] text-muted-foreground truncate">
                                    {annotation.user.name}
                                  </span>
                                  <span className="text-[10px] text-muted-foreground ml-auto shrink-0">
                                    {formatDistanceToNow(
                                      new Date(annotation.createdAt),
                                      { addSuffix: true }
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="min-w-[120px]"
                        >
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(annotation.id);
                            }}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
