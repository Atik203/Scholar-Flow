"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { showErrorToast, showSuccessToast } from "@/components/providers/ToastProvider";
import { useCreateGeneralDiscussionMutation, useCreateDiscussionMutation } from "@/redux/api/discussionApi";
import { ArrowLeft, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewDiscussionPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  const [createGeneral, { isLoading: gLoading }] = useCreateGeneralDiscussionMutation();
  const [createScoped, { isLoading: sLoading }] = useCreateDiscussionMutation();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      showErrorToast("Title and content are required");
      return;
    }
    const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
    try {
      const res = await createGeneral({ title, content, tags }).unwrap();
      showSuccessToast("Discussion created");
      router.push(`/dashboard/discussions/${res.data.id}`);
    } catch (e: any) {
      showErrorToast(e?.data?.message || "Failed to create discussion");
    }
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm"><Link href="/dashboard/discussions"><ArrowLeft className="h-4 w-4 mr-1" />Back</Link></Button>
      </div>
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2"><MessageSquare className="h-7 w-7 text-primary" />Start a Discussion</h1>
        <p className="text-muted-foreground mt-1">Share a question, idea, or topic with your collaborators</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Title</label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What's this discussion about?"
                maxLength={200}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">Content</label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Describe the topic in detail..."
                rows={8}
                maxLength={5000}
                className="w-full rounded-lg border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="tags" className="text-sm font-medium">Tags <span className="text-muted-foreground">(comma-separated)</span></label>
              <Input
                id="tags"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="methodology, literature-review, feedback"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button asChild variant="outline"><Link href="/dashboard/discussions">Cancel</Link></Button>
              <Button type="submit" disabled={gLoading || sLoading}>
                {(gLoading || sLoading) ? "Creating..." : "Create Discussion"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
