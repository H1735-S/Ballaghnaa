"use client";

import { useEffect, useState } from "react";
import { EChart } from "@/components/ui/echart";
import type { EChartsOption } from "echarts";
import type { CallbackDataParams } from "echarts/types/dist/shared";

interface DataPoint { month: string; total: number; resolved: number }

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

function rateColor(value: number): { main: string; shadow: string; border: string } {
  if (value >= 70) return { main: "#22c55e", shadow: "#22c55e66", border: "#16a34a" };
  if (value >= 40) return { main: "#f59e0b", shadow: "#f59e0b66", border: "#d97706" };
  return             { main: "#ef4444", shadow: "#ef444466", border: "#dc2626" };
}

export function ResolutionRateChart({ data }: { data?: DataPoint[] }) {
  const dark = useIsDark();
  const axisColor  = dark ? "#64748b" : "#94a3b8";
  const splitColor = dark ? "#1e293b" : "#f1f5f9";

  const rates = (data ?? []).map(d =>
    d.total > 0 ? Math.round((d.resolved / d.total) * 100) : 0
  );

  const option: EChartsOption = {
    grid: { top: 24, right: 16, bottom: 32, left: 8, containLabel: true },
    tooltip: {
      trigger: "axis",
      formatter: (p: unknown) => {
        const point = Array.isArray(p) ? p[0] : p;
        const name  = (point as { name?: string }).name ?? "";
        const value = Number((point as { value?: number }).value ?? 0);
        const { main } = rateColor(value);
        return `${name}: <b style="color:${main}">${value}%</b>`;
      },
      backgroundColor: dark ? "#1e293b" : "#fff",
      borderColor: dark ? "#334155" : "#e2e8f0",
      borderWidth: 1,
      textStyle: { color: dark ? "#f1f5f9" : "#1E3A5F", fontSize: 12 },
      padding: [8, 12],
    },
    xAxis: {
      type: "category",
      data: (data ?? []).map(d => d.month),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { fontSize: 11, color: axisColor },
    },
    yAxis: {
      type: "value",
      max: 100,
      splitLine: { lineStyle: { color: splitColor, type: "dashed" } },
      axisLabel: { fontSize: 11, color: axisColor, formatter: "{value}%" },
      axisLine: { show: false },
      axisTick: { show: false },
    },
    series: [
      {
        type: "bar",
        barMaxWidth: 36,
        data: rates.map(v => {
          const { main, shadow, border } = rateColor(v);
          return {
            value: v,
            itemStyle: {
              color: {
                type: "linear" as const,
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                  { offset: 0, color: main },
                  { offset: 1, color: main + "99" },
                ],
              },
              borderRadius: [8, 8, 0, 0],
              borderWidth: 1,
              borderType: "solid" as const,
              borderColor: border,
              shadowBlur: 8,
              shadowColor: shadow,
              shadowOffsetY: 2,
              opacity: v === 0 ? 0.3 : 1,
            },
          };
        }),
        label: {
          show: true,
          position: "top",
          fontSize: 11,
          fontWeight: "bold" as const,
          color: axisColor,
          formatter: (p: CallbackDataParams) => `${p.value}%`,
        },
        showBackground: true,
        backgroundStyle: {
          color: dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
          borderRadius: [8, 8, 0, 0],
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 16,
            shadowOffsetY: 4,
            opacity: 1,
          },
        },
      },
    ],
  };

  if (!data?.length) return <div className="h-[220px] bg-muted rounded-xl animate-pulse" />;
  return <EChart option={option} height={220} />;
}
