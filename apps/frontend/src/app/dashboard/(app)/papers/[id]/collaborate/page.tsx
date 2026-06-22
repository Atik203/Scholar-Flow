"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EditorContent, useEditor } from "@tiptap/react";
import { Collaboration } from "@tiptap/extension-collaboration";
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
import { use, useCallback, useEffect, useState } from "react";

import { useCollabSync } from "@/lib/yjs/useCollabSync";
import { useGetEditorPaperQuery } from "@/redux/api/paperApi";

interface Props {
  params: Promise<{ id: string }>;
}

export default function CollaborativeEditorPage({ params }: Props) {
  const { id: paperId } = use(params);
  const { data: paperData } = useGetEditorPaperQuery(paperId);
  const paper = paperData?.data;
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  const { ydoc } = useCollabSync({
    paperId,
    initialContent: paper?.contentHtml ?? null,
    enabled: true,
  });

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
    [ydoc]
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
            <Users className="h-4 w-4" /> Collaborating
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" /> {wordCount} words
          </span>
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
        <span>Real-time collaboration enabled</span>
      </div>
    </div>
  );
}
