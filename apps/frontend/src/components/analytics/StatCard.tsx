"use client";

/**
 * StatCard
 *
 * Compact stat tile used on the analytics pages. Renders an icon
 * tile, a value, a label, and an optional trend delta.
 */

import { motion } from "motion/react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { ReactNode } from "react";

export type StatTrend = "up" | "down" | "neutral";

export interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  trend?: StatTrend;
  icon: ReactNode;
  color?: string;
  delay?: number;
}

export function StatCard({
  label,
  value,
  change,
  trend = "neutral",
  icon,
  color = "from-indigo-500 to-purple-600",
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card className="p-5 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-3">
          <div
            className={`p-2.5 rounded-xl bg-gradient-to-br ${color} text-white`}
          >
            {icon}
          </div>
          {change && (
            <div
              className={`flex items-center gap-1 text-sm font-medium ${
                trend === "up"
                  ? "text-emerald-500"
                  : trend === "down"
                    ? "text-red-500"
                    : "text-slate-500"
              }`}
            >
              {trend === "up" && <ArrowUp className="h-3 w-3" />}
              {trend === "down" && <ArrowDown className="h-3 w-3" />}
              {change}
            </div>
          )}
        </div>
        <p className="text-2xl font-bold text-slate-900 dark:text-white">
          {value}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
      </Card>
    </motion.div>
  );
}

export default StatCard;
