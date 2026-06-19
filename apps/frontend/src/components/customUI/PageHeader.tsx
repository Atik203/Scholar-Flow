"use client";

/**
 * PageHeader
 *
 * Standardized header used across the Phase 7 pages. Matches the
 * figma `motion.div initial={{ opacity: 0, y: -20 }}` pattern with a
 * gradient icon, title, description, and optional actions slot.
 */

import { motion } from "motion/react";
import type { ReactNode } from "react";

export interface PageHeaderProps {
  icon: ReactNode;
  iconGradient?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function PageHeader({
  icon,
  iconGradient = "from-indigo-500 to-purple-600",
  title,
  description,
  actions,
}: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
    >
      <div className="flex items-center gap-4">
        <div
          className={`p-3 rounded-2xl bg-gradient-to-br ${iconGradient} shadow-lg`}
        >
          {icon}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            {title}
          </h1>
          {description && (
            <p className="text-slate-600 dark:text-slate-400">{description}</p>
          )}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </motion.div>
  );
}

export default PageHeader;
