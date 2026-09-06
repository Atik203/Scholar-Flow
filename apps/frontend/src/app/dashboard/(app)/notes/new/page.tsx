"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { showErrorToast, showSuccessToast } from "@/components/providers/ToastProvider";
import { useCreateNoteInNotebookMutation, useListNotebooksQuery, type NoteType, type NoteVisibility } from "@/redux/api/notebookApi";
import { ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NewNotePage() {
  const router = useRouter();
  const { data: notebooksData } = useListNotebooksQuery({});
  const notebooks = notebooksData?.data || [];
  const [createNote, { isLoading }] = useCreateNoteInNotebookMutation();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [noteType, setNoteType] = useState<NoteType>("QUICK");
  const [visibility, setVisibility] = useState<NoteVisibility>("PRIVATE");
  const [tagsInput, setTagsInput] = useState("");
  const [notebookId, setNotebookId] = useState<string>("");
  const [sectionId, setSectionId] = useState<string>("");

  useEffect(() => {
    if (!notebookId && notebooks.length > 0) {
      setNotebookId(notebooks[0].id);
    }
  }, [notebooks, notebookId]);

  const activeNotebook = notebooks.find((n) => n.id === notebookId);
  const sections = activeNotebook?.sections || [];

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notebookId) {
      showErrorToast("Please select a notebook");
      return;
    }
    if (!title.trim() || !content.trim()) {
      showErrorToast("Title and content are required");
      return;
    }
    const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
    try {
      const res = await createNote({
        notebookId,
        data: {
          title,
          content,
          noteType,
          visibility,
          tags,
          sectionId: sectionId || undefined,
        },
      }).unwrap();
      showSuccessToast("Note created");
      router.push(`/dashboard/notes?selected=${res.data.id}`);
    } catch (e: any) {
      showErrorToast(e?.data?.message || "Failed to create note");
    }
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm"><Link href="/dashboard/notes"><ArrowLeft className="h-4 w-4 mr-1" />Back</Link></Button>
      </div>
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2"><FileText className="h-7 w-7 text-primary" />New Note</h1>
        <p className="text-muted-foreground mt-1">Create a research note in one of your notebooks</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Title</label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Note title" maxLength={200} required />
            </div>
            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">Content</label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Markdown supported. Use # for heading, - for list..."
                rows={10}
                maxLength={20000}
                className="w-full rounded-lg border bg-background p-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30"
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Notebook</label>
                <select value={notebookId} onChange={(e) => { setNotebookId(e.target.value); setSectionId(""); }} className="w-full h-10 px-3 rounded-lg border bg-background text-sm" required>
                  <option value="">Select a notebook</option>
                  {notebooks.map((n) => <option key={n.id} value={n.id}>{n.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Section <span className="text-muted-foreground">(optional)</span></label>
                <select value={sectionId} onChange={(e) => setSectionId(e.target.value)} className="w-full h-10 px-3 rounded-lg border bg-background text-sm" disabled={!activeNotebook}>
                  <option value="">No section</option>
                  {sections.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <select value={noteType} onChange={(e) => setNoteType(e.target.value as NoteType)} className="w-full h-10 px-3 rounded-lg border bg-background text-sm">
                  <option value="QUICK">Quick Note</option>
                  <option value="LITERATURE">Literature Review</option>
                  <option value="METHODOLOGY">Methodology</option>
                  <option value="FINDINGS">Findings</option>
                  <option value="IDEA">Research Idea</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Visibility</label>
                <select value={visibility} onChange={(e) => setVisibility(e.target.value as NoteVisibility)} className="w-full h-10 px-3 rounded-lg border bg-background text-sm">
                  <option value="PRIVATE">Private</option>
                  <option value="WORKSPACE">Workspace</option>
                  <option value="PUBLIC">Public</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="tags" className="text-sm font-medium">Tags <span className="text-muted-foreground">(comma-separated)</span></label>
              <Input id="tags" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="transformers, attention, deep-learning" />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button asChild variant="outline"><Link href="/dashboard/notes">Cancel</Link></Button>
              <Button type="submit" disabled={isLoading}>{isLoading ? "Creating..." : "Create Note"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
