"use client";

import { useEffect, useState } from "react";
import { EChart } from "@/components/ui/echart";
import type { EChartsOption } from "echarts";

// CSS chart vars → resolved at runtime to support theming
const CHART_VARS = ["--color-chart-1","--color-chart-2","--color-chart-3","--color-chart-4","--color-chart-5"];
const resolveChartColors = (): string[] => {
  if (typeof window === "undefined") return CHART_VARS;
  const s = getComputedStyle(document.documentElement);
  return CHART_VARS.map((v) => s.getPropertyValue(v).trim() || v);
};

// Bilingual status labels
const STATUS_LABELS: Record<string, { ar: string; en: string }> = {
  open:        { ar: "مفتوحة",       en: "Open"        },
  in_review:   { ar: "قيد المراجعة", en: "In Review"   },
  assigned:    { ar: "مُسندة",        en: "Assigned"    },
  in_progress: { ar: "جارية",         en: "In Progress" },
  resolved:    { ar: "محلولة",        en: "Resolved"    },
  closed:      { ar: "مغلقة",         en: "Closed"      },
  escalated:   { ar: "متصاعدة",       en: "Escalated"   },
  rejected:    { ar: "مرفوضة",        en: "Rejected"    },
};

// Watches dark-mode class on <html>
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

interface StatusItem { status: string; count: number }

export function ComplaintsByStatusChart({ data, lang }: { data?: StatusItem[]; lang?: "ar" | "en" }) {
  const dark  = useIsDark();
  const isRtl = lang === "ar";

  const [palette,  setPalette]  = useState<string[]>([]);
  const [animated, setAnimated] = useState(false);

  // Re-resolve colors when theme changes
  useEffect(() => { setPalette(resolveChartColors()); }, [dark]);

  // Entrance animation: bars grow from 0 on mount / data change
  useEffect(() => {
    setAnimated(false);
    const t = setTimeout(() => setAnimated(true), 80);
    return () => clearTimeout(t);
  }, [data]);

  // Theme-aware colors
  const tooltipBg     = dark ? "#1e293b" : "#ffffff";
  const tooltipBorder = dark ? "#334155" : "#e2e8f0";
  const tooltipText   = dark ? "#f1f5f9" : "#1E3A5F";
  const axisColor     = dark ? "#475569" : "#cbd5e1";
  const labelColor    = dark ? "#94a3b8" : "#64748b";
  const splitColor    = dark ? "#1e293b" : "#f1f5f9";

  const items  = [...(data ?? [])].sort((a, b) => b.count - a.count);
  const labels = items.map((d) => STATUS_LABELS[d.status]?.[isRtl ? "ar" : "en"] ?? d.status.replace(/_/g, " "));
  const values = items.map((d) => (animated ? d.count : 0));
  const colors = items.map((_, i) => palette[i % (palette.length || 1)] ?? "#94a3b8");

  const option: EChartsOption = {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      confine: true,
      backgroundColor: tooltipBg,
      borderColor: tooltipBorder,
      borderWidth: 1,
      textStyle: { color: tooltipText, fontSize: 12 },
      padding: [8, 12],
    },
    grid: { top: 12, right: 28, bottom: 8, left: isRtl ? 115 : 105, containLabel: false },
    xAxis: {
      type: "value",
      minInterval: 1,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: splitColor, type: "dashed" } },
      axisLabel: { color: labelColor, fontSize: 11 },
    },
    yAxis: {
      type: "category",
      data: labels,
      position: "left",
      axisLine: { lineStyle: { color: axisColor } },
      axisTick: { show: false },
      axisLabel: { color: labelColor, fontSize: 11, width: 95, overflow: "truncate" as const, align: "right", margin: 12 },
    },
    series: [{
      type: "bar",
      barMaxWidth: 28,
      data: values.map((v, i) => ({
        value: v,
        itemStyle: { color: colors[i], borderRadius: [0, 6, 6, 0] as [number,number,number,number] },
      })),
      label: { show: true, position: "right" as const, distance: 4, color: labelColor, fontSize: 11, fontWeight: "bold" as const, formatter: "{c}" },
      emphasis: { itemStyle: { opacity: 0.8 } },
      animationDuration: 800,
      animationEasing: "cubicOut" as const,
    }],
  };

  if (!items.length)
    return (
      <div className="h-[220px] flex items-center justify-center">
        <div className="space-y-2 w-full px-4">
          {[80, 60, 45, 30].map((w, i) => (
            <div key={i} className="h-5 bg-muted rounded animate-pulse" style={{ width: `${w}%` }} />
          ))}
        </div>
      </div>
    );

  return <EChart option={option} height={Math.max(220, items.length * 44)} />;
}
