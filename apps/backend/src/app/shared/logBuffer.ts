/**
 * In-memory log ring buffer
 *
 * Captures console output so admins can inspect and export recent backend
 * logs without a file-logging dependency. Contents reset on restart and are
 * capped at MAX_ENTRIES to keep memory bounded.
 */

export type LogLevel = "info" | "warn" | "error";

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
}

const MAX_ENTRIES = 1000;

const entries: LogEntry[] = [];
let installed = false;

const normalizeArgs = (args: unknown[]): string =>
  args
    .map((arg) => {
      if (typeof arg === "string") return arg;
      if (arg instanceof Error) return arg.stack || arg.message;
      try {
        return JSON.stringify(arg);
      } catch {
        return String(arg);
      }
    })
    .join(" ");

const push = (level: LogLevel, args: unknown[]): void => {
  entries.push({
    timestamp: new Date().toISOString(),
    level,
    message: normalizeArgs(args),
  });

  if (entries.length > MAX_ENTRIES) {
    entries.splice(0, entries.length - MAX_ENTRIES);
  }
};

/**
 * Patch console methods once so every log line is kept in the ring buffer.
 * Original console behavior is preserved.
 */
export const installLogCapture = (): void => {
  if (installed) return;
  installed = true;

  const original = {
    log: console.log.bind(console),
    warn: console.warn.bind(console),
    error: console.error.bind(console),
  };

  console.log = ((...args: unknown[]) => {
    push("info", args);
    original.log(...args);
  }) as typeof console.log;

  console.warn = ((...args: unknown[]) => {
    push("warn", args);
    original.warn(...args);
  }) as typeof console.warn;

  console.error = ((...args: unknown[]) => {
    push("error", args);
    original.error(...args);
  }) as typeof console.error;
};

export const getLogEntries = (options?: {
  level?: string;
  limit?: number;
}): LogEntry[] => {
  const level = options?.level;
  const filtered =
    level && level !== "all"
      ? entries.filter((entry) => entry.level === level)
      : entries;

  const limit = options?.limit ?? 200;
  return filtered.slice(-limit);
};

export const countLogEntries = (level?: string): number => {
  if (level && level !== "all") {
    return entries.filter((entry) => entry.level === level).length;
  }
  return entries.length;
};

export const getLogsAsText = (level?: string): string => {
  return getLogEntries({ level, limit: MAX_ENTRIES })
    .map(
      (entry) =>
        `[${entry.timestamp}] [${entry.level.toUpperCase()}] ${entry.message}`
    )
    .join("\n");
};
