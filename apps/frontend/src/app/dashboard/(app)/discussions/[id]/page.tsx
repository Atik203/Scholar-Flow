"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { showErrorToast, showSuccessToast } from "@/components/providers/ToastProvider";
import {
  useGetDiscussionQuery,
  useCreateMessageMutation,
  useTogglePinMutation,
  useToggleResolveMutation,
} from "@/redux/api/discussionApi";
import { useAppSelector } from "@/redux/hooks";
import { selectAccessToken } from "@/redux/auth/authSlice";
import { motion } from "motion/react";
import { ArrowLeft, CheckCircle, Hash, Loader2, MessageSquare, Pin, Send } from "lucide-react";
import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import { use, useState } from "react";
import { LiveDiscussionFeed } from "@/components/discussions/LiveDiscussionFeed";

function cn(...classes: (string | undefined | null | false)[]): string { return classes.filter(Boolean).join(" "); }

function timeAgo(iso: string): string {
  const d = new Date(iso).getTime();
  const m = Math.floor((Date.now() - d) / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return new Date(iso).toLocaleDateString();
}

function getInitials(name?: string | null): string {
  if (!name) return "U";
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export default function DiscussionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const token = useAppSelector(selectAccessToken);
  const [reply, setReply] = useState("");

  const { data, isLoading, refetch } = useGetDiscussionQuery(id, { skip: !token });
  const [createMessage, { isLoading: posting }] = useCreateMessageMutation();
  const [togglePin] = useTogglePinMutation();
  const [toggleResolve] = useToggleResolveMutation();

  if (isLoading) {
    return <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20" />)}</div>;
  }
  if (!data) {
    return (
      <div className="text-center py-20 space-y-4">
        <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground" />
        <h2 className="text-xl font-semibold">Discussion not found</h2>
        <Button asChild variant="outline"><Link href="/dashboard/discussions"><ArrowLeft className="h-4 w-4 mr-2" />Back to discussions</Link></Button>
      </div>
    );
  }

  const thread = data;
  const messages = (thread.messages || []).filter((m: any) => !m.parentId);
  const userName = "You";

  const sendReply = async () => {
    if (!reply.trim()) return;
    try {
      await createMessage({ threadId: id, content: reply.trim() }).unwrap();
      setReply("");
      refetch();
    } catch (e: any) {
      showErrorToast(e?.data?.message || "Failed to post reply");
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm"><Link href="/dashboard/discussions"><ArrowLeft className="h-4 w-4 mr-1" />All discussions</Link></Button>
      </div>

      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={thread.user?.image || undefined} />
            <AvatarFallback>{getInitials(thread.user?.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              {thread.isPinned && <Pin className="h-4 w-4 text-primary" aria-label="Pinned" />}
              {thread.isResolved && <CheckCircle className="h-4 w-4 text-green-500" aria-label="Resolved" />}
              <h1 className="text-2xl font-bold tracking-tight">{thread.title}</h1>
            </div>
            <div className="text-sm text-muted-foreground mt-1 flex items-center gap-2 flex-wrap">
              <span>{thread.user?.name || "Unknown"}</span>
              {thread.workspace && <><span>•</span><span>{thread.workspace.name}</span></>}
              {thread.paper && <><span>•</span><span>{thread.paper.title}</span></>}
              {thread.collection && <><span>•</span><span>{thread.collection.name}</span></>}
              <span>•</span>
              <span>{timeAgo(thread.createdAt)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={async () => { try { await togglePin(id).unwrap(); refetch(); } catch {} }}>
              <Pin className={cn("h-4 w-4 mr-1", thread.isPinned && "text-primary")} />
              {thread.isPinned ? "Unpin" : "Pin"}
            </Button>
            <Button variant="outline" size="sm" onClick={async () => { try { await toggleResolve(id).unwrap(); refetch(); } catch {} }}>
              <CheckCircle className={cn("h-4 w-4 mr-1", thread.isResolved && "text-green-500")} />
              {thread.isResolved ? "Reopen" : "Resolve"}
            </Button>
          </div>
        </div>
      </motion.div>

      <Card>
        <CardContent className="pt-6">
          <p className="text-sm whitespace-pre-wrap">{thread.content}</p>
          {thread.tags?.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap mt-4 pt-4 border-t">
              {thread.tags.map((tag: string) => (
                <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">
                  <Hash className="h-3 w-3" />{tag}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h3 className="font-semibold flex items-center gap-2"><MessageSquare className="h-5 w-5" />{messages.length} {messages.length === 1 ? "Reply" : "Replies"}</h3>
        {messages.length === 0 ? (
          <Card><CardContent className="py-8 text-center text-muted-foreground">Be the first to reply.</CardContent></Card>
        ) : (
          messages.map((m: any, i: number) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="flex gap-3 p-4 rounded-lg bg-muted/30 border">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src={m.user?.image || undefined} />
                <AvatarFallback>{getInitials(m.user?.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">{m.user?.name || "Unknown"}</span>
                  <span className="text-xs text-muted-foreground">{timeAgo(m.createdAt)}</span>
                  {m.isEdited && <Badge variant="secondary" className="text-xs">edited</Badge>}
                </div>
                <p className="text-sm whitespace-pre-wrap">{m.content}</p>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <LiveDiscussionFeed room={`discussion:${id}`} />

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarFallback>{getInitials(userName)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 flex gap-2">
              <Input
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Write a reply..."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendReply();
                  }
                }}
              />
              <Button onClick={sendReply} disabled={posting || !reply.trim()}>
                {posting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
