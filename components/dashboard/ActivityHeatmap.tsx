"use client";

import { useEffect, useRef, useState } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";

interface Props {
  data: [string, number][];
  year: number;
  lang?: "ar" | "en";
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

export function ActivityHeatmap({ data, year, lang = "ar" }: Props) {
  const dark = useIsDark();
  const axisColor  = dark ? "#64748b" : "#94a3b8";
  const borderColor = dark ? "#1e293b" : "#f1f5f9";

  const max = Math.max(...data.map(d => d[1]), 1);

  const labels = {
    title:    lang === "ar" ? "نشاط الشكاوى اليومي" : "Daily Complaint Activity",
    tooltip:  lang === "ar" ? "شكوى" : "complaint(s)",
    noData:   lang === "ar" ? "لا يوجد نشاط" : "No activity",
  };

  const option = {
    backgroundColor: "transparent",
    tooltip: {
      formatter: (p: any) => {
        const val = p.value?.[1] ?? 0;
        return val > 0
          ? `<b>${p.value[0]}</b><br/>${val} ${labels.tooltip}`
          : `<b>${p.value[0]}</b><br/>${labels.noData}`;
      },
    },
    visualMap: {
      min: 0,
      max,
      type: "piecewise" as const,
      orient: "horizontal" as const,
      left: "center",
      top: 0,
      itemWidth: 12,
      itemHeight: 12,
      itemGap: 6,
      textStyle: { fontSize: 10, color: axisColor },
      inRange: {
        color: dark
          ? ["#1e293b", "#1d4ed8", "#3b82f6", "#60a5fa", "#93c5fd"]
          : ["#f1f5f9", "#bfdbfe", "#60a5fa", "#3b82f6", "#1d4ed8"],
      },
    },
    calendar: {
      top: 50,
      left: 36,
      right: 16,
      cellSize: ["auto", 13],
      range: String(year),
      itemStyle: {
        borderWidth: 2,
        borderColor: dark ? "#0f172a" : "#ffffff",
      },
      yearLabel: { show: false },
      monthLabel: {
        nameMap: lang === "ar"
          ? ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"]
          : "en",
        color: axisColor,
        fontSize: 10,
      },
      dayLabel: {
        nameMap: lang === "ar" ? ["أح","إث","ث","أر","خ","ج","س"] : "en",
        color: axisColor,
        fontSize: 9,
        firstDay: lang === "ar" ? 0 : 1,
      },
      splitLine: { show: false },
    },
    series: {
      type: "heatmap" as const,
      coordinateSystem: "calendar" as const,
      data: data.map(([date, count]) => [date, count]),
      emphasis: {
        itemStyle: { shadowBlur: 10, shadowColor: "rgba(59,130,246,0.5)" },
      },
    },
  };

  if (!data.length) return (
    <div className="h-[160px] bg-muted rounded-xl animate-pulse" />
  );

  return (
    <ReactECharts
      option={option}
      style={{ height: 160, width: "100%" }}
      opts={{ renderer: "svg" }}
      notMerge
    />
  );
}
