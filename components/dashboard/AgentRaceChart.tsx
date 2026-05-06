"use client";

import { useEffect, useRef, useState } from "react";
import ReactECharts from "echarts-for-react";
import type { EChartsType } from "echarts";

interface AgentItem {
  name: string;
  color: string;
  value: number;
}

interface Props {
  data?: AgentItem[];
  lang?: "ar" | "en";
  suffix?: string;
  maxBars?: number;
}


const PALETTE = [
  "#6366f1", "#22c55e", "#f59e0b", "#ef4444",
  "#3b82f6", "#ec4899", "#14b8a6", "#f97316",
  "#8b5cf6", "#06b6d4",
];

function assignColors(items: AgentItem[]): AgentItem[] {
  const unique = new Set(items.map(d => d.color));
  if (unique.size > 1) return items; 
  return items.map((d, i) => ({ ...d, color: PALETTE[i % PALETTE.length] }));
}

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

const ANIM_DURATION = 2800;

export function AgentRaceChart({ data, lang = "ar", suffix = "", maxBars = 5 }: Props) {
  const dark       = useIsDark();
  const chartRef   = useRef<{ getEchartsInstance(): EChartsType } | null>(null);
  const frameRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stepRef    = useRef(0);
  const axisColor  = dark ? "#64748b" : "#94a3b8";
  const splitColor = dark ? "#1e293b" : "#f1f5f9";
  const bgColor    = dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)";

  const sorted = assignColors([...(data ?? [])]).sort((a, b) => b.value - a.value);
  const names  = sorted.map(d => d.name);

  function buildStep(step: number) {
    const progress = Math.min(step / 3, 1);
    return sorted.map(d => {
      const jitter = step > 3 ? (Math.random() - 0.5) * d.value * 0.04 : 0;
      return Math.max(0, Math.round(d.value * progress + jitter));
    });
  }

  function getOption(values: number[]) {
    const paired = names
      .map((n, i) => ({ n, v: values[i], c: sorted[i].color }))
      .sort((a, b) => b.v - a.v);

    return {
      backgroundColor: "transparent",
      grid: { top: 8, right: 80, bottom: 8, left: 8, containLabel: true },
      xAxis: {
        max: "dataMax",
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: splitColor, type: "dashed" } },
        axisLabel: { fontSize: 10, color: axisColor },
      },
      yAxis: {
        type: "category",
        data: paired.map(p => p.n),
        inverse: true,
        animationDuration: 300,
        animationDurationUpdate: 300,
        max: Math.min(maxBars - 1, paired.length - 1),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          fontSize: 11,
          color: axisColor,
          width: 90,
          overflow: "truncate" as const,
        },
      },
      series: [
        {
          realtimeSort: true,
          type: "bar",
          barMaxWidth: 28,
          data: paired.map(p => ({
            value: p.v,
            itemStyle: {
              color: p.c,
              borderRadius: [0, 6, 6, 0],
              shadowBlur: 6,
              shadowColor: p.c + "66",
            },
          })),
          label: {
            show: true,
            position: "right",
            valueAnimation: true,
            fontSize: 11,
            fontWeight: "bold",
            color: axisColor,
            formatter: (params: { value: number }) => `${params.value}${suffix}`,
          },
          showBackground: true,
          backgroundStyle: { color: bgColor, borderRadius: [0, 6, 6, 0] },
        },
      ],
      animationDuration: 0,
      animationDurationUpdate: ANIM_DURATION,
      animationEasing: "linear" as const,
      animationEasingUpdate: "linear" as const,
    };
  }

  useEffect(() => {
    if (!sorted.length) return;
    stepRef.current = 0;

    function tick() {
      const instance = chartRef.current?.getEchartsInstance();
      if (!instance) return;
      const values = buildStep(stepRef.current);
      instance.setOption(getOption(values), { notMerge: false });
      stepRef.current++;
      frameRef.current = setTimeout(tick, ANIM_DURATION);
    }

    frameRef.current = setTimeout(tick, 100);
    return () => { if (frameRef.current) clearTimeout(frameRef.current); };
  
  }, [data, dark, lang]);

  if (!sorted.length) return (
    <div className="space-y-3 p-2">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="h-7 bg-muted rounded animate-pulse" style={{ width: `${50 + i * 10}%` }} />
      ))}
    </div>
  );

  return (
    <ReactECharts
      ref={chartRef as any}
      option={getOption(sorted.map(() => 0))}
      style={{ height: Math.min(sorted.length, maxBars) * 52 + 24, width: "100%" }}
      opts={{ renderer: "svg" }}
      notMerge={false}
    />
  );
}
