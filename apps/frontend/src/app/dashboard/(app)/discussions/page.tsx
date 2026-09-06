"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { showErrorToast, showSuccessToast } from "@/components/providers/ToastProvider";
import { useListMyDiscussionsQuery, useTogglePinMutation, useToggleResolveMutation, useDeleteDiscussionMutation } from "@/redux/api/discussionApi";
import { useAppSelector } from "@/redux/hooks";
import { selectAccessToken } from "@/redux/auth/authSlice";
import { motion } from "motion/react";
import { AnimatePresence } from "motion/react";
import { CheckCircle, ChevronDown, ChevronUp, Filter, Hash, Loader2, MessageSquare, MoreHorizontal, Pin, Plus, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

function cn(...classes: (string | undefined | null | false)[]): string { return classes.filter(Boolean).join(" "); }

function timeAgo(iso: string): string {
  const d = new Date(iso).getTime();
  const now = Date.now();
  const m = Math.floor((now - d) / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

function getInitials(name?: string | null): string {
  if (!name) return "U";
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export default function DiscussionsPage() {
  const token = useAppSelector(selectAccessToken);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "resolved" | "unresolved">("");
  const [pinnedFilter, setPinnedFilter] = useState<"" | "pinned" | "unpinned">("");
  const [tagFilter, setTagFilter] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data, isLoading, isFetching, refetch } = useListMyDiscussionsQuery(
    {
      isResolved: statusFilter === "resolved" ? true : statusFilter === "unresolved" ? false : undefined,
      isPinned: pinnedFilter === "pinned" ? true : pinnedFilter === "unpinned" ? false : undefined,
      limit: 50,
    },
    { skip: !token }
  );

  const [togglePin] = useTogglePinMutation();
  const [toggleResolve] = useToggleResolveMutation();
  const [deleteThread] = useDeleteDiscussionMutation();

  const threads = data?.data?.threads || [];

  const filtered = useMemo(() => {
    return threads.filter((t) => {
      if (search) {
        const q = search.toLowerCase();
        const author = t.user?.name || "";
        if (!t.title.toLowerCase().includes(q) && !t.content.toLowerCase().includes(q) && !author.toLowerCase().includes(q)) {
          return false;
        }
      }
      if (tagFilter && !t.tags.some((tag) => tag.toLowerCase().includes(tagFilter.toLowerCase()))) {
        return false;
      }
      return true;
    });
  }, [threads, search, tagFilter]);

  const onPin = async (id: string) => {
    try {
      await togglePin(id).unwrap();
      showSuccessToast("Updated");
    } catch (e: any) { showErrorToast(e?.data?.message || "Failed"); }
  };
  const onResolve = async (id: string) => {
    try {
      await toggleResolve(id).unwrap();
      showSuccessToast("Updated");
    } catch (e: any) { showErrorToast(e?.data?.message || "Failed"); }
  };
  const onDelete = async (id: string) => {
    if (!confirm("Delete this discussion? This cannot be undone.")) return;
    try {
      await deleteThread(id).unwrap();
      showSuccessToast("Deleted");
      refetch();
    } catch (e: any) { showErrorToast(e?.data?.message || "Failed"); }
  };

  return (
    <div className="flex flex-col gap-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Research Discussions</h1>
          <p className="text-muted-foreground mt-1">Collaborate and discuss research topics with your team</p>
        </div>
        <Button asChild><Link href="/dashboard/discussions/new"><Plus className="mr-2 h-4 w-4" />Start Discussion</Link></Button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="rounded-xl border bg-card p-4">
        <div className="flex items-center gap-2 mb-4"><Filter className="h-5 w-5 text-muted-foreground" /><h3 className="font-semibold">Filters</h3></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search discussions..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="h-10 px-3 rounded-lg border bg-background text-sm">
            <option value="">All Status</option>
            <option value="unresolved">Unresolved</option>
            <option value="resolved">Resolved</option>
          </select>
          <select value={pinnedFilter} onChange={(e) => setPinnedFilter(e.target.value as any)} className="h-10 px-3 rounded-lg border bg-background text-sm">
            <option value="">All Discussions</option>
            <option value="pinned">Pinned Only</option>
            <option value="unpinned">Not Pinned</option>
          </select>
          <Input placeholder="Filter by tags..." value={tagFilter} onChange={(e) => setTagFilter(e.target.value)} />
        </div>
      </motion.div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)}</div>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No discussions found</h3>
              <p className="text-muted-foreground mb-4">Start a new discussion to collaborate with your team</p>
              <Button asChild><Link href="/dashboard/discussions/new"><Plus className="mr-2 h-4 w-4" />Start Discussion</Link></Button>
            </CardContent>
          </Card>
        ) : (
          filtered.map((t, i) => {
            const isExpanded = expandedId === t.id;
            const authorName = t.user?.name || "Unknown";
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className={cn("rounded-xl border bg-card p-5 transition-shadow", isExpanded ? "shadow-md" : "hover:shadow-md")}
              >
                <div className="flex items-start gap-3 cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : t.id)}>
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-primary">{getInitials(authorName)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {t.isPinned && <Pin className="h-4 w-4 text-primary" aria-label="Pinned" />}
                      {t.isResolved && <CheckCircle className="h-4 w-4 text-green-500" aria-label="Resolved" />}
                      <h3 className="font-semibold text-foreground">{t.title}</h3>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1 flex-wrap">
                      <span>{authorName}</span>
                      {t.workspace && <><span>•</span><span>{t.workspace.name}</span></>}
                      {t.paper && <><span>•</span><span>{t.paper.title}</span></>}
                      <span>•</span>
                      <span>{timeAgo(t.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" onClick={() => onPin(t.id)} aria-label="Toggle pin">
                      <Pin className={cn("h-4 w-4", t.isPinned && "text-primary")} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onResolve(t.id)} aria-label="Toggle resolved">
                      <CheckCircle className={cn("h-4 w-4", t.isResolved && "text-green-500")} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(t.id)} aria-label="Delete">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2 mt-3">{t.content}</p>

                {t.tags?.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap mt-3">
                    {t.tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">
                        <Hash className="h-3 w-3" />{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 mt-3 border-t">
                  <button
                    onClick={(e) => { e.stopPropagation(); setExpandedId(isExpanded ? null : t.id); }}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <MessageSquare className="h-4 w-4" />
                    {(t._count?.messages ?? 0)} replies
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                  {t.lastReply && !isExpanded && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Last reply:</span>
                      <span className="font-medium">{t.lastReply.user?.name || "Unknown"}</span>
                    </div>
                  )}
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t"
                    >
                      <p className="text-sm whitespace-pre-wrap text-foreground">{t.content}</p>
                      <div className="mt-4 flex items-center gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/dashboard/discussions/${t.id}`}>
                            <MessageSquare className="mr-2 h-4 w-4" />Open thread
                          </Link>
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
        {isFetching && !isLoading && (
          <div className="flex justify-center py-4"><Loader2 className="h-5 w-5 animate-spin" /></div>
        )}
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border bg-card p-6">
        <h3 className="font-semibold mb-4">Discussion Guidelines</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2 text-sm">Best Practices</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Be respectful and constructive in your comments</li>
              <li>• Use clear, descriptive titles for discussions</li>
              <li>• Tag discussions with relevant keywords</li>
              <li>• Mark discussions as resolved when questions are answered</li>
              <li>• Pin important discussions for easy access</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2 text-sm">Discussion Types</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>Questions:</strong> Ask for clarification or help</li>
              <li>• <strong>Ideas:</strong> Share research ideas and insights</li>
              <li>• <strong>Reviews:</strong> Discuss paper findings and methodology</li>
              <li>• <strong>Collaboration:</strong> Coordinate research activities</li>
              <li>• <strong>Feedback:</strong> Provide constructive feedback</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
