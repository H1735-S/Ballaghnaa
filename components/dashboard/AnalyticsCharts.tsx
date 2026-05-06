"use client";

import { useEffect, useState } from "react";
import { EChart } from "@/components/ui/echart";
import { complaintsOverTime, complaintsByCategory, resolutionTrend, avgResponseTime } from "@/lib/data";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import type { EChartsOption } from "echarts";


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


function ComplaintsAreaChart() {
  const dark = useIsDark();
  const ax = dark ? "#475569" : "#94a3b8";
  const sp = dark ? "#1e293b" : "#f1f5f9";

  const option: EChartsOption = {
    grid: { top: 12, right: 8, bottom: 28, left: 36, containLabel: false },
    tooltip: { trigger: "axis", axisPointer: { type: "line", lineStyle: { color: sp } } },
    legend: { bottom: 0, icon: "circle", itemWidth: 8, itemHeight: 8, textStyle: { fontSize: 12, color: ax } },
    xAxis: { type: "category", data: complaintsOverTime.map((d) => d.month), axisLine: { show: false }, axisTick: { show: false }, axisLabel: { fontSize: 11, color: ax } },
    yAxis: { type: "value", splitLine: { lineStyle: { color: sp, type: "dashed" } }, axisLabel: { fontSize: 11, color: ax } },
    series: [
      {
        name: "Total", type: "line", smooth: true, symbol: "none",
        data: complaintsOverTime.map((d) => d.total),
        lineStyle: { color: "#3b82f6", width: 2.5 },
        areaStyle: { color: { type: "linear", x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: "rgba(59,130,246,0.2)" }, { offset: 1, color: "rgba(59,130,246,0)" }] } },
      },
      {
        name: "Resolved", type: "line", smooth: true, symbol: "none",
        data: complaintsOverTime.map((d) => d.resolved),
        lineStyle: { color: "#22c55e", width: 2.5 },
        areaStyle: { color: { type: "linear", x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: "rgba(34,197,94,0.18)" }, { offset: 1, color: "rgba(34,197,94,0)" }] } },
      },
    ],
  };
  return <EChart option={option} height={220} />;
}


function CategoryBarChart() {
  const dark = useIsDark();
  const ax = dark ? "#475569" : "#94a3b8";
  const sp = dark ? "#1e293b" : "#f1f5f9";
  const colors = ["#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#ec4899", "#f43f5e"];

  const option: EChartsOption = {
    grid: { top: 12, right: 8, bottom: 28, left: 36, containLabel: false },
    tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
    xAxis: { type: "category", data: complaintsByCategory.map((d) => d.category), axisLine: { show: false }, axisTick: { show: false }, axisLabel: { fontSize: 11, color: ax } },
    yAxis: { type: "value", splitLine: { lineStyle: { color: sp, type: "dashed" } }, axisLabel: { fontSize: 11, color: ax } },
    series: [{
      name: "Complaints", type: "bar", barMaxWidth: 32,
      itemStyle: { borderRadius: [6, 6, 0, 0], color: (p: { dataIndex: number }) => colors[p.dataIndex % colors.length] },
      data: complaintsByCategory.map((d) => d.count),
    }],
  };
  return <EChart option={option} height={220} />;
}


function ResolutionLineChart() {
  const dark = useIsDark();
  const ax = dark ? "#475569" : "#94a3b8";
  const sp = dark ? "#1e293b" : "#f1f5f9";

  const option: EChartsOption = {
    grid: { top: 12, right: 8, bottom: 28, left: 40, containLabel: false },
    tooltip: {
      trigger: "axis",
      valueFormatter: (value: unknown) => {
        const numberValue = Array.isArray(value) ? value[0] : value;
        return `${numberValue}%`;
      },
    },
    xAxis: { type: "category", data: resolutionTrend.map((d) => d.month), axisLine: { show: false }, axisTick: { show: false }, axisLabel: { fontSize: 11, color: ax } },
    yAxis: { type: "value", min: 60, max: 100, splitLine: { lineStyle: { color: sp, type: "dashed" } }, axisLabel: { fontSize: 11, color: ax, formatter: "{value}%" } },
    series: [{
      name: "Rate", type: "line", smooth: true, symbol: "circle", symbolSize: 7,
      data: resolutionTrend.map((d) => d.rate),
      lineStyle: { color: "#22c55e", width: 2.5 },
      itemStyle: { color: "#22c55e", borderColor: dark ? "#0f172a" : "#fff", borderWidth: 2 },
      areaStyle: { color: { type: "linear", x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: "rgba(34,197,94,0.18)" }, { offset: 1, color: "rgba(34,197,94,0)" }] } },
    }],
  };
  return <EChart option={option} height={220} />;
}


function ResponseTimeBarChart() {
  const dark = useIsDark();
  const ax = dark ? "#475569" : "#94a3b8";
  const sp = dark ? "#1e293b" : "#f1f5f9";

  const option: EChartsOption = {
    grid: { top: 12, right: 8, bottom: 28, left: 36, containLabel: false },
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      valueFormatter: (value: unknown) => {
        const numberValue = Array.isArray(value) ? value[0] : value;
        return `${numberValue}h`;
      },
    },
    xAxis: { type: "category", data: avgResponseTime.map((d) => d.month), axisLine: { show: false }, axisTick: { show: false }, axisLabel: { fontSize: 11, color: ax } },
    yAxis: { type: "value", splitLine: { lineStyle: { color: sp, type: "dashed" } }, axisLabel: { fontSize: 11, color: ax, formatter: "{value}h" } },
    series: [{
      name: "Hours", type: "bar", barMaxWidth: 32,
      itemStyle: {
        borderRadius: [6, 6, 0, 0],
        color: { type: "linear", x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: "#f59e0b" }, { offset: 1, color: "#fbbf24" }] },
      },
      data: avgResponseTime.map((d) => d.hours),
    }],
  };
  return <EChart option={option} height={220} />;
}


export function AnalyticsCharts() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader><div><CardTitle>Complaints Over Time</CardTitle><CardDescription>Total vs resolved — last 7 months</CardDescription></div></CardHeader>
        <CardContent><ComplaintsAreaChart /></CardContent>
      </Card>
      <Card>
        <CardHeader><div><CardTitle>By Category</CardTitle><CardDescription>Volume per category this period</CardDescription></div></CardHeader>
        <CardContent><CategoryBarChart /></CardContent>
      </Card>
      <Card>
        <CardHeader><div><CardTitle>Resolution Rate Trend</CardTitle><CardDescription>Monthly resolution percentage</CardDescription></div></CardHeader>
        <CardContent><ResolutionLineChart /></CardContent>
      </Card>
      <Card>
        <CardHeader><div><CardTitle>Avg Response Time</CardTitle><CardDescription>Hours to first response per month</CardDescription></div></CardHeader>
        <CardContent><ResponseTimeBarChart /></CardContent>
      </Card>
    </div>
  );
}
