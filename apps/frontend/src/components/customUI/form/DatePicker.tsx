import { cn } from "@/lib/utils";
import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";
import * as React from "react";
import { Button } from "../../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";

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

  const handleClear = () => {
    if (onChange) {
      onChange(undefined);
    }
  };

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-9" />);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isSelected = isDateSelected(date);
      const isInRange = isDateInSelectionRange(date);
      const isValid = isDateInRange(date);

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(date)}
          disabled={!isValid}
          className={cn(
            "h-9 w-9 rounded-md text-sm transition-colors",
            "hover:bg-accent hover:text-accent-foreground",
            isSelected && "bg-primary text-primary-foreground",
            isInRange && !isSelected && "bg-primary/20 text-primary-foreground",
            !isValid && "opacity-50 cursor-not-allowed",
            !isValid && "hover:bg-transparent hover:text-muted-foreground"
          )}
        >
          {day}
        </button>
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
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-sm font-medium text-foreground">{label}</label>
      )}

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
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
          >
            <span
              className={cn(
                "flex-1 text-left",
                !value && "text-muted-foreground"
              )}
            >
              {displayValue}
            </span>

            <div className="flex items-center gap-1">
              {value && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClear();
                  }}
                  disabled={disabled}
                  className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
              <Calendar className="h-4 w-4 opacity-50" />
            </div>
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setCurrentMonth(
                    new Date(
                      currentMonth.getFullYear(),
                      currentMonth.getMonth() - 1,
                      1
                    )
                  )
                }
                className="h-7 w-7 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="text-sm font-medium">
                {currentMonth.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setCurrentMonth(
                    new Date(
                      currentMonth.getFullYear(),
                      currentMonth.getMonth() + 1,
                      1
                    )
                  )
                }
                className="h-7 w-7 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="h-9 flex items-center justify-center text-xs font-medium text-muted-foreground"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>
          </div>
        </PopoverContent>
      </Popover>

      {helperText && !error && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};
