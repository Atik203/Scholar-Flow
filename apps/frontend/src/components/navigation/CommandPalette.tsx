import { cn } from "@/lib/utils";
import { ArrowDown, ArrowRight, ArrowUp, Command, Search } from "lucide-react";
import * as React from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export interface CommandItem {
  id: string;
  title: string;
  description?: string;
  keywords?: string[];
  icon?: React.ComponentType<{ className?: string }>;
  action: () => void;
  category?: string;
  shortcut?: string[];
}

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  items: CommandItem[];
  placeholder?: string;
  className?: string;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  items,
  placeholder = "Search commands, files, and more...",
  className,
}) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [recentSearches, setRecentSearches] = React.useState<string[]>([]);

  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  // Filter items based on search query
  const filteredItems = React.useMemo(() => {
    if (!searchQuery.trim()) {
      return items;
    }

    const query = searchQuery.toLowerCase();
    return items.filter((item) => {
      const searchableText = [
        item.title.toLowerCase(),
        item.description?.toLowerCase(),
        ...(item.keywords?.map((k) => k.toLowerCase()) || []),
      ].join(" ");

      return searchableText.includes(query);
    });
  }, [items, searchQuery]);

  // Group items by category
  const groupedItems = React.useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};

    filteredItems.forEach((item) => {
      const category = item.category || "General";
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(item);
    });

    return groups;
  }, [filteredItems]);

  // Handle keyboard navigation
  const handleKeyDown = React.useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < filteredItems.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredItems.length - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (filteredItems[selectedIndex]) {
            filteredItems[selectedIndex].action();
            onClose();
          }
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    },
    [isOpen, filteredItems, selectedIndex, onClose]
  );

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedIndex(0);

    if (query.trim() && !recentSearches.includes(query)) {
      setRecentSearches((prev) => [query, ...prev.slice(0, 4)]);
    }
  };

  // Handle item selection
  const handleItemSelect = (item: CommandItem) => {
    item.action();
    onClose();
    setSearchQuery("");
  };

  // Reset selection when search changes
  React.useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  // Focus input when opened
  React.useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setSearchQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Add keyboard event listeners
  React.useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Scroll selected item into view
  React.useEffect(() => {
    if (listRef.current && selectedIndex >= 0) {
      const selectedElement = listRef.current.children[
        selectedIndex
      ] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="flex items-start justify-center pt-[20vh] p-4">
        <div
          className={cn(
            "w-full max-w-2xl bg-background rounded-lg shadow-2xl border",
            className
          )}
        >
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input
              ref={inputRef}
              placeholder={placeholder}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="border-0 shadow-none focus-visible:ring-0 text-lg"
            />
            <div className="flex items-center gap-1">
              <Badge variant="secondary" className="text-xs">
                <Command className="h-3 w-3 mr-1" />K
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div className="max-h-96 overflow-y-auto">
            {searchQuery ? (
              // Search results
              <div ref={listRef}>
                {Object.entries(groupedItems).map(
                  ([category, categoryItems]) => (
                    <div key={category}>
                      <div className="px-4 py-2 text-xs font-medium text-muted-foreground bg-muted/50">
                        {category}
                      </div>
                      {categoryItems.map((item, index) => {
                        const globalIndex = filteredItems.indexOf(item);
                        const isSelected = globalIndex === selectedIndex;

                        return (
                          <div
                            key={item.id}
                            className={cn(
                              "flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors",
                              isSelected && "bg-accent"
                            )}
                            onClick={() => handleItemSelect(item)}
                          >
                            {item.icon && (
                              <item.icon className="h-4 w-4 text-muted-foreground" />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="font-medium">{item.title}</div>
                              {item.description && (
                                <div className="text-sm text-muted-foreground truncate">
                                  {item.description}
                                </div>
                              )}
                            </div>
                            {item.shortcut && (
                              <div className="flex items-center gap-1">
                                {item.shortcut.map((key, i) => (
                                  <React.Fragment key={key}>
                                    <Badge
                                      variant="outline"
                                      className="text-xs px-1 py-0"
                                    >
                                      {key}
                                    </Badge>
                                    {i < item.shortcut!.length - 1 && (
                                      <span className="text-muted-foreground">
                                        +
                                      </span>
                                    )}
                                  </React.Fragment>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )
                )}
              </div>
            ) : (
              // Recent searches and quick actions
              <div className="p-4 space-y-4">
                {recentSearches.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">
                      Recent Searches
                    </h3>
                    <div className="space-y-1">
                      {recentSearches.map((search, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent cursor-pointer"
                          onClick={() => handleSearch(search)}
                        >
                          <Search className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{search}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {items.slice(0, 6).map((item) => (
                      <Button
                        key={item.id}
                        variant="outline"
                        size="sm"
                        className="justify-start h-auto p-3"
                        onClick={() => handleItemSelect(item)}
                      >
                        {item.icon && <item.icon className="h-4 w-4 mr-2" />}
                        <div className="text-left">
                          <div className="font-medium text-sm">
                            {item.title}
                          </div>
                          {item.description && (
                            <div className="text-xs text-muted-foreground">
                              {item.description}
                            </div>
                          )}
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-4 border-t text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <ArrowUp className="h-3 w-3" />
                <ArrowDown className="h-3 w-3" />
                <span>Navigate</span>
              </div>
              <div className="flex items-center gap-1">
                <ArrowRight className="h-3 w-3" />
                <span>Select</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Command className="h-3 w-3" />
              <span>K</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
