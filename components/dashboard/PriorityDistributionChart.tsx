"use client";

import { useEffect, useState } from "react";
import { EChart } from "@/components/ui/echart";
import type { EChartsOption } from "echarts";

const COLORS: Record<string, string> = {
  low: "#94a3b8", medium: "#3b82f6", high: "#f97316", critical: "#ef4444",
};

function useIsDark() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const update = () => setDark(document.documentElement.classList.contains("dark"));
    update();
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);
  return dark;
}

export function PriorityDistributionChart({ data }: { data?: Record<string, number> }) {
  const dark = useIsDark();

  const items = Object.entries(data ?? {}).filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value, color: COLORS[name] ?? "#94a3b8" }));
  const total = items.reduce((s, d) => s + d.value, 0);

  const option: EChartsOption = {
    tooltip: {
      trigger: "item",
      formatter: (p: any) => `${p.name}: <b>${p.value}</b> (${p.percent}%)`,
      backgroundColor: dark ? "#1e293b" : "#fff",
      borderColor: dark ? "#334155" : "#e2e8f0",
      borderWidth: 1,
      textStyle: { color: dark ? "#f1f5f9" : "#1E3A5F", fontSize: 12 },
    },
    graphic: [
      { type: "text", left: "center", top: "38%", style: { text: String(total), fill: dark ? "#f8fafc" : "#1E3A5F", fontSize: 22, fontWeight: "bold" } as object },
      { type: "text", left: "center", top: "54%", style: { text: "total", fill: dark ? "#64748b" : "#94a3b8", fontSize: 11 } as object },
    ],
    series: [{
      type: "pie", radius: ["52%", "76%"], center: ["50%", "46%"],
      padAngle: 2, startAngle: 90,
      itemStyle: { borderRadius: 4, borderColor: dark ? "#0f172a" : "#fff", borderWidth: 2 },
      label: { show: false }, labelLine: { show: false },
      emphasis: { scale: true, scaleSize: 4 },
      data: items.map(d => ({ name: d.name, value: d.value, itemStyle: { color: d.color } })),
    }],
  };

  if (!items.length) return <div className="h-[180px] bg-muted rounded-xl animate-pulse" />;

  return (
    <div className="flex flex-col gap-3">
      <EChart option={option} height={180} />
      <div className="flex flex-wrap gap-x-3 gap-y-1.5 justify-center">
        {items.map(item => (
          <div key={item.name} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-xs text-muted-foreground capitalize">{item.name}</span>
            <span className="text-xs font-semibold" style={{ color: item.color }}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
