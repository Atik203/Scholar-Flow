"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetNoteFullQuery } from "@/redux/api/notebookApi";
import { useAppSelector } from "@/redux/hooks";
import { selectAccessToken } from "@/redux/auth/authSlice";
import { ArrowLeft, Edit3, FileText, Hash, Star } from "lucide-react";
import Link from "next/link";
import { use } from "react";

function getInitials(name?: string | null): string {
  if (!name) return "U";
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export default function NoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const token = useAppSelector(selectAccessToken);
  const { data, isLoading } = useGetNoteFullQuery(id, { skip: !token });

  if (isLoading) return <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12" />)}</div>;
  const note = data?.data;
  if (!note) {
    return (
      <div className="text-center py-20 space-y-4">
        <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
        <h2 className="text-xl font-semibold">Note not found</h2>
        <Button asChild variant="outline"><Link href="/dashboard/notes"><ArrowLeft className="h-4 w-4 mr-2" />Back to notes</Link></Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm"><Link href="/dashboard/notes"><ArrowLeft className="h-4 w-4 mr-1" />All notes</Link></Button>
      </div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            {note.isStarred && <Star className="h-6 w-6 fill-yellow-500 text-yellow-500" />}
            {note.title}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Updated {new Date(note.updatedAt).toLocaleString()} • {note.wordCount} words
          </p>
        </div>
        <Button asChild variant="outline"><Link href="/dashboard/notes"><Edit3 className="h-4 w-4 mr-2" />Open in editor</Link></Button>
      </div>
      <Card>
        <CardContent className="pt-6">
          <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap text-sm">{note.content}</div>
        </CardContent>
      </Card>
      {note.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {note.tags.map((tag) => (
            <span key={tag} className="px-2 py-1 bg-muted rounded-full text-xs text-muted-foreground flex items-center gap-1">
              <Hash className="h-3 w-3" />{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
