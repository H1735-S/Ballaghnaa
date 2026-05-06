"use client";

import { motion } from "framer-motion";

interface DataPoint { category: string; color: string; avgDays: number }

export function AvgResolutionChart({ data }: { data?: DataPoint[] }) {
  if (!data?.length) return (
    <div className="space-y-3">
      {[1,2,3,4].map(i => <div key={i} className="h-4 bg-muted rounded animate-pulse" />)}
    </div>
  );

  const max = Math.max(...data.map(d => d.avgDays), 1);

  return (
    <div className="space-y-3">
      {data.map((item, i) => (
        <motion.div key={item.category} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.06 }} className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground truncate w-24 shrink-0">{item.category}</span>
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <motion.div className="h-full rounded-full" style={{ backgroundColor: item.color }}
              initial={{ width: 0 }} animate={{ width: `${(item.avgDays / max) * 100}%` }}
              transition={{ duration: 0.7, ease: "easeOut", delay: i * 0.06 }} />
          </div>
          <span className="text-xs font-semibold text-muted-foreground w-12 text-right shrink-0">
            {item.avgDays}d
          </span>
        </motion.div>
      ))}
    </div>
  );
}
