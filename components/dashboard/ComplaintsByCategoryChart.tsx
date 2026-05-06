"use client";

import { useEffect, useState } from "react";
import { EChart } from "@/components/ui/echart";
import { useLang } from "@/lib/language-context";
import type { EChartsOption } from "echarts";

interface DataPoint { category: string; categoryEn?: string; color: string; count: number }

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

export function ComplaintsByCategoryChart({ data }: { data?: DataPoint[] }) {
  const dark = useIsDark();
  const { lang } = useLang();
  const axisColor = dark ? "#64748b" : "#94a3b8";

  const sorted = [...(data ?? [])].sort((a, b) => b.count - a.count);
  const getName = (d: DataPoint) => lang === "en" && d.categoryEn ? d.categoryEn : d.category;
  const complaintWord = lang === "ar" ? "شكوى" : "complaint(s)";

  const option: EChartsOption = {
    tooltip: {
      trigger: "item",
      formatter: (params: any) =>
        `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${params.color};margin-inline-end:6px"></span>` +
        `<b>${params.name}</b><br/>` +
        `${params.value} ${complaintWord} &nbsp;·&nbsp; ${params.percent}%`,
    },
    legend: {
      bottom: 0,
      icon: "circle",
      itemWidth: 8,
      itemHeight: 8,
      itemGap: 12,
      textStyle: { fontSize: 10, color: axisColor },
      type: "scroll",
    },
    series: [
      {
        type: "pie",
        roseType: "area",
        radius: ["15%", "72%"],
        center: ["50%", "46%"],
        itemStyle: {
          borderRadius: 6,
          borderColor: dark ? "#0f172a" : "#ffffff",
          borderWidth: 2,
        },
        label: {
          show: true,
          fontSize: 10,
          color: axisColor,
          formatter: "{b}\n{c}",
          lineHeight: 14,
        },
        labelLine: { length: 8, length2: 10, smooth: true },
        emphasis: {
          scale: true,
          scaleSize: 6,
          itemStyle: { shadowBlur: 16, shadowColor: "rgba(0,0,0,0.2)" },
          label: { fontSize: 12, fontWeight: "bold" as const },
        },
        data: sorted.map(d => ({ value: d.count, name: getName(d), itemStyle: { color: d.color } })),
      },
    ],
  };

  if (!sorted.length) return (
    <div className="h-[280px] flex items-center justify-center">
      <div className="w-40 h-40 rounded-full bg-muted animate-pulse" />
    </div>
  );

  return <EChart option={option} height={280} />;
}
