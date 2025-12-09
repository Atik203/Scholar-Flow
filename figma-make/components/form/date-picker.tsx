"use client";

import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React from "react";

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

// ============================================================================
// Date Picker
// ============================================================================
export interface DatePickerProps {
  value?: Date | Date[];
  onChange?: (date: Date | Date[] | undefined) => void;
  placeholder?: string;
  label?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  range?: boolean;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
  format?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = "Pick a date",
  label,
  helperText,
  error,
  disabled = false,
  range = false,
  minDate,
  maxDate,
  className,
  format = "MMM dd, yyyy",
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [currentMonth, setCurrentMonth] = React.useState(() => {
    if (value) {
      const date = Array.isArray(value) ? value[0] : value;
      return new Date(date.getFullYear(), date.getMonth(), 1);
    }
    return new Date();
  });
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Close on click outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDate = React.useCallback(
    (date: Date): string => {
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return format
        .replace("MMM", months[date.getMonth()])
        .replace("dd", date.getDate().toString().padStart(2, "0"))
        .replace("yyyy", date.getFullYear().toString());
    },
    [format]
  );

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const isDateInRange = (date: Date) => {
    if (minDate && date < minDate) return false;
    if (maxDate && date > maxDate) return false;
    return true;
  };

  const isDateSelected = (date: Date) => {
    if (!value) return false;
    if (Array.isArray(value)) {
      return value.some(
        (d) =>
          d.getDate() === date.getDate() &&
          d.getMonth() === date.getMonth() &&
          d.getFullYear() === date.getFullYear()
      );
    }
    return (
      date.getDate() === value.getDate() &&
      date.getMonth() === value.getMonth() &&
      date.getFullYear() === value.getFullYear()
    );
  };

  const isDateInSelectionRange = (date: Date) => {
    if (!range || !Array.isArray(value) || value.length !== 2) return false;
    const [start, end] = value;
    return date >= start && date <= end;
  };

  const handleDateClick = (date: Date) => {
    if (!onChange || !isDateInRange(date)) return;

    if (range) {
      if (!Array.isArray(value) || value.length === 0) {
        onChange([date]);
      } else if (value.length === 1) {
        const [start] = value;
        if (date < start) {
          onChange([date, start]);
        } else {
          onChange([start, date]);
        }
        setIsOpen(false);
      } else {
        onChange([date]);
      }
    } else {
      onChange(date);
      setIsOpen(false);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onChange) {
      onChange(undefined);
    }
  };

  const goToPrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-9" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isSelected = isDateSelected(date);
      const isInRange = isDateInSelectionRange(date);
      const isValid = isDateInRange(date);

      days.push(
        <motion.button
          key={day}
          type="button"
          whileHover={isValid ? { scale: 1.1 } : undefined}
          whileTap={isValid ? { scale: 0.95 } : undefined}
          onClick={() => handleDateClick(date)}
          disabled={!isValid}
          className={cn(
            "h-9 w-9 rounded-md text-sm transition-colors",
            "hover:bg-accent hover:text-accent-foreground",
            isSelected && "bg-primary text-primary-foreground",
            isInRange && !isSelected && "bg-primary/20",
            !isValid && "opacity-50 cursor-not-allowed",
            !isValid && "hover:bg-transparent hover:text-muted-foreground"
          )}
        >
          {day}
        </motion.button>
      );
    }

    return days;
  };

  const displayValue = React.useMemo(() => {
    if (!value) return placeholder;

    if (Array.isArray(value)) {
      if (value.length === 0) return placeholder;
      if (value.length === 1) return formatDate(value[0]);
      if (value.length === 2) {
        return `${formatDate(value[0])} - ${formatDate(value[1])}`;
      }
      return `${value.length} dates selected`;
    }

    return formatDate(value);
  }, [value, placeholder, formatDate]);

  return (
    <div className={cn("space-y-2", className)} ref={containerRef}>
      {label && (
        <label className="text-sm font-medium text-foreground">{label}</label>
      )}

      <div className="relative">
        <button
          type="button"
          role="combobox"
          aria-expanded={isOpen}
          disabled={disabled}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={cn(
            "w-full h-10 px-3 rounded-lg border bg-background",
            "flex items-center justify-between gap-2",
            "text-sm text-left",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error && "border-destructive focus:ring-destructive",
            isOpen && "ring-2 ring-ring ring-offset-2"
          )}
        >
          <span
            className={cn("flex-1 truncate", !value && "text-muted-foreground")}
          >
            {displayValue}
          </span>

          <div className="flex items-center gap-1">
            <AnimatePresence>
              {value && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  type="button"
                  onClick={handleClear}
                  disabled={disabled}
                  className={cn(
                    "p-1 rounded-full",
                    "hover:bg-destructive hover:text-destructive-foreground",
                    "transition-colors"
                  )}
                >
                  <X className="h-3 w-3" />
                </motion.button>
              )}
            </AnimatePresence>
            <Calendar className="h-4 w-4 opacity-50" />
          </div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className={cn(
                "absolute z-50 mt-1",
                "bg-popover border border-border rounded-lg shadow-lg",
                "p-3"
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={goToPrevMonth}
                  className="h-7 w-7 p-0 flex items-center justify-center rounded-md hover:bg-accent"
                >
                  <ChevronLeft className="h-4 w-4" />
                </motion.button>

                <div className="text-sm font-medium">
                  {currentMonth.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </div>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={goToNextMonth}
                  className="h-7 w-7 p-0 flex items-center justify-center rounded-md hover:bg-accent"
                >
                  <ChevronRight className="h-4 w-4" />
                </motion.button>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                  <div
                    key={day}
                    className="h-9 flex items-center justify-center text-xs font-medium text-muted-foreground"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>

              {/* Quick actions */}
              <div className="mt-3 pt-3 border-t border-border flex gap-2">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    const today = new Date();
                    handleDateClick(today);
                    setCurrentMonth(
                      new Date(today.getFullYear(), today.getMonth(), 1)
                    );
                  }}
                  className="flex-1 px-3 py-1.5 text-xs rounded-md bg-accent hover:bg-accent/80 transition-colors"
                >
                  Today
                </motion.button>
                {value && (
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleClear}
                    className="flex-1 px-3 py-1.5 text-xs rounded-md border border-border hover:bg-muted transition-colors"
                  >
                    Clear
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {helperText && !error && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};

export default DatePicker;
