"use client";

import { Plus, Download, BarChart3, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const actions = [
  {
    icon: Plus,
    label: "Add Complaint",
    description: "Log a new complaint",
    variant: "primary" as const,
    color: "blue",
  },
  {
    icon: Download,
    label: "Export Report",
    description: "Download as CSV or PDF",
    variant: "outline" as const,
    color: "neutral",
  },
  {
    icon: BarChart3,
    label: "View Analytics",
    description: "Deep-dive into metrics",
    variant: "outline" as const,
    color: "neutral",
  },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {actions.map(({ icon: Icon, label, description }) => (
        <button
          key={label}
          className="group flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-4 text-left shadow-sm transition-all duration-150 hover:border-blue-200 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-blue-800"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600 transition-colors group-hover:bg-blue-50 group-hover:text-blue-600 dark:bg-neutral-800 dark:text-neutral-400 dark:group-hover:bg-blue-950 dark:group-hover:text-blue-400">
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">{label}</p>
            <p className="text-xs text-neutral-400 mt-0.5">{description}</p>
          </div>
          <ArrowRight className="h-4 w-4 text-neutral-300 transition-transform group-hover:translate-x-0.5 group-hover:text-blue-400 dark:text-neutral-600" />
        </button>
      ))}
    </div>
  );
}
