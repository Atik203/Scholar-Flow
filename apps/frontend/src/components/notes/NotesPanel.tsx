"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { NoteEditor } from "./NoteEditor";
import { NoteList } from "./NoteList";
import { NoteSearch } from "./NoteSearch";
import { useGetNotesQuery } from "@/redux/api/noteApi";
import { StickyNote, Plus, Search, Filter } from "lucide-react";

interface NotesPanelProps {
  paperId?: string;
  className?: string;
}

export function NotesPanel({ paperId, className = "" }: NotesPanelProps) {
  const [showEditor, setShowEditor] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  // Fetch notes
  const { data: notesData, isLoading } = useGetNotesQuery({
    paperId,
    search: searchQuery || undefined,
  });

  const notes = notesData?.data || [];

  const handleNoteSelect = (noteId: string) => {
    setSelectedNoteId(noteId);
    setShowEditor(true);
  };

  const handleNoteCreate = () => {
    setSelectedNoteId(null);
    setShowEditor(true);
  };

  const handleEditorClose = () => {
    setShowEditor(false);
    setSelectedNoteId(null);
  };

  const handleSearchToggle = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      setSearchQuery("");
    }
  };

  return (
    <div className={`flex h-full ${className}`}>
      {/* Notes List Sidebar */}
      <div className="w-80 border-r bg-background flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <StickyNote className="h-5 w-5" />
              <CardTitle className="text-lg">Research Notes</CardTitle>
              <Badge variant="secondary">{notes.length}</Badge>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSearchToggle}
                className="h-8 w-8 p-0"
              >
                <Search className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNoteCreate}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 p-0">
          {/* Search */}
          {showSearch && (
            <div className="p-4 border-b">
              <NoteSearch
                query={searchQuery}
                onQueryChange={setSearchQuery}
                onClose={() => setShowSearch(false)}
              />
            </div>
          )}

          {/* Notes List */}
          <ScrollArea className="flex-1">
            <div className="p-4">
              <NoteList
                notes={notes}
                selectedNoteId={selectedNoteId}
                onNoteSelect={handleNoteSelect}
                isLoading={isLoading}
              />
            </div>
          </ScrollArea>
        </CardContent>
      </div>

      {/* Note Editor */}
      {showEditor && (
        <div className="flex-1 flex flex-col">
          <NoteEditor
            noteId={selectedNoteId}
            paperId={paperId}
            onClose={handleEditorClose}
          />
        </div>
      )}

      {/* Empty State */}
      {!showEditor && (
        <div className="flex-1 flex items-center justify-center bg-muted/50">
          <div className="text-center">
            <StickyNote className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No note selected</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Select a note from the list or create a new one
            </p>
            <Button onClick={handleNoteCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Create Note
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
