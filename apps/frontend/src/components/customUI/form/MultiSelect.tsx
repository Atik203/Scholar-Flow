import { cn } from "@/lib/utils";
import { Check, ChevronDown, X } from "lucide-react";
import * as React from "react";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";

export interface MultiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  label?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  searchable?: boolean;
  maxItems?: number;
  className?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select options...",
  label,
  helperText,
  error,
  disabled = false,
  searchable = true,
  maxItems,
  className,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [focusedIndex, setFocusedIndex] = React.useState(-1);

  const filteredOptions = React.useMemo(() => {
    if (!searchable || !searchQuery) return options;

    return options.filter((option) =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [options, searchQuery, searchable]);

  const selectedOptions = React.useMemo(() => {
    return options.filter((option) => value.includes(option.value));
  }, [options, value]);

  const handleSelect = (optionValue: string) => {
    if (disabled) return;

    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];

    onChange(newValue);
  };

  const handleRemove = (optionValue: string) => {
    if (disabled) return;
    onChange(value.filter((v) => v !== optionValue));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
          handleSelect(filteredOptions[focusedIndex].value);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setFocusedIndex(-1);
        break;
    }
  };

  const isAtMaxItems = maxItems && value.length >= maxItems;

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-sm font-medium text-foreground">{label}</label>
      )}

      <div className="relative">
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={isOpen}
              disabled={disabled}
              className={cn(
                "w-full justify-between",
                error && "border-destructive",
                disabled && "opacity-50 cursor-not-allowed"
              )}
              onKeyDown={handleKeyDown}
            >
              <div className="flex flex-wrap gap-1 flex-1 min-w-0">
                {selectedOptions.length > 0 ? (
                  selectedOptions.map((option) => (
                    <Badge
                      key={option.value}
                      variant="secondary"
                      className="text-xs"
                    >
                      {option.label}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(option.value);
                        }}
                        className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
                        disabled={disabled}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))
                ) : (
                  <span className="text-muted-foreground">{placeholder}</span>
                )}
              </div>
              <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-full min-w-[200px] p-0"
            align="start"
          >
            {searchable && (
              <div className="p-2 border-b">
                <input
                  type="text"
                  placeholder="Search options..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-2 py-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  onKeyDown={(e) => e.stopPropagation()}
                />
              </div>
            )}

            <div className="max-h-60 overflow-auto">
              {filteredOptions.length === 0 ? (
                <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                  No options found
                </div>
              ) : (
                filteredOptions.map((option, index) => {
                  const isSelected = value.includes(option.value);
                  const isFocused = index === focusedIndex;
                  const isDisabled =
                    !!option.disabled || !!(isAtMaxItems && !isSelected);

                  return (
                    <DropdownMenuItem
                      key={option.value}
                      className={cn(
                        "flex items-center gap-2 cursor-pointer",
                        isSelected && "bg-accent",
                        isFocused && "bg-accent/50",
                        isDisabled && "opacity-50 cursor-not-allowed"
                      )}
                      onSelect={() => !isDisabled && handleSelect(option.value)}
                      disabled={isDisabled}
                    >
                      <div className="flex items-center gap-2 flex-1">
                        {isSelected && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                        <span className={cn(isSelected && "font-medium")}>
                          {option.label}
                        </span>
                      </div>
                    </DropdownMenuItem>
                  );
                })
              )}
            </div>

            {maxItems && (
              <div className="px-2 py-2 text-xs text-muted-foreground border-t">
                {value.length}/{maxItems} items selected
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {helperText && !error && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};
