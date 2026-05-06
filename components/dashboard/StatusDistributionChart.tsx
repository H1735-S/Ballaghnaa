"use client";

import { useEffect, useState } from "react";
import { EChart } from "@/components/ui/echart";
import type { EChartsOption } from "echarts";

const STATUS_COLORS: Record<string, string> = {
  open:        "#3b82f6",
  in_review:   "#eab308",
  assigned:    "#8b5cf6",
  in_progress: "#f59e0b",
  resolved:    "#22c55e",
  closed:      "#94a3b8",
  escalated:   "#ef4444",
  rejected:    "#f43f5e",
};

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

function useIsRtl() {
  const [rtl, setRtl] = useState(false);
  useEffect(() => {
    const update = () => setRtl(document.documentElement.dir === "rtl");
    update();
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["dir"] });
    return () => obs.disconnect();
  }, []);
  return rtl;
}

export function StatusDistributionChart({ data }: { data?: Record<string, number> }) {
  const dark = useIsDark();
  const rtl  = useIsRtl();

  
  const [hidden, setHidden] = useState<Set<string>>(new Set());

  const toggle = (name: string) =>
    setHidden(prev => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });

  const totalColor  = dark ? "#f8fafc" : "#1E3A5F";
  const subColor    = dark ? "#64748b" : "#94a3b8";
  const tooltipBg   = dark ? "#1e293b" : "#ffffff";
  const tooltipBorder = dark ? "#334155" : "#e2e8f0";
  const tooltipText = dark ? "#f1f5f9" : "#1E3A5F";
  const borderColor = dark ? "#0f172a" : "#ffffff";

  const allItems = Object.entries(data ?? {})
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value, color: STATUS_COLORS[name] ?? "#94a3b8" }));

  const visibleItems = allItems.filter(d => !hidden.has(d.name));
  const visibleTotal = visibleItems.reduce((s, d) => s + d.value, 0);

  const option: EChartsOption = {
    tooltip: {
      trigger: "item",
      backgroundColor: tooltipBg,
      borderColor: tooltipBorder,
      borderWidth: 1,
      textStyle: { color: tooltipText, fontSize: 12 },
      padding: [8, 12],
      formatter: (params: any) => {
        const lbl = rtl
          ? (STATUS_LABELS[params.name]?.ar ?? params.name)
          : (STATUS_LABELS[params.name]?.en ?? params.name);
        return `${lbl}: <b>${params.value}</b> (${params.percent}%)`;
      },
    },
    
    graphic: [
      {
        type: "text",
        left: "center",
        top: "35%",
        style: {
          text: String(visibleTotal),
          fill: totalColor,
          fontSize: 28,
          fontWeight: "bold",
          textAlign: "center",
        } as object,
      },
      {
        type: "text",
        left: "center",
        top: "52%",
        style: {
          text: rtl ? "إجمالي" : "total",
          fill: subColor,
          fontSize: 11,
          textAlign: "center",
        } as object,
      },
    ],
    series: [{
      type: "pie",
      radius: ["50%", "76%"],
      center: ["50%", "46%"],
      padAngle: 2,
      startAngle: 90,
      itemStyle: { borderRadius: 4, borderColor, borderWidth: 2 },
      label: { show: false },
      labelLine: { show: false },
      emphasis: {
        scale: true,
        scaleSize: 5,
        itemStyle: { shadowBlur: 12, shadowColor: "rgba(0,0,0,0.15)" },
      },
      data: visibleItems.map(d => ({
        name: d.name,
        value: d.value,
        itemStyle: { color: d.color },
      })),
    }],
  };

  if (!allItems.length) return (
    <div className="h-[200px] flex items-center justify-center">
      <div className="w-28 h-28 rounded-full bg-muted animate-pulse" />
    </div>
  );

  return (
    <div className="flex flex-col gap-3">
      
      <EChart option={option} height={200} />

      
      <div className="flex flex-wrap gap-x-3 gap-y-2 justify-center px-2">
        {allItems.map(item => {
          const isHidden = hidden.has(item.name);
          const label = rtl
            ? (STATUS_LABELS[item.name]?.ar ?? item.name)
            : (STATUS_LABELS[item.name]?.en ?? item.name);
          const pct = visibleTotal > 0 && !isHidden
            ? Math.round((item.value / visibleTotal) * 100)
            : 0;

          return (
            <button
              key={item.name}
              onClick={() => toggle(item.name)}
              className={`flex items-center gap-1.5 transition-opacity ${isHidden ? "opacity-35" : "opacity-100"}`}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0 transition-colors"
                style={{ backgroundColor: isHidden ? "#94a3b8" : item.color }}
              />
              <span className="text-xs text-muted-foreground whitespace-nowrap">{label}</span>
              {!isHidden && (
                <span className="text-xs font-semibold" style={{ color: item.color }}>
                  {item.value}
                  <span className="text-muted-foreground font-normal"> {pct}%</span>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
