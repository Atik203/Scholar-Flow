"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { showErrorToast, showSuccessToast } from "@/components/providers/ToastProvider";
import {
  useCreateNotebookMutation,
  useCreateNoteInNotebookMutation,
  useCreateSectionMutation,
  useDeleteNotebookMutation,
  useGetNotebookQuery,
  useListNotebooksQuery,
  useListNotesQuery,
  useUpdateNoteMetadataMutation,
  type NoteType,
  type NoteVisibility,
  type Notebook as NotebookType,
  type ResearchNoteFull,
} from "@/redux/api/notebookApi";
import { useAppSelector } from "@/redux/hooks";
import { selectAccessToken } from "@/redux/auth/authSlice";
import { motion, AnimatePresence } from "motion/react";
import {
  BookOpen, Brain, Edit3, Eye, FileText, Hash, Loader2, Lock, MoreHorizontal, Plus, Search, Sparkles, Star, Trash2, Users, Globe, X
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";

function cn(...classes: (string | undefined | null | false)[]): string { return classes.filter(Boolean).join(" "); }

const noteTypeConfig: Record<NoteType, { label: string; color: string; icon: any }> = {
  QUICK: { label: "Quick Note", color: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400", icon: FileText },
  LITERATURE: { label: "Literature Review", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", icon: BookOpen },
  METHODOLOGY: { label: "Methodology", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", icon: Edit3 },
  FINDINGS: { label: "Findings", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", icon: Sparkles },
  IDEA: { label: "Research Idea", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400", icon: Brain },
};

const visibilityConfig: Record<NoteVisibility, { label: string; icon: any }> = {
  PRIVATE: { label: "Private", icon: Lock },
  WORKSPACE: { label: "Workspace", icon: Users },
  PUBLIC: { label: "Public", icon: Globe },
};

const colorMap: Record<string, string> = {
  blue: "border-blue-200 bg-blue-50 dark:bg-blue-950/20",
  purple: "border-purple-200 bg-purple-50 dark:bg-purple-950/20",
  green: "border-green-200 bg-green-50 dark:bg-green-950/20",
  orange: "border-orange-200 bg-orange-50 dark:bg-orange-950/20",
  pink: "border-pink-200 bg-pink-50 dark:bg-pink-950/20",
};

export default function NotesPage() {
  const token = useAppSelector(selectAccessToken);
  const { data: notebooksData, isLoading: loadingNotebooks, refetch: refetchNotebooks } = useListNotebooksQuery({}, { skip: !token });
  const [createNotebook] = useCreateNotebookMutation();
  const [createSection] = useCreateSectionMutation();
  const [deleteNotebook] = useDeleteNotebookMutation();

  const notebooks: NotebookType[] = notebooksData?.data || [];
  const [activeNotebookId, setActiveNotebookId] = useState<string | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<NoteType | "all">("all");
  const [search, setSearch] = useState("");
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"edit" | "preview">("preview");
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [showNewNotebook, setShowNewNotebook] = useState(false);
  const [newNotebookName, setNewNotebookName] = useState("");
  const [showAISummary, setShowAISummary] = useState(false);
  const [createNoteInNotebook] = useCreateNoteInNotebookMutation();
  const [updateNoteMetadata] = useUpdateNoteMetadataMutation();
  const [showNewSection, setShowNewSection] = useState(false);
  const [newSectionName, setNewSectionName] = useState("");

  // Default to first notebook once loaded
  useEffect(() => {
    if (!activeNotebookId && notebooks.length > 0) {
      setActiveNotebookId(notebooks[0].id);
    }
  }, [notebooks, activeNotebookId]);

  const { data: notebookDetail, refetch: refetchNotebook } = useGetNotebookQuery(activeNotebookId as string, { skip: !activeNotebookId || !token });
  const { data: notesData, isLoading: loadingNotes, refetch: refetchNotes } = useListNotesQuery(
    {
      notebookId: activeNotebookId as string,
      query: {
        sectionId: activeSectionId || undefined,
        noteType: typeFilter === "all" ? undefined : typeFilter,
        search: search || undefined,
        limit: 100,
      },
    },
    { skip: !activeNotebookId || !token }
  );

  const notes: ResearchNoteFull[] = notesData?.data || [];

  // Default to first note once loaded
  useEffect(() => {
    if (!selectedNoteId && notes.length > 0) {
      setSelectedNoteId(notes[0].id);
    }
  }, [notes, selectedNoteId]);

  const selectedNote = useMemo(() => notes.find((n) => n.id === selectedNoteId), [notes, selectedNoteId]);

  useEffect(() => {
    if (selectedNote) {
      setEditTitle(selectedNote.title);
      setEditContent(selectedNote.content);
    }
  }, [selectedNote?.id]);

  const sections = notebookDetail?.data?.sections || [];

  const onCreateNotebook = async () => {
    if (!newNotebookName.trim()) return;
    try {
      const res = await createNotebook({ name: newNotebookName.trim() }).unwrap();
      showSuccessToast("Notebook created");
      setNewNotebookName("");
      setShowNewNotebook(false);
      refetchNotebooks();
      setActiveNotebookId(res.data.id);
    } catch (e: any) {
      showErrorToast(e?.data?.message || "Failed");
    }
  };

  const onCreateSection = async () => {
    if (!activeNotebookId || !newSectionName.trim()) return;
    try {
      await createSection({ notebookId: activeNotebookId, data: { name: newSectionName.trim() } }).unwrap();
      setNewSectionName("");
      setShowNewSection(false);
      refetchNotebook();
    } catch (e: any) {
      showErrorToast(e?.data?.message || "Failed");
    }
  };

  const onDeleteNotebook = async (id: string) => {
    if (!confirm("Delete this notebook? Notes will be preserved.")) return;
    try {
      await deleteNotebook(id).unwrap();
      showSuccessToast("Notebook deleted");
      setActiveNotebookId(null);
      setSelectedNoteId(null);
      refetchNotebooks();
    } catch (e: any) {
      showErrorToast(e?.data?.message || "Failed");
    }
  };

  const onCreateNote = async () => {
    if (!activeNotebookId) return;
    try {
      const res = await createNoteInNotebook({
        notebookId: activeNotebookId,
        data: {
          title: "Untitled Note",
          content: "Start writing...",
          sectionId: activeSectionId || undefined,
        },
      }).unwrap();
      refetchNotes();
      setSelectedNoteId(res.data.id);
      setViewMode("edit");
    } catch (e: any) {
      showErrorToast(e?.data?.message || "Failed to create note");
    }
  };

  const onSave = async () => {
    if (!selectedNote) return;
    try {
      await updateNoteMetadata({
        id: selectedNote.id,
        data: { title: editTitle, content: editContent },
      }).unwrap();
      showSuccessToast("Saved");
      refetchNotes();
    } catch (e: any) {
      showErrorToast(e?.data?.message || "Failed to save");
    }
  };

  const onToggleStar = async (note: ResearchNoteFull) => {
    try {
      await updateNoteMetadata({ id: note.id, data: { isStarred: !note.isStarred } }).unwrap();
      refetchNotes();
    } catch (e: any) {
      showErrorToast(e?.data?.message || "Failed");
    }
  };

  const renderPreview = (content: string) => {
    return content.split("\n").map((line, i) => {
      if (line.startsWith("# ")) return <h1 key={i} className="text-2xl font-bold mt-6 mb-4">{line.slice(2)}</h1>;
      if (line.startsWith("## ")) return <h2 key={i} className="text-xl font-semibold mt-4 mb-3">{line.slice(3)}</h2>;
      if (line.startsWith("### ")) return <h3 key={i} className="text-lg font-medium mt-3 mb-2">{line.slice(4)}</h3>;
      if (line.startsWith("- ")) return <li key={i} className="ml-4">{line.slice(2)}</li>;
      if (line === "") return <br key={i} />;
      return <p key={i} className="my-2">{line}</p>;
    });
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2"><Edit3 className="h-6 w-6 text-primary" />Research Notes</h1>
          <p className="text-sm text-muted-foreground">Notebook-style research notes with type filters and paper linking</p>
        </div>
        <Button asChild variant="outline" size="sm"><Link href="/dashboard/notes/new"><Plus className="h-4 w-4 mr-1" />New Note</Link></Button>
      </div>

      <div className="flex-1 flex rounded-xl border bg-card overflow-hidden">
        {/* LEFT PANE: Notebooks + Sections */}
        <div className="w-64 border-r flex flex-col flex-shrink-0">
          <div className="p-3 border-b">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-sm">Notebooks</h3>
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => setShowNewNotebook(true)} aria-label="New notebook">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {showNewNotebook && (
              <div className="flex gap-1">
                <Input value={newNotebookName} onChange={(e) => setNewNotebookName(e.target.value)} placeholder="Notebook name..." autoFocus className="h-8 text-sm" onKeyDown={(e) => e.key === "Enter" && onCreateNotebook()} />
                <Button size="sm" className="h-8" onClick={onCreateNotebook}>Add</Button>
              </div>
            )}
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {loadingNotebooks ? (
              Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12" />)
            ) : notebooks.map((nb) => (
              <div key={nb.id}>
                <button
                  onClick={() => { setActiveNotebookId(nb.id); setActiveSectionId(null); setSelectedNoteId(null); }}
                  className={cn(
                    "w-full text-left p-2 rounded-lg transition-colors flex items-center justify-between gap-2",
                    activeNotebookId === nb.id ? "bg-primary/10 border border-primary/30" : "hover:bg-muted"
                  )}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={cn("h-3 w-3 rounded-sm flex-shrink-0", `bg-${nb.color}-500`)} style={{ background: nb.color === "blue" ? "#3b82f6" : nb.color === "purple" ? "#a855f7" : nb.color === "green" ? "#22c55e" : nb.color === "orange" ? "#f97316" : "#ec4899" }} />
                    <span className="text-sm font-medium truncate">{nb.name}</span>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {nb.isStarred && <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />}
                    <span className="text-xs text-muted-foreground">{nb.noteCount ?? 0}</span>
                  </div>
                </button>
                {activeNotebookId === nb.id && (
                  <div className="ml-4 mt-1 space-y-0.5">
                    {sections.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => { setActiveSectionId(s.id === activeSectionId ? null : s.id); setSelectedNoteId(null); }}
                        className={cn(
                          "w-full text-left px-2 py-1.5 rounded text-xs transition-colors flex items-center justify-between",
                          activeSectionId === s.id ? "bg-primary/10 text-primary" : "hover:bg-muted"
                        )}
                      >
                        <span className="truncate">{s.name}</span>
                        <span className="text-muted-foreground">{s.noteCount ?? 0}</span>
                      </button>
                    ))}
                    <button
                      onClick={() => { setActiveSectionId(null); }}
                      className={cn("w-full text-left px-2 py-1.5 rounded text-xs transition-colors", !activeSectionId ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/50")}
                    >
                      All notes
                    </button>
                    <Button variant="ghost" size="sm" className="w-full justify-start text-xs h-7 mt-1" onClick={() => setShowNewSection(true)}>
                      <Plus className="h-3 w-3 mr-1" />Add section
                    </Button>
                    {showNewSection && (
                      <div className="flex gap-1 mt-1">
                        <Input value={newSectionName} onChange={(e) => setNewSectionName(e.target.value)} placeholder="Section..." className="h-7 text-xs" onKeyDown={(e) => e.key === "Enter" && onCreateSection()} />
                        <Button size="sm" className="h-7 text-xs" onClick={onCreateSection}>Add</Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* MIDDLE PANE: Notes List */}
        <div className="w-80 border-r flex flex-col flex-shrink-0">
          <div className="p-3 border-b space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search notes..." className="pl-9 h-9" />
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button onClick={() => setTypeFilter("all")} className={cn("px-2.5 py-1 rounded-full text-xs font-medium transition-colors", typeFilter === "all" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80")}>
                All
              </button>
              {(Object.keys(noteTypeConfig) as NoteType[]).map((t) => (
                <button key={t} onClick={() => setTypeFilter(t)} className={cn("px-2.5 py-1 rounded-full text-xs font-medium transition-colors", typeFilter === t ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80")}>
                  {noteTypeConfig[t].label.split(" ")[0]}
                </button>
              ))}
            </div>
            <Button onClick={onCreateNote} size="sm" className="w-full" disabled={!activeNotebookId}>
              <Plus className="h-4 w-4 mr-1" />New Note
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {loadingNotes ? (
              Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16" />)
            ) : notes.length === 0 ? (
              <div className="text-center text-muted-foreground py-8 px-3">
                <FileText className="h-10 w-10 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No notes here</p>
                <p className="text-xs mt-1">Create one to get started</p>
              </div>
            ) : (
              notes.map((n, i) => {
                const TypeIcon = noteTypeConfig[n.noteType].icon;
                const VisIcon = visibilityConfig[n.visibility].icon;
                return (
                  <motion.button
                    key={n.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => { setSelectedNoteId(n.id); setViewMode("preview"); }}
                    className={cn("w-full p-3 rounded-lg text-left transition-colors", selectedNoteId === n.id ? "bg-primary/10 border border-primary/30" : "hover:bg-muted")}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="text-sm font-medium line-clamp-1 flex-1">{n.title}</h4>
                      {n.isStarred && <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500 flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{n.excerpt || n.content.slice(0, 80)}</p>
                    <div className="flex items-center gap-1.5">
                      <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-medium", noteTypeConfig[n.noteType].color)}>
                        {noteTypeConfig[n.noteType].label.split(" ")[0]}
                      </span>
                      <VisIcon className="h-3 w-3 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground ml-auto">{n.wordCount || 0}w</span>
                    </div>
                  </motion.button>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT PANE: Editor / Preview */}
        <div className="flex-1 flex flex-col min-w-0">
          {selectedNote ? (
            <>
              <div className="p-4 border-b flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {React.createElement(noteTypeConfig[selectedNote.noteType].icon, { className: "h-5 w-5 text-primary" })}
                  <div className="min-w-0 flex-1">
                    {viewMode === "edit" ? (
                      <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="text-lg font-semibold h-9" />
                    ) : (
                      <h2 className="text-lg font-semibold truncate">{selectedNote.title}</h2>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Updated {new Date(selectedNote.updatedAt).toLocaleDateString()} • {selectedNote.wordCount || 0} words
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => onToggleStar(selectedNote)} aria-label="Toggle star">
                    <Star className={cn("h-5 w-5", selectedNote.isStarred && "fill-yellow-500 text-yellow-500")} />
                  </Button>
                  <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
                    <Button variant={viewMode === "edit" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("edit")} className="h-7">
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button variant={viewMode === "preview" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("preview")} className="h-7">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                  {viewMode === "edit" && (
                    <Button size="sm" onClick={onSave}>Save</Button>
                  )}
                  <Button size="sm" variant="outline" onClick={() => setShowAISummary((v) => !v)}>
                    <Sparkles className="h-4 w-4 mr-1" />AI
                  </Button>
                </div>
              </div>

              <AnimatePresence>
                {showAISummary && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-b">
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex-shrink-0">
                          <Brain className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-1 text-sm">AI Summary (Phase 8)</h4>
                          <p className="text-xs text-purple-700 dark:text-purple-300">AI summarization will be enabled in Phase 8 (Global AI Assistant).</p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setShowAISummary(false)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex-1 overflow-y-auto">
                <div className="p-6 max-w-4xl mx-auto">
                  {viewMode === "edit" ? (
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full h-full min-h-[500px] bg-transparent resize-none focus:outline-none font-mono text-sm leading-relaxed"
                      placeholder="Start writing your research notes..."
                    />
                  ) : (
                    <div className="prose dark:prose-invert max-w-none">
                      {renderPreview(selectedNote.content)}
                    </div>
                  )}
                  {selectedNote.tags?.length > 0 && viewMode === "preview" && (
                    <div className="mt-6 pt-4 border-t">
                      <div className="flex flex-wrap gap-2">
                        {selectedNote.tags.map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-muted rounded-full text-xs text-muted-foreground flex items-center gap-1">
                            <Hash className="h-3 w-3" />{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center p-8">
              <div>
                <Edit3 className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
                <h3 className="text-xl font-semibold mb-2">No Note Selected</h3>
                <p className="text-muted-foreground mb-4">Select a note from the sidebar or create a new one</p>
                <Button onClick={onCreateNote} disabled={!activeNotebookId}>
                  <Plus className="h-4 w-4 mr-2" />Create Note
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
