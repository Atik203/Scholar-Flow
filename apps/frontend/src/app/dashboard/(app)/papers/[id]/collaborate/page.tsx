"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EditorContent, useEditor } from "@tiptap/react";
import { Collaboration } from "@tiptap/extension-collaboration";
import { CollaborationCursor } from "@tiptap/extension-collaboration-cursor";
import { Highlight } from "@tiptap/extension-highlight";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { CharacterCount } from "@tiptap/extension-character-count";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { StarterKit } from "@tiptap/starter-kit";
import { ArrowLeft, Clock, Users } from "lucide-react";
import Link from "next/link";
import { use, useState } from "react";

import { useCollabSync } from "@/lib/yjs/useCollabSync";
import { useGetEditorPaperQuery } from "@/redux/api/paperApi";

const USER_COLORS = [
  "#958DF1", "#F98181", "#FBBC88", "#FAF594", "#70CFF8",
  "#94FADB", "#B9F18D", "#C3E2C2", "#EAECCC", "#AFC8AD",
  "#E8A87C", "#D4A5A5", "#9B72AA", "#7EC8E3", "#B0E57C",
];

function getUserColor(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return USER_COLORS[Math.abs(hash) % USER_COLORS.length];
}

interface Props {
  params: Promise<{ id: string }>;
}

export default function CollaborativeEditorPage({ params }: Props) {
  const { id: paperId } = use(params);
  const { data: paperData } = useGetEditorPaperQuery(paperId);
  const paper = paperData?.data;
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  const { ydoc, awareness } = useCollabSync({
    paperId,
    initialContent: paper?.contentHtml ?? null,
    enabled: true,
  });

  // Collect remote user states for presence display
  const remoteUsers =
    Array.from(awareness?.getStates?.() ?? []).map(([clientId, state]) => ({
      clientId,
      name: state?.user?.name || "Anonymous",
      color: state?.user?.color || "#666",
    })).filter((u) => u.clientId !== ydoc.clientID);

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          horizontalRule: false,
          link: { openOnClick: false },
        }),
        TextAlign.configure({ types: ["heading", "paragraph"] }),
        TaskList,
        TaskItem.configure({ nested: true }),
        Highlight.configure({ multicolor: true }),
        Typography,
        Superscript,
        Subscript,
        CharacterCount,
        Collaboration.configure({ document: ydoc }),
        CollaborationCursor.configure({
          provider: awareness || undefined,
          user: {
            name: "Me",
            color: getUserColor(ydoc.clientID.toString()),
          },
        }),
      ],
      editable: true,
      autofocus: true,
      onUpdate() {
        if (editor) {
          setWordCount(editor.storage?.characterCount?.words?.() ?? 0);
          setCharCount(editor.storage?.characterCount?.characters?.() ?? 0);
        }
      },
      editorProps: {
        attributes: {
          class:
            "prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none max-w-none min-h-[50vh] p-6",
        },
      },
    },
    [ydoc, awareness]
  );

  if (!paper) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/dashboard/papers/${paperId}`}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Link>
          </Button>
          <h1 className="text-lg font-bold truncate max-w-md">
            {paper.title}
          </h1>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {remoteUsers.length + 1} collaborator{remoteUsers.length !== 0 ? "s" : ""}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" /> {wordCount} words
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 px-1">
        {/* Remote user avatars */}
        <div className="flex items-center -space-x-1.5">
          <div
            className="w-6 h-6 rounded-full border-2 border-background flex items-center justify-center text-[10px] font-bold text-white"
            style={{ backgroundColor: getUserColor(ydoc.clientID.toString()) }}
            title="You"
          >
            M
          </div>
          {remoteUsers.slice(0, 6).map((u) => (
            <div
              key={u.clientId}
              className="w-6 h-6 rounded-full border-2 border-background flex items-center justify-center text-[10px] font-bold text-white"
              style={{ backgroundColor: u.color }}
              title={u.name}
            >
              {u.name.charAt(0).toUpperCase()}
            </div>
          ))}
          {remoteUsers.length > 6 && (
            <div className="w-6 h-6 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-medium text-muted-foreground">
              +{remoteUsers.length - 6}
            </div>
          )}
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <EditorContent editor={editor} />
        </CardContent>
      </Card>

      <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
        <span>
          {wordCount} words &middot; {charCount} characters
        </span>
        <span>Real-time collaboration enabled &middot; offline queue active</span>
      </div>
    </div>
  );
}
