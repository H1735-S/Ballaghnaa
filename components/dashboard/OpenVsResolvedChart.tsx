"use client";

import { useEffect, useState } from "react";
import { EChart } from "@/components/ui/echart";
import type { EChartsOption } from "echarts";

interface DataPoint { month: string; total: number; resolved: number; escalated: number }

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

const OPEN_COLOR     = "#1E3A5F";
const RESOLVED_COLOR = "#22c55e";

export function OpenVsResolvedChart({ data, lang = "ar" }: { data?: DataPoint[]; lang?: "ar" | "en" }) {
  const dark = useIsDark();
  const axisColor  = dark ? "#64748b" : "#94a3b8";
  const splitColor = dark ? "#1e293b" : "#f1f5f9";

  const openLabel     = lang === "ar" ? "مفتوحة"  : "Open";
  const resolvedLabel = lang === "ar" ? "محلولة"  : "Resolved";

  const months   = (data ?? []).map(d => d.month);
  const resolved = (data ?? []).map(d => d.resolved);
  const open     = (data ?? []).map(d => Math.max(0, d.total - d.resolved));

  const option: EChartsOption = {
    grid: { top: 16, right: 16, bottom: 48, left: 8, containLabel: true },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "cross", label: { backgroundColor: "#6a7985" } },
      backgroundColor: dark ? "#1e293b" : "#fff",
      borderColor: dark ? "#334155" : "#e2e8f0",
      borderWidth: 1,
      textStyle: { color: dark ? "#f1f5f9" : "#1E3A5F", fontSize: 12 },
      padding: [8, 12],
    },
    legend: {
      bottom: 0,
      icon: "circle",
      itemWidth: 10,
      itemHeight: 10,
      itemGap: 32,
      formatter: (name: string) => `  ${name}`,
      textStyle: {
        fontSize: 12,
        color: axisColor,
        fontWeight: "bold" as const,
      },
    },
    xAxis: {
      type: "category",
      data: months,
      boundaryGap: false,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { fontSize: 11, color: axisColor, margin: 10 },
    },
    yAxis: {
      type: "value",
      splitLine: { lineStyle: { color: splitColor, type: "dashed" } },
      axisLabel: { fontSize: 11, color: axisColor },
      axisLine: { show: false },
      axisTick: { show: false },
      minInterval: 1,
    },
    series: [
      {
        name: openLabel,
        type: "line",
        stack: "total",
        smooth: 0.4,
        symbol: "circle",
        symbolSize: 5,
        showSymbol: false,
        lineStyle: { color: OPEN_COLOR, width: 2 },
        itemStyle: { color: OPEN_COLOR },
        areaStyle: {
          color: {
            type: "linear", x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(30,58,95,0.45)" },
              { offset: 1, color: "rgba(30,58,95,0.05)" },
            ],
          },
        },
        data: open,
      },
      {
        name: resolvedLabel,
        type: "line",
        stack: "total",
        smooth: 0.4,
        symbol: "circle",
        symbolSize: 5,
        showSymbol: false,
        lineStyle: { color: RESOLVED_COLOR, width: 2 },
        itemStyle: { color: RESOLVED_COLOR },
        areaStyle: {
          color: {
            type: "linear", x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(34,197,94,0.45)" },
              { offset: 1, color: "rgba(34,197,94,0.05)" },
            ],
          },
        },
        data: resolved,
      },
    ],
  };

  if (!data?.length) return <div className="h-[240px] bg-muted rounded-xl animate-pulse" />;
  return <EChart option={option} height={240} />;
}
