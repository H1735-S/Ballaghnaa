"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { EChart } from "@/components/ui/echart";
import type { EChartsOption } from "echarts";

const CHART_VARS = [
  "--color-chart-1",
  "--color-chart-2",
  "--color-chart-3",
  "--color-chart-4",
  "--color-chart-5",
];

function resolveChartColors(): string[] {
  if (typeof window === "undefined") return CHART_VARS;
  const style = getComputedStyle(document.documentElement);
  return CHART_VARS.map((v) => style.getPropertyValue(v).trim() || v);
}

function useIsDark() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const update = () =>
      setDark(document.documentElement.classList.contains("dark"));
    update();
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => obs.disconnect();
  }, []);
  return dark;
}

interface CategoryItem {
  name: string;
  nameEn?: string;
  count: number;
}

export function ComplaintsByCategoryChart({
  data,
  lang,
}: {
  data?: CategoryItem[];
  lang?: "ar" | "en";
}) {
  const dark = useIsDark();

  const [palette, setPalette] = useState<string[]>([]);
  const [canScrollStart, setCanScrollStart] = useState(false);
  const [canScrollEnd, setCanScrollEnd]     = useState(false);
  const legendRef = useRef<HTMLDivElement>(null);

  const isRtl = lang === "ar";

  useEffect(() => {
    setPalette(resolveChartColors());
  }, [dark]);

  
  const checkScroll = () => {
    const el = legendRef.current;
    if (!el) return;
    setCanScrollStart(el.scrollLeft > 4);
    setCanScrollEnd(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    const el = legendRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll);
    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);
    return () => { el.removeEventListener("scroll", checkScroll); ro.disconnect(); };
  
  }, [palette, data]);

  const scroll = (dir: "start" | "end") => {
    const el = legendRef.current;
    if (!el) return;
    
    const amount = 120;
    el.scrollBy({ left: dir === "end" ? amount : -amount, behavior: "smooth" });
  };

  const tooltipBg     = dark ? "#1e293b" : "#ffffff";
  const tooltipBorder = dark ? "#334155" : "#e2e8f0";
  const tooltipText   = dark ? "#f1f5f9" : "#1E3A5F";

  const allItems = (data ?? [])
    .filter((d) => d.count > 0)
    .sort((a, b) => b.count - a.count)
    .map((d, i) => ({
      name: (lang === "en" && d.nameEn) ? d.nameEn : d.name,
      value: d.count,
      color: palette[i % (palette.length || 1)] ?? "#94a3b8",
    }));

  const option: EChartsOption = {
    color: palette.length ? palette : undefined,
    tooltip: {
      trigger: "item",
      backgroundColor: tooltipBg,
      borderColor: tooltipBorder,
      borderWidth: 1,
      textStyle: { color: tooltipText, fontSize: 12 },
      padding: [8, 12],
      formatter: "{b}: <b>{c}</b> ({d}%)",
    },
    legend: { show: false },
    series: [
      {
        name: lang === "en" ? "Complaints by Category" : "الشكاوى حسب الفئة",
        type: "pie",
        radius: ["50%", "88%"],
        center: ["50%", "50%"],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 4 },
        label: {
          show: false,
          position: "center",
        },
      emphasis: {
  scale: false,
  label: {
    show: true,
    fontSize: 11,
    fontWeight: "bold",
    color: dark ? "#f8fafc" : "#1E3A5F",
    width: 90,
    overflow: "break",
    lineHeight: 16,
    formatter: "{b}\n{d}%",
  },
},
        labelLine: { show: false },
        data: allItems.map((d) => ({
          name: d.name,
          value: d.value,
          itemStyle: { color: d.color },
        })),
      },
    ],
  };

  if (!allItems.length)
    return (
      <div className="h-[220px] flex items-center justify-center">
        <div className="w-28 h-28 rounded-full bg-muted animate-pulse" />
      </div>
    );

  
  const StartArrow = isRtl ? ChevronRight : ChevronLeft;
  const EndArrow   = isRtl ? ChevronLeft  : ChevronRight;

  return (
    <div className="flex flex-col gap-3">
      <EChart option={option} height={280} />

      
      <div className="relative flex items-center gap-1 px-1">
        
        <button
          onClick={() => scroll("start")}
          disabled={!canScrollStart}
          className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full
                     text-muted-foreground hover:text-foreground hover:bg-muted
                     transition-all disabled:opacity-0 disabled:pointer-events-none"
          aria-label={lang === "en" ? "Previous" : "السابق"}
        >
          <StartArrow className="w-3.5 h-3.5" />
        </button>

        
        <div
          ref={legendRef}
          className="flex-1 flex items-center gap-3 overflow-x-auto scroll-smooth
                     scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none]"
          style={{ direction: isRtl ? "rtl" : "ltr" }}
        >
          {allItems.map((item) => (
            <div
              key={item.name}
              className="flex items-center gap-1.5 shrink-0"
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {item.name}
              </span>
              <span className="text-xs font-semibold" style={{ color: item.color }}>
                {item.value}
              </span>
            </div>
          ))}
        </div>

        
        <button
          onClick={() => scroll("end")}
          disabled={!canScrollEnd}
          className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full
                     text-muted-foreground hover:text-foreground hover:bg-muted
                     transition-all disabled:opacity-0 disabled:pointer-events-none"
          aria-label={lang === "en" ? "Next" : "التالي"}
        >
          <EndArrow className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
