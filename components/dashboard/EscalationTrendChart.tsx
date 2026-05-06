"use client";

import { useEffect, useState } from "react";
import { EChart } from "@/components/ui/echart";
import type { EChartsOption } from "echarts";

interface DataPoint { month: string; total: number; resolved: number; escalated: number }

interface SupervisorTypes { general: number; specialized: number }

interface Props {
  data?: DataPoint[];
  supervisorTypes?: SupervisorTypes;
  supervisorCount?: number;
  escalatedTotal?: number;
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


const C_GENERAL    = "#6366f1"; 
const C_SPECIALIZED = "#8b5cf6"; 
const C_ESCALATED  = "#ef4444"; 
const C_RESOLVED   = "#22c55e"; 

export function EscalationTrendChart({ data, supervisorTypes, supervisorCount = 0, escalatedTotal = 0, lang = "ar" }: Props) {
  const dark = useIsDark();
  const axisColor = dark ? "#64748b" : "#94a3b8";
  const borderColor = dark ? "#0f172a" : "#ffffff";

  const general    = supervisorTypes?.general    ?? 0;
  const specialized = supervisorTypes?.specialized ?? 0;
  const totalEscalated = escalatedTotal || (data ?? []).reduce((s, d) => s + d.escalated, 0);
  const totalResolved  = (data ?? []).reduce((s, d) => s + d.resolved, 0);

  const labels = {
    general:     lang === "ar" ? "مشرفون عامون"    : "General Supervisors",
    specialized: lang === "ar" ? "مشرفون متخصصون"  : "Specialized Supervisors",
    escalated:   lang === "ar" ? "شكاوى متصاعدة"   : "Escalated Complaints",
    resolved:    lang === "ar" ? "شكاوى محلولة"    : "Resolved Complaints",
    complaints:  lang === "ar" ? "شكوى"            : "complaint(s)",
    supervisors: lang === "ar" ? "مشرف"            : "supervisor(s)",
  };

  
  
  const option: EChartsOption = {
    tooltip: {
      trigger: "item",
      formatter: (params: any) =>
        `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${params.color};margin-inline-end:6px"></span>` +
        `<b>${params.name}</b><br/>${params.value} &nbsp;·&nbsp; ${params.percent}%`,
    },
    legend: {
      bottom: 0,
      icon: "circle",
      itemWidth: 8,
      itemHeight: 8,
      itemGap: 14,
      textStyle: { fontSize: 10, color: axisColor },
      type: "scroll",
    },
    series: [
      
      {
        name: lang === "ar" ? "المشرفون" : "Supervisors",
        type: "pie",
        radius: ["52%", "72%"],
        center: ["50%", "46%"],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 6,
          borderColor,
          borderWidth: 2,
        },
        label: {
          show: true,
          position: "outside",
          fontSize: 10,
          color: axisColor,
          formatter: "{b}: {c}",
        },
        labelLine: { length: 8, length2: 8, smooth: true },
        emphasis: {
          scale: true,
          scaleSize: 5,
          itemStyle: { shadowBlur: 16, shadowColor: "rgba(0,0,0,0.2)" },
        },
        data: [
          { value: general,     name: labels.general,     itemStyle: { color: C_GENERAL,     shadowBlur: 8, shadowColor: C_GENERAL + "44"    } },
          { value: specialized, name: labels.specialized, itemStyle: { color: C_SPECIALIZED, shadowBlur: 8, shadowColor: C_SPECIALIZED + "44" } },
        ].filter(d => d.value > 0),
      },
      
      {
        name: lang === "ar" ? "الشكاوى" : "Complaints",
        type: "pie",
        radius: ["20%", "46%"],
        center: ["50%", "46%"],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 4,
          borderColor,
          borderWidth: 2,
        },
        label: {
          show: true,
          position: "inside",
          fontSize: 10,
          fontWeight: "bold" as const,
          color: "#fff",
          formatter: "{c}",
        },
        emphasis: {
          scale: true,
          scaleSize: 4,
          itemStyle: { shadowBlur: 12, shadowColor: "rgba(0,0,0,0.2)" },
          label: { fontSize: 12 },
        },
        data: [
          { value: totalEscalated, name: labels.escalated, itemStyle: { color: C_ESCALATED, shadowBlur: 10, shadowColor: C_ESCALATED + "55" } },
          { value: totalResolved,  name: labels.resolved,  itemStyle: { color: C_RESOLVED,  shadowBlur: 10, shadowColor: C_RESOLVED  + "55" } },
        ].filter(d => d.value > 0),
      },
    ],
  };

  const hasData = general > 0 || specialized > 0 || totalEscalated > 0 || totalResolved > 0;

  if (!hasData) return (
    <div className="h-[280px] flex items-center justify-center">
      <div className="w-36 h-36 rounded-full bg-muted animate-pulse" />
    </div>
  );

  return <EChart option={option} height={280} />;
}
