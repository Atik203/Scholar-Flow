import Link from "next/link";
import React from "react";
import { ThemeToggle } from "./ThemeToggle";

export const TopBar: React.FC = () => {
  return (
    <header className="h-14 border-b flex items-center justify-between px-4 gap-4 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center rounded border px-2 py-1 text-sm"
          aria-label="Open navigation"
        >
          ☰
        </button>
        <span className="font-medium text-sm text-muted-foreground hidden sm:inline">
          Phase 1 MVP
        </span>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <Link
          href="/profile"
          className="text-sm underline-offset-2 hover:underline"
        >
          Profile
        </Link>
      </div>
    </header>
  );
};
