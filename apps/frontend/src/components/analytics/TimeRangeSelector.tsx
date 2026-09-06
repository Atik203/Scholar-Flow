"use client";

/**
 * TimeRangeSelector
 *
 * Reusable select for analytics time ranges. Wraps a native <select> with
 * a chevron icon and a consistent style that matches the design system.
 */

import { ChevronDown } from "lucide-react";

export type TimeRange = "week" | "month" | "quarter" | "year";

export interface TimeRangeSelectorProps {
  value: TimeRange;
  onChange: (value: TimeRange) => void;
  className?: string;
}

const LABELS: Record<TimeRange, string> = {
  week: "Last 7 days",
  month: "Last 30 days",
  quarter: "Last 3 months",
  year: "This year",
};

export function TimeRangeSelector({
  value,
  onChange,
  className = "",
}: TimeRangeSelectorProps) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as TimeRange)}
        className="appearance-none pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      >
        {(Object.keys(LABELS) as TimeRange[]).map((r) => (
          <option key={r} value={r}>
            {LABELS[r]}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
    </div>
  );
}

export default TimeRangeSelector;
