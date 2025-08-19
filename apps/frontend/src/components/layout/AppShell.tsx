import { Sidebar, TopBar } from "@/components/navigation";
import React from "react";

/**
 * High-level application shell layout (Phase 1 minimal).
 * Refer to docs/UI_DESIGN.md for phased expansion before editing.
 */
export const AppShell: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div className="min-h-screen flex w-full bg-background text-foreground">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};
