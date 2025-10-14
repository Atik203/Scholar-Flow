"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSearchNotesQuery } from "@/redux/api/noteApi";
import { Search, X, Loader2 } from "lucide-react";

interface NoteSearchProps {
  query: string;
  onQueryChange: (query: string) => void;
  onClose: () => void;
  className?: string;
}

export function NoteSearch({ 
  query, 
  onQueryChange, 
  onClose, 
  className = "" 
}: NoteSearchProps) {
  const [searchQuery, setSearchQuery] = useState(query);

  const { data: searchResults, isLoading } = useSearchNotesQuery(
    { query: searchQuery },
    { skip: !searchQuery.trim() }
  );

  const handleSearch = () => {
    onQueryChange(searchQuery);
  };

  const handleClear = () => {
    setSearchQuery("");
    onQueryChange("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search notes..."
            className="pl-10 pr-10"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
        <Button onClick={handleSearch} disabled={!searchQuery.trim()}>
          Search
        </Button>
        <Button variant="outline" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Search Results */}
      {searchQuery && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {isLoading ? "Searching..." : `Found ${searchResults?.data?.length || 0} notes`}
            </span>
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="text-xs"
              >
                Clear
              </Button>
            )}
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : searchResults?.data && searchResults.data.length > 0 ? (
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {searchResults.data.map((note) => (
                <div
                  key={note.id}
                  className="p-2 text-xs bg-muted rounded cursor-pointer hover:bg-muted/80"
                >
                  <div className="font-medium truncate">{note.title}</div>
                  <div className="text-muted-foreground line-clamp-1">
                    {note.content}
                  </div>
                  {note.tags.length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {note.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : searchQuery ? (
            <div className="text-center py-4 text-muted-foreground text-sm">
              No notes found for "{searchQuery}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
