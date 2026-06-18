"use client";

import { Crown, Shield, User as UserIcon, Eye } from "lucide-react";

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export type TeamRole = "admin" | "team_lead" | "member" | "viewer";

const ROLE_LABELS: Record<TeamRole, string> = {
  admin: "Admin",
  team_lead: "Team Lead",
  member: "Member",
  viewer: "Viewer",
};

const ROLE_COLORS: Record<TeamRole, string> = {
  admin: "bg-red-500/10 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
  team_lead:
    "bg-purple-500/10 text-purple-600 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
  member:
    "bg-blue-500/10 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
  viewer:
    "bg-gray-500/10 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
};

const ROLE_ICONS: Record<TeamRole, React.ComponentType<{ className?: string }>> = {
  admin: Shield,
  team_lead: Crown,
  member: UserIcon,
  viewer: Eye,
};

export function getRoleLabel(role: string): string {
  return ROLE_LABELS[role as TeamRole] || role;
}

export function getRoleColor(role: string): string {
  return ROLE_COLORS[role as TeamRole] || ROLE_COLORS.member;
}

export function getRoleIcon(role: string) {
  return ROLE_ICONS[role as TeamRole] || UserIcon;
}

export function RoleBadge({ role, className }: { role: string; className?: string }) {
  const Icon = getRoleIcon(role);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border",
        getRoleColor(role),
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {getRoleLabel(role)}
    </span>
  );
}
