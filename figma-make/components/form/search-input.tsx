"use client";

import { Loader2, Search, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React from "react";

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

// ============================================================================
// Search Input
// ============================================================================
export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  onSearch?: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  className?: string;
  showClearButton?: boolean;
  loading?: boolean;
  debounceMs?: number;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      className,
      onSearch,
      onClear,
      placeholder = "Search...",
      showClearButton = true,
      loading = false,
      debounceMs = 300,
      ...props
    },
    ref
  ) => {
    const [value, setValue] = React.useState("");
    const [isFocused, setIsFocused] = React.useState(false);
    const debounceRef = React.useRef<NodeJS.Timeout>();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setValue(newValue);

      // Debounce search
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        onSearch?.(newValue);
      }, debounceMs);
    };

    const handleClear = () => {
      setValue("");
      onClear?.();
      onSearch?.("");
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }
        onSearch?.(value);
      }
      if (e.key === "Escape" && value) {
        handleClear();
      }
    };

    React.useEffect(() => {
      return () => {
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }
      };
    }, []);

    return (
      <div className={cn("relative", className)}>
        <div className="relative">
          <motion.div
            initial={false}
            animate={{
              color: isFocused ? "var(--primary)" : "var(--muted-foreground)",
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2"
          >
            <Search className="h-4 w-4" />
          </motion.div>
          <input
            ref={ref}
            type="text"
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className={cn(
              "w-full pl-10 pr-10 h-10 rounded-lg border bg-background",
              "text-sm ring-offset-background",
              "placeholder:text-muted-foreground",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "transition-all duration-200"
            )}
            {...props}
          />

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              </motion.div>
            ) : showClearButton && value ? (
              <motion.button
                key="clear"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={handleClear}
                className={cn(
                  "absolute right-3 top-1/2 -translate-y-1/2",
                  "p-1 rounded-full hover:bg-muted transition-colors"
                )}
                aria-label="Clear search"
              >
                <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </motion.button>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";

export default SearchInput;
