"use client";

import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { StatsCardData } from "@/types";

interface StatsCardProps {
  data: StatsCardData;
}

const colorMap = {
  blue: {
    icon: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
    ring: "ring-blue-100 dark:ring-blue-900",
  },
  amber: {
    icon: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
    ring: "ring-amber-100 dark:ring-amber-900",
  },
  green: {
    icon: "bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400",
    ring: "ring-green-100 dark:ring-green-900",
  },
  red: {
    icon: "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400",
    ring: "ring-red-100 dark:ring-red-900",
  },
};

export function StatsCard({ data }: StatsCardProps) {
  const { label, value, change, changeLabel, icon: Icon, color } = data;
  const isPositive = change >= 0;
  const colors = colorMap[color];

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-6 shadow-sm transition-shadow hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-neutral-500 dark:text-neutral-400 truncate">{label}</p>
          <p className="mt-1.5 sm:mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
            {value}
          </p>
          <div className="mt-2 sm:mt-3 flex items-center gap-1 flex-wrap">
            <span
              className={cn(
                "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium",
                isPositive
                  ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400"
                  : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400"
              )}
            >
              {isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {Math.abs(change)}%
            </span>
            <span className="text-xs text-neutral-400 dark:text-neutral-500 hidden sm:inline">{changeLabel}</span>
          </div>
        </div>
        <div
          className={cn(
            "flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl ring-1",
            colors.icon,
            colors.ring
          )}
        >
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
      </div>
    </div>
  );
}
