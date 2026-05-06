"use client";

import { useEffect, useState } from "react";
import { EChart } from "@/components/ui/echart";
import type { EChartsOption } from "echarts";

const PRIORITY_ORDER = ["low", "medium", "high", "critical"] as const;

const PRIORITY_LABELS: Record<string, { ar: string; en: string }> = {
  low:      { ar: "منخفضة", en: "Low"      },
  medium:   { ar: "متوسطة", en: "Medium"   },
  high:     { ar: "عالية",  en: "High"     },
  critical: { ar: "حرج",    en: "Critical" },
};

const PRIORITY_COLORS: Record<string, string> = {
  low:      "#94a3b8",
  medium:   "#3b82f6",
  high:     "#f97316",
  critical: "#ef4444",
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

export function PriorityScatterChart({ data, lang = "ar" }: { data?: Record<string, number>; lang?: "ar" | "en" }) {
  const dark = useIsDark();
  const axisColor  = dark ? "#64748b" : "#94a3b8";
  const splitColor = dark ? "#1e293b" : "#f1f5f9";

  const total = Object.values(data ?? {}).reduce((s, v) => s + v, 0);

  const label = (p: string) => PRIORITY_LABELS[p]?.[lang] ?? p;
  const complaintWord = lang === "ar" ? "شكوى" : "complaint(s)";
  const countLabel    = lang === "ar" ? "عدد الشكاوى" : "Complaints";

  const series = PRIORITY_ORDER.map((p) => {
    const count = data?.[p] ?? 0;
    const pct   = total > 0 ? Math.round((count / total) * 100) : 0;
    return {
      name: label(p),
      type: "scatter" as const,
      data: [[PRIORITY_ORDER.indexOf(p), count, pct]],
      symbolSize: (val: number[]) => Math.max(18, Math.min(80, val[2] * 1.8 + 18)),
      itemStyle: {
        color: PRIORITY_COLORS[p],
        opacity: 0.88,
        shadowBlur: 12,
        shadowColor: PRIORITY_COLORS[p] + "55",
      },
      emphasis: {
        scale: true,
        itemStyle: { opacity: 1, shadowBlur: 24 },
      },
      label: {
        show: true,
        
        formatter: (params: any) => `${(params.value as number[])[1]}`,
        color: "#fff",
        fontSize: 11,
        fontWeight: "bold" as const,
      },
    };
  });

  const option: EChartsOption = {
    grid: { top: 24, right: 24, bottom: 56, left: 8, containLabel: true },
    tooltip: {
      trigger: "item",
      
      formatter: (params: any) => {
        const p = params as { seriesName: string; value: number[] };
        return `<div style="font-weight:600">${p.seriesName}</div>` +
          `<div>${p.value[1]} ${complaintWord} &nbsp;·&nbsp; ${p.value[2]}%</div>`;
      },
    },
    legend: {
      bottom: 0,
      icon: "circle",
      itemWidth: 8,
      itemHeight: 8,
      itemGap: 16,
      textStyle: { fontSize: 11, color: axisColor },
    },
    xAxis: {
      type: "category",
      data: PRIORITY_ORDER.map(label),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { fontSize: 11, color: axisColor, margin: 12 },
      splitLine: { show: false },
    },
    yAxis: {
      type: "value",
      name: countLabel,
      nameTextStyle: { fontSize: 10, color: axisColor, padding: [0, 0, 0, -8] },
      splitLine: { lineStyle: { color: splitColor, type: "dashed" } },
      axisLabel: { fontSize: 10, color: axisColor },
      axisLine: { show: false },
      axisTick: { show: false },
      minInterval: 1,
    },
    series,
  };

  if (!data || total === 0) return (
    <div className="h-[260px] flex items-center justify-center">
      <div className="space-y-2 w-full px-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-4 bg-muted rounded animate-pulse" style={{ width: `${60 + i * 12}%` }} />
        ))}
      </div>
    </div>
  );

  return <EChart option={option} height={260} />;
}
