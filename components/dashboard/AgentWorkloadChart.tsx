"use client";

import { motion } from "framer-motion";

interface DataPoint { name: string; color: string; count: number }

export function AgentWorkloadChart({ data }: { data?: DataPoint[] }) {
  if (!data?.length) return (
    <div className="space-y-3">
      {[1,2,3,4].map(i => <div key={i} className="h-8 bg-muted rounded animate-pulse" />)}
    </div>
  );

  const max = Math.max(...data.map(d => d.count), 1);

  return (
    <div className="space-y-3">
      {data.map((agent, i) => (
        <motion.div key={agent.name} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }} className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
            style={{ backgroundColor: agent.color }}>
            {agent.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground truncate">{agent.name}</p>
            <div className="mt-1 h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div className="h-full rounded-full bg-primary"
                initial={{ width: 0 }} animate={{ width: `${(agent.count / max) * 100}%` }}
                transition={{ duration: 0.7, ease: "easeOut", delay: i * 0.05 }} />
            </div>
          </div>
          <span className="text-xs font-bold text-primary shrink-0">{agent.count}</span>
        </motion.div>
      ))}
    </div>
  );
}
