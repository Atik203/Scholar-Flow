"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useGetNoteQuery, useCreateNoteMutation, useUpdateNoteMutation } from "@/redux/api/noteApi";
import { showErrorToast, showSuccessToast } from "@/components/providers/ToastProvider";
import { formatDistanceToNow } from "date-fns";
import { 
  Save, 
  X, 
  Tag, 
  Lock, 
  Globe, 
  FileText,
  Loader2 
} from "lucide-react";

interface NoteEditorProps {
  noteId?: string | null;
  paperId?: string;
  onClose: () => void;
  className?: string;
}

export function NoteEditor({ 
  noteId, 
  paperId, 
  onClose, 
  className = "" 
}: NoteEditorProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isPrivate, setIsPrivate] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const isEditing = !!noteId;

  // Fetch note data if editing
  const { data: noteData, isLoading } = useGetNoteQuery(noteId!, {
    skip: !noteId,
  });

  const [createNote] = useCreateNoteMutation();
  const [updateNote] = useUpdateNoteMutation();

  // Load note data when editing
  useEffect(() => {
    if (noteData?.data) {
      const note = noteData.data;
      setTitle(note.title);
      setContent(note.content);
      setTags(note.tags);
      setIsPrivate(note.isPrivate);
    }
  }, [noteData]);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      showErrorToast("Title and content are required");
      return;
    }

    setIsSaving(true);
    try {
      if (isEditing) {
        await updateNote({
          id: noteId!,
          data: {
            title: title.trim(),
            content: content.trim(),
            tags,
            isPrivate,
          },
        }).unwrap();
        showSuccessToast("Note updated successfully");
      } else {
        await createNote({
          paperId,
          title: title.trim(),
          content: content.trim(),
          tags,
          isPrivate,
        }).unwrap();
        showSuccessToast("Note created successfully");
      }
      onClose();
    } catch (error: any) {
      showErrorToast(error.data?.message || "Failed to save note");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleSave();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {isEditing ? "Edit Note" : "Create Note"}
          </CardTitle>
          <div className="flex items-center gap-2">
            {isEditing && noteData?.data && (
              <span className="text-xs text-muted-foreground">
                Updated {formatDistanceToNow(new Date(noteData.data.updatedAt), { addSuffix: true })}
              </span>
            )}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="note-title">Title</Label>
          <Input
            id="note-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter note title..."
            onKeyDown={handleKeyDown}
            disabled={isSaving}
          />
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label>Tags</Label>
          <div className="flex items-center gap-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Add a tag..."
              onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
              disabled={isSaving}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddTag}
              disabled={!tagInput.trim() || isSaving}
            >
              <Tag className="h-4 w-4" />
            </Button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-xs cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => handleRemoveTag(tag)}
                >
                  {tag} ×
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Privacy Setting */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isPrivate ? (
              <Lock className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Globe className="h-4 w-4 text-muted-foreground" />
            )}
            <Label htmlFor="note-privacy">
              {isPrivate ? "Private Note" : "Public Note"}
            </Label>
          </div>
          <Switch
            id="note-privacy"
            checked={!isPrivate}
            onCheckedChange={(checked) => setIsPrivate(!checked)}
            disabled={isSaving}
          />
        </div>

        {/* Content */}
        <div className="flex-1 space-y-2">
          <Label htmlFor="note-content">Content</Label>
          <Textarea
            id="note-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your research notes here..."
            className="flex-1 min-h-[300px] resize-none"
            onKeyDown={handleKeyDown}
            disabled={isSaving}
          />
          <div className="text-xs text-muted-foreground">
            Press Ctrl+Enter to save, Esc to cancel
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving || !title.trim() || !content.trim()}>
            {isSaving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {isEditing ? "Update" : "Create"} Note
          </Button>
        </div>
      </CardContent>
    </div>
  );
}
