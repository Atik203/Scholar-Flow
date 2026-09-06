"use client";

import { Building2, Crown, Edit, Eye, Trash2 } from "lucide-react";
import { motion } from "motion/react";

function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export const WORKSPACE_COLORS = {
  blue: {
    gradient: "from-blue-500 to-indigo-600",
    ring: "ring-blue-500/30",
    label: "Blue",
  },
  purple: {
    gradient: "from-purple-500 to-pink-600",
    ring: "ring-purple-500/30",
    label: "Purple",
  },
  green: {
    gradient: "from-green-500 to-emerald-600",
    ring: "ring-green-500/30",
    label: "Green",
  },
  orange: {
    gradient: "from-orange-500 to-red-600",
    ring: "ring-orange-500/30",
    label: "Orange",
  },
  pink: {
    gradient: "from-pink-500 to-rose-600",
    ring: "ring-pink-500/30",
    label: "Pink",
  },
} as const;

export type WorkspaceColor = keyof typeof WORKSPACE_COLORS;

export const WORKSPACE_COLOR_KEYS = Object.keys(WORKSPACE_COLORS) as WorkspaceColor[];

export function getWorkspaceColor(color: string | undefined) {
  if (color && color in WORKSPACE_COLORS) {
    return WORKSPACE_COLORS[color as WorkspaceColor];
  }
  return WORKSPACE_COLORS.blue;
}

interface ColorPickerProps {
  value: string;
  onChange: (color: WorkspaceColor) => void;
  className?: string;
}

export function ColorPicker({ value, onChange, className }: ColorPickerProps) {
  return (
    <div className={cn("flex gap-2", className)}>
      {WORKSPACE_COLOR_KEYS.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onChange(color)}
          aria-label={WORKSPACE_COLORS[color].label}
          className={cn(
            "w-8 h-8 rounded-full transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
            color === "blue" && "bg-blue-500",
            color === "purple" && "bg-purple-500",
            color === "green" && "bg-green-500",
            color === "orange" && "bg-orange-500",
            color === "pink" && "bg-pink-500",
            value === color && "ring-2 ring-offset-2 ring-gray-400 dark:ring-gray-500 scale-110"
          )}
        />
      ))}
    </div>
  );
}

interface WorkspaceCardProps {
  workspace: {
    id: string;
    name: string;
    description?: string | null;
    color?: string;
    isOwner?: boolean;
    isPublic?: boolean;
    memberCount?: number;
    collectionCount?: number;
    paperCount?: number;
    createdAt: string;
  };
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function WorkspaceCard({ workspace, onView, onEdit, onDelete }: WorkspaceCardProps) {
  const colorMeta = getWorkspaceColor(workspace.color);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="bg-card border rounded-2xl overflow-hidden hover:shadow-xl transition-shadow group"
    >
      {/* Color Header */}
      <div className={cn("h-2 bg-gradient-to-r", colorMeta.gradient)} />

      <div className="p-5">
        {/* Header Row */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg",
                colorMeta.gradient
              )}
            >
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-base group-hover:text-primary transition-colors line-clamp-1">
                  {workspace.name}
                </h3>
                {workspace.isOwner && (
                  <span className="px-1.5 py-0.5 text-xs rounded bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 flex items-center gap-1 shrink-0">
                    <Crown className="h-3 w-3" />
                    Owner
                  </span>
                )}
              </div>
              {workspace.description && (
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {workspace.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center p-2 bg-muted/30 rounded-lg">
            <div className="text-lg font-bold">{workspace.memberCount ?? 1}</div>
            <div className="text-xs text-muted-foreground">Members</div>
          </div>
          <div className="text-center p-2 bg-muted/30 rounded-lg">
            <div className="text-lg font-bold">{workspace.collectionCount ?? 0}</div>
            <div className="text-xs text-muted-foreground">Collections</div>
          </div>
          <div className="text-center p-2 bg-muted/30 rounded-lg">
            <div className="text-lg font-bold">{workspace.paperCount ?? 0}</div>
            <div className="text-xs text-muted-foreground">Papers</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onView}
            className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium flex items-center justify-center gap-1"
          >
            <Eye className="h-4 w-4" />
            View
          </motion.button>
          {workspace.isOwner && (
            <>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onEdit}
                className="px-3 py-2 border rounded-lg flex items-center gap-1 hover:bg-accent transition-colors"
                aria-label="Edit workspace"
              >
                <Edit className="h-4 w-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onDelete}
                className="px-3 py-2 bg-red-600 text-white rounded-lg flex items-center gap-1 hover:bg-red-700 transition-colors"
                aria-label="Delete workspace"
              >
                <Trash2 className="h-4 w-4" />
              </motion.button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
