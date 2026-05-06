"use client";

import { recentComplaints } from "@/lib/data";
import { PriorityBadge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

export function RecentComplaintsTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-100 dark:border-neutral-800">
            <th className="pb-3 pl-0 pr-4 text-left text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
              ID
            </th>
            <th className="pb-3 px-4 text-left text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
              Title
            </th>
            <th className="pb-3 px-4 text-left text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500 hidden md:table-cell">
              Category
            </th>
            <th className="pb-3 px-4 text-left text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500 hidden sm:table-cell">
              Priority
            </th>
            <th className="pb-3 px-4 text-left text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
              Status
            </th>
            <th className="pb-3 px-4 text-left text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500 hidden lg:table-cell">
              Date
            </th>
            <th className="pb-3 pl-4 pr-0 text-right text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-50 dark:divide-neutral-800/60">
          {recentComplaints.map((complaint) => (
            <tr
              key={complaint.id}
              className="group transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/40"
            >
              <td className="py-3.5 pl-0 pr-4">
                <span className="font-mono text-xs font-medium text-neutral-500 dark:text-neutral-400">
                  {complaint.id}
                </span>
              </td>
              <td className="py-3.5 px-4 max-w-[200px]">
                <span className="truncate block font-medium text-neutral-800 dark:text-neutral-200">
                  {complaint.title}
                </span>
              </td>
              <td className="py-3.5 px-4 hidden md:table-cell">
                <span className="text-neutral-500 dark:text-neutral-400">{complaint.category}</span>
              </td>
              <td className="py-3.5 px-4 hidden sm:table-cell">
                <PriorityBadge priority={complaint.priority} />
              </td>
              <td className="py-3.5 px-4">
                <StatusBadge status={complaint.status} />
              </td>
              <td className="py-3.5 px-4 hidden lg:table-cell">
                <span className="text-neutral-400 dark:text-neutral-500 text-xs">
                  {new Date(complaint.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </td>
              <td className="py-3.5 pl-4 pr-0 text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 h-7 w-7"
                  aria-label="More options"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
