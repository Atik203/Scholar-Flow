"use client";
import { useTheme } from "next-themes";
import * as React from "react";

export const ThemeToggle: React.FC = () => {
  const { setTheme, theme } = useTheme();
  const next = theme === "light" ? "dark" : "light";
  return (
    <button
      type="button"
      className="text-sm px-2 py-1 rounded border hover:bg-muted transition"
      onClick={() => setTheme(next)}
      aria-label="Toggle theme"
    >
      {next === "dark" ? "🌙" : "☀️"}
    </button>
  );
};
