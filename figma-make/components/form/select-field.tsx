"use client";

import { Check, ChevronDown, Search } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React from "react";

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

// ============================================================================
// Select Field
// ============================================================================
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectFieldProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  searchable?: boolean;
  disabled?: boolean;
  error?: boolean;
  required?: boolean;
  label?: string;
  helperText?: string;
  className?: string;
}

export const SelectField = React.forwardRef<HTMLDivElement, SelectFieldProps>(
  (
    {
      className,
      options,
      value,
      onChange,
      placeholder = "Select an option...",
      searchable = false,
      disabled = false,
      error = false,
      required = false,
      label,
      helperText,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState("");
    const [focusedIndex, setFocusedIndex] = React.useState(-1);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const searchInputRef = React.useRef<HTMLInputElement>(null);

    const selectedOption = options.find((option) => option.value === value);
    const filteredOptions = searchable
      ? options.filter(
          (option) =>
            option.label.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !option.disabled
        )
      : options.filter((option) => !option.disabled);

    // Close on click outside
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
          setSearchTerm("");
          setFocusedIndex(-1);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Focus search input when opened
    React.useEffect(() => {
      if (isOpen && searchable && searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, [isOpen, searchable]);

    const handleSelect = (option: SelectOption) => {
      if (option.disabled) return;
      onChange?.(option.value);
      setIsOpen(false);
      setSearchTerm("");
      setFocusedIndex(-1);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (!isOpen) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setIsOpen(true);
        }
        return;
      }

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
            handleSelect(filteredOptions[focusedIndex]);
          }
          break;
        case "Escape":
          setIsOpen(false);
          setSearchTerm("");
          setFocusedIndex(-1);
          break;
      }
    };

    return (
      <div className={cn("relative", className)} ref={ref}>
        {label && (
          <label className="block text-sm font-medium mb-2">
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}

        <div ref={containerRef} className="relative">
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            className={cn(
              "relative w-full h-10 px-3 py-2 text-left",
              "bg-background border rounded-lg shadow-sm",
              "cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error
                ? "border-destructive focus:ring-destructive"
                : "border-border",
              isOpen && "ring-2 ring-ring ring-offset-2"
            )}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
          >
            <span
              className={cn(
                "block truncate text-sm",
                !selectedOption && "text-muted-foreground"
              )}
            >
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </motion.div>
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className={cn(
                  "absolute z-50 w-full mt-1",
                  "bg-popover border border-border rounded-lg shadow-lg",
                  "overflow-hidden"
                )}
              >
                {searchable && (
                  <div className="p-2 border-b border-border">
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search options..."
                        className={cn(
                          "w-full pl-8 pr-3 py-2 text-sm",
                          "bg-transparent border-none outline-none",
                          "placeholder:text-muted-foreground"
                        )}
                      />
                    </div>
                  </div>
                )}

                <div className="py-1 max-h-60 overflow-auto">
                  {filteredOptions.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-muted-foreground">
                      No options found
                    </div>
                  ) : (
                    filteredOptions.map((option, index) => (
                      <motion.button
                        key={option.value}
                        type="button"
                        whileHover={{ backgroundColor: "var(--accent)" }}
                        onClick={() => handleSelect(option)}
                        onMouseEnter={() => setFocusedIndex(index)}
                        className={cn(
                          "relative w-full px-3 py-2 text-left text-sm",
                          "cursor-pointer focus:outline-none",
                          option.disabled &&
                            "opacity-50 cursor-not-allowed hover:bg-transparent",
                          focusedIndex === index && "bg-accent",
                          option.value === value &&
                            "bg-primary text-primary-foreground hover:bg-primary"
                        )}
                        disabled={option.disabled}
                      >
                        <span className="block truncate">{option.label}</span>
                        <AnimatePresence>
                          {option.value === value && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0 }}
                              className="absolute right-3 top-1/2 -translate-y-1/2"
                            >
                              <Check className="h-4 w-4" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {helperText && (
          <p
            className={cn(
              "mt-1 text-xs text-muted-foreground",
              error && "text-destructive"
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

SelectField.displayName = "SelectField";

export default SelectField;
