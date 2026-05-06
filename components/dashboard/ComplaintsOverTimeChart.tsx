"use client";

import { useEffect, useState } from "react";
import { EChart } from "@/components/ui/echart";
import type { EChartsOption } from "echarts";

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


const PRIMARY   = "#1E3A5F";
const RESOLVED  = "#22c55e";

export function ComplaintsOverTimeChart({ data }: { data?: DataPoint[] }) {
  const dark = useIsDark();

  const axisColor  = dark ? "#64748b" : "#94a3b8";
  const splitColor = dark ? "#1e293b" : "#f1f5f9";
  const tooltipBg  = dark ? "#1e293b" : "#ffffff";
  const tooltipBorder = dark ? "#334155" : "#e2e8f0";
  const tooltipText   = dark ? "#f1f5f9" : "#1E3A5F";

  const months = (data ?? []).map(d => d.month);

  const option: EChartsOption = {
    grid: { top: 16, right: 16, bottom: 48, left: 8, containLabel: true },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "line", lineStyle: { color: splitColor, width: 1 } },
      backgroundColor: tooltipBg,
      borderColor: tooltipBorder,
      borderWidth: 1,
      textStyle: { color: tooltipText, fontSize: 12 },
      padding: [8, 12],
    },
   legend: {
  bottom: 0,
  icon: "circle",
  itemWidth: 8,
  itemHeight: 8,
  itemGap: 20,
  textStyle: { fontSize: 12, color: axisColor },
  formatter: (name) => `     ${name}`,
},
    xAxis: {
      type: "category",
      data: months,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { fontSize: 11, color: axisColor, margin: 10 },
      boundaryGap: false,
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
        name: "Total",
        type: "line",
        data: (data ?? []).map(d => d.total),
        smooth: 0.4,
        symbol: "circle",
        symbolSize: 5,
        showSymbol: false,
        lineStyle: { color: PRIMARY, width: 2.5 },
        itemStyle: { color: PRIMARY },
        areaStyle: {
          color: {
            type: "linear", x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(30,58,95,0.18)" },
              { offset: 1, color: "rgba(30,58,95,0)" },
            ],
          },
        },
      },
      {
        name: "Resolved",
        type: "line",
        data: (data ?? []).map(d => d.resolved),
        smooth: 0.4,
        symbol: "circle",
        symbolSize: 5,
        showSymbol: false,
        lineStyle: { color: RESOLVED, width: 2.5 },
        itemStyle: { color: RESOLVED },
        areaStyle: {
          color: {
            type: "linear", x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(34,197,94,0.15)" },
              { offset: 1, color: "rgba(34,197,94,0)" },
            ],
          },
        },
      },
    ],
  };

  if (!data?.length) return (
    <div className="h-[280px] flex items-center justify-center">
      <div className="space-y-2 w-full px-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-4 bg-muted rounded animate-pulse" style={{ width: `${70 + i * 10}%` }} />
        ))}
      </div>
    </div>
  );

  return <EChart option={option} height={280} />;
}
