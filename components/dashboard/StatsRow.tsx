"use client";

import { MessageSquareWarning, AlertCircle, CheckCircle2, TrendingUp } from "lucide-react";
import { StatsCard } from "./StatsCard";
import type { StatsCardData } from "@/types";

const statsData: StatsCardData[] = [
  {
    label: "Total Complaints",
    value: "1,248",
    change: 12,
    changeLabel: "vs last month",
    icon: MessageSquareWarning,
    color: "blue",
  },
  {
    label: "Open Complaints",
    value: "312",
    change: -8,
    changeLabel: "vs last month",
    icon: AlertCircle,
    color: "amber",
  },
  {
    label: "Resolved",
    value: "847",
    change: 18,
    changeLabel: "vs last month",
    icon: CheckCircle2,
    color: "green",
  },
  {
    label: "Escalated",
    value: "89",
    change: -3,
    changeLabel: "vs last month",
    icon: TrendingUp,
    color: "red",
  },
];

export function StatsRow() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
      {statsData.map((data) => (
        <StatsCard key={data.label} data={data} />
      ))}
    </div>
  );
}
