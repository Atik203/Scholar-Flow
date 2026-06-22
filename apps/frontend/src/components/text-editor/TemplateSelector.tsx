"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { editorTemplates, templateToHtml, EditorTemplate } from "@/lib/editorTemplates";
import type { Editor } from "@tiptap/core";
import { FileText, LayoutTemplate } from "lucide-react";
import { useState } from "react";

interface TemplateSelectorProps {
  editor: Editor | null;
}

export function TemplateSelector({ editor }: TemplateSelectorProps) {
  const [open, setOpen] = useState(false);

  const handleApply = (template: EditorTemplate) => {
    if (!editor) return;
    const html = templateToHtml(template);
    editor
      .chain()
      .focus()
      .clearContent()
      .insertContent(html)
      .run();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" title="Apply Template">
          <LayoutTemplate className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Template</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[70vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Choose a Template</DialogTitle>
          <DialogDescription>
            Select a pre-built template to structure your paper. This will replace the current content.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[50vh]">
          <div className="grid gap-2">
            {editorTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleApply(template)}
                className="w-full text-left p-3 rounded-lg border hover:border-primary/50 hover:bg-accent transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 h-9 w-9 rounded-md bg-primary/10 flex items-center justify-center mt-0.5">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{template.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {template.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {template.sections.slice(0, 4).map((s) => (
                        <span
                          key={s}
                          className="inline-block text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
                        >
                          {s.length > 30 ? s.slice(0, 30) + "..." : s}
                        </span>
                      ))}
                      {template.sections.length > 4 && (
                        <span className="text-[10px] text-muted-foreground">
                          +{template.sections.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
