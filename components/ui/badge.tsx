"use client";

import { cn } from "@/lib/utils";
import type { Priority, Status } from "@/types";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "outline" | "success" | "warning" | "danger" | "info" | "neutral";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        {
          "bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:ring-blue-800": variant === "default" || variant === "info",
          "bg-neutral-100 text-neutral-700 ring-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:ring-neutral-700": variant === "outline" || variant === "neutral",
          "bg-green-50 text-green-700 ring-green-200 dark:bg-green-950 dark:text-green-300 dark:ring-green-800": variant === "success",
          "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:ring-amber-800": variant === "warning",
          "bg-red-50 text-red-700 ring-red-200 dark:bg-red-950 dark:text-red-300 dark:ring-red-800": variant === "danger",
        },
        className
      )}
    >
      {children}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const map: Record<Priority, { label: string; variant: BadgeProps["variant"] }> = {
    low: { label: "Low", variant: "neutral" },
    medium: { label: "Medium", variant: "warning" },
    high: { label: "High", variant: "danger" },
    critical: { label: "Critical", variant: "danger" },
  };
  const { label, variant } = map[priority];
  return (
    <Badge variant={variant}>
      {priority === "critical" && <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />}
      {label}
    </Badge>
  );
}

export function StatusBadge({ status }: { status: Status }) {
  const map: Record<Status, { label: string; variant: BadgeProps["variant"] }> = {
    open: { label: "Open", variant: "info" },
    in_progress: { label: "In Progress", variant: "warning" },
    resolved: { label: "Resolved", variant: "success" },
    escalated: { label: "Escalated", variant: "danger" },
    closed: { label: "Closed", variant: "neutral" },
  };
  const { label, variant } = map[status];
  return <Badge variant={variant}>{label}</Badge>;
}
