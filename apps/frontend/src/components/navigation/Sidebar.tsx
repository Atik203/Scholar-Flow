import Link from "next/link";
import React from "react";

// Phase 1 minimal nav; expand per docs/UI_DESIGN.md
const navItems: { href: string; label: string }[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/papers", label: "Papers" },
  { href: "/dashboard/collections", label: "Collections" },
  { href: "/dashboard/workspaces", label: "Workspaces" },
  { href: "/dashboard/research", label: "Research" },
  { href: "/dashboard/collaborations", label: "Collaborations" },
  { href: "/dashboard/ai-insights", label: "AI Insights" },
];

const Sidebar: React.FC = () => {
  return (
    <aside className="hidden md:flex md:flex-col w-56 shrink-0 border-r bg-muted/30">
      <div className="h-14 flex items-center px-4 font-semibold tracking-tight">
        Scholar-Flow
      </div>
      <nav className="flex-1 px-2 py-2 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded px-3 py-2 text-sm hover:bg-muted transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
