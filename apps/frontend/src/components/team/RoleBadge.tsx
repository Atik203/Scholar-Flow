"use client";

import { Crown, Shield, User as UserIcon, Eye } from "lucide-react";

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

// Backend roles are the global USER_ROLES: RESEARCHER / PRO_RESEARCHER /
// TEAM_LEAD / ADMIN (plus workspace roles VIEWER/EDITOR/MANAGER/OWNER when
// shown in workspace contexts).
type TeamRole = "ADMIN" | "TEAM_LEAD" | "PRO_RESEARCHER" | "RESEARCHER" | "VIEWER" | "EDITOR" | "MANAGER" | "OWNER";

const ROLE_LABELS: Record<TeamRole, string> = {
  ADMIN: "Admin",
  TEAM_LEAD: "Team Lead",
  PRO_RESEARCHER: "Pro Researcher",
  RESEARCHER: "Researcher",
  VIEWER: "Viewer",
  EDITOR: "Editor",
  MANAGER: "Manager",
  OWNER: "Owner",
};

const ROLE_COLORS: Record<TeamRole, string> = {
  ADMIN: "bg-red-500/10 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
  TEAM_LEAD:
    "bg-purple-500/10 text-purple-600 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
  PRO_RESEARCHER:
    "bg-indigo-500/10 text-indigo-600 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800",
  RESEARCHER:
    "bg-blue-500/10 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
  MANAGER:
    "bg-amber-500/10 text-amber-600 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
  EDITOR:
    "bg-sky-500/10 text-sky-600 border-sky-200 dark:bg-sky-900/30 dark:text-sky-400 dark:border-sky-800",
  VIEWER:
    "bg-gray-500/10 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
  OWNER:
    "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
};

const ROLE_ICONS: Record<TeamRole, React.ComponentType<{ className?: string }>> = {
  ADMIN: Shield,
  TEAM_LEAD: Crown,
  PRO_RESEARCHER: UserIcon,
  RESEARCHER: UserIcon,
  MANAGER: UserIcon,
  EDITOR: UserIcon,
  VIEWER: Eye,
  OWNER: Crown,
};

// Normalize lowercase/legacy spellings (member/viewer/editor/admin) to backend enums
const ROLE_ALIASES: Record<string, string> = {
  member: "RESEARCHER",
  user: "RESEARCHER",
  viewer: "VIEWER",
  editor: "EDITOR",
  manager: "MANAGER",
  owner: "OWNER",
  admin: "ADMIN",
  team_lead: "TEAM_LEAD",
  teamlead: "TEAM_LEAD",
  pro_researcher: "PRO_RESEARCHER",
  proresearcher: "PRO_RESEARCHER",
};

function normalizeRole(role: string): string {
  const upper = role.toUpperCase();
  return ROLE_ALIASES[upper] || upper;
}

export function getRoleLabel(role: string): string {
  return ROLE_LABELS[normalizeRole(role) as TeamRole] || role;
}

export function getRoleColor(role: string): string {
  return ROLE_COLORS[normalizeRole(role) as TeamRole] || ROLE_COLORS.RESEARCHER;
}

export function getRoleIcon(role: string) {
  return ROLE_ICONS[normalizeRole(role) as TeamRole] || UserIcon;
}

export function RoleBadge({ role, className }: { role: string; className?: string }) {
  // Icon is a stable component from a module-level map; the compiler
  // static-components rule cannot see through the lookup, so disable here.
  const Icon = getRoleIcon(role);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border",
        getRoleColor(role),
        className
      )}
    >
      {/* eslint-disable-next-line react-hooks/static-components */}
      <Icon className="h-3 w-3" />
      {getRoleLabel(role)}
    </span>
  );
}
