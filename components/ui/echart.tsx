"use client";

import ReactECharts from "echarts-for-react";
import type { EChartsOption } from "echarts";

interface EChartProps {
  option: EChartsOption;
  height?: number;
  className?: string;
}

export function EChart({ option, height = 300, className }: EChartProps) {
  return (
    <ReactECharts
      option={option}
      style={{ height, width: "100%" }}
      className={className}
      opts={{ renderer: "svg" }}
      notMerge
    />
  );
}
