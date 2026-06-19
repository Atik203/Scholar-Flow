"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useListPapersQuery } from "@/redux/api/paperApi";
import { motion } from "motion/react";
import { Globe, Search, Tag, X } from "lucide-react";
import { useMemo, useState } from "react";

interface TagBubble {
  tag: string;
  count: number;
  hue: number;
}

export default function ResearchMapPage() {
  const { data: papersData, isLoading } = useListPapersQuery({ limit: 100 });
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const tags: TagBubble[] = useMemo(() => {
    if (!papersData?.items) return [];
    const freq: Record<string, number> = {};
    papersData.items.forEach((p) => {
      (p.tags || []).forEach((t) => {
        freq[t] = (freq[t] || 0) + 1;
      });
    });
    const entries = Object.entries(freq).sort((a, b) => b[1] - a[1]);
    return entries.map(([tag, count], i) => ({
      tag,
      count,
      hue: (i * 47 + 210) % 360,
    }));
  }, [papersData]);

  const filteredPapers = useMemo(() => {
    if (!papersData?.items) return [];
    let papers = papersData.items;
    if (activeTag) {
      papers = papers.filter((p) => (p.tags || []).includes(activeTag));
    }
    if (search) {
      const q = search.toLowerCase();
      papers = papers.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.tags || []).some((t) => t.toLowerCase().includes(q))
      );
    }
    return papers.map((p) => ({
      id: p.id,
      title: p.title,
      authors: p.metadata?.authors?.join(", ") || "Unknown",
      tags: p.tags || [],
    }));
  }, [papersData, activeTag, search]);

  const maxCount = Math.max(...tags.map((t) => t.count), 1);
  const getBubbleSize = (count: number) => {
    const min = 64;
    const max = 160;
    return min + ((count - 1) / (maxCount - 1 || 1)) * (max - min);
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Globe className="h-8 w-8 text-primary" />
          Research Topic Map
        </h1>
        <p className="text-muted-foreground mt-1">
          Explore your research landscape by topic frequency
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Topic Cloud
            </CardTitle>
            {activeTag && (
              <Badge
                variant="secondary"
                className="cursor-pointer gap-1"
                onClick={() => setActiveTag(null)}
              >
                {activeTag}
                <X className="h-3 w-3" />
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
            </div>
          ) : tags.length === 0 ? (
            <div className="text-center py-16">
              <Tag className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">No tags found on your papers</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-4 items-center justify-center min-h-[320px] p-6">
              {tags.map(({ tag, count, hue }) => {
                const size = getBubbleSize(count);
                return (
                  <motion.button
                    key={tag}
                    layout
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                    className="rounded-full flex flex-col items-center justify-center gap-1 shadow-md transition-shadow hover:shadow-xl cursor-pointer"
                    style={{
                      width: size,
                      height: size,
                      backgroundColor: `hsl(${hue}, 65%, ${
                        activeTag === tag ? 75 : 88
                      }%)`,
                      border:
                        activeTag === tag
                          ? `3px solid hsl(${hue}, 70%, 45%)`
                          : "2px solid transparent",
                    }}
                  >
                    <span
                      className="font-semibold text-center px-2 line-clamp-2 leading-tight"
                      style={{
                        fontSize: `${Math.max(11, size * 0.1)}px`,
                        color: `hsl(${hue}, 40%, 20%)`,
                      }}
                    >
                      {tag}
                    </span>
                    <span
                      className="font-bold"
                      style={{
                        fontSize: `${Math.max(10, size * 0.09)}px`,
                        color: `hsl(${hue}, 50%, 35%)`,
                      }}
                    >
                      {count}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              {activeTag ? `Papers tagged "${activeTag}"` : "All Papers"}
            </CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Filter papers..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredPapers.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">
                {activeTag
                  ? "No papers match this topic"
                  : "No papers available"}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredPapers.map((paper) => (
                <motion.div
                  key={paper.id}
                  layout
                  className="p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <p className="text-sm font-medium line-clamp-2">
                    {paper.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {paper.authors}
                  </p>
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {paper.tags.map((t) => (
                      <Badge
                        key={t}
                        variant={t === activeTag ? "default" : "secondary"}
                        className="cursor-pointer text-xs"
                        onClick={() => setActiveTag(t === activeTag ? null : t)}
                      >
                        {t}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
