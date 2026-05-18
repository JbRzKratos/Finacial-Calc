"use client";

import { useEffect, useRef } from "react";
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler } from "chart.js";
import { Chart } from "react-chartjs-2";
import { ChartConfig } from "@/types/calculator";

ChartJS.register(ArcElement, ChartTooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler);

interface CalcChartProps {
  config: ChartConfig;
  height?: number;
}

const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom" as const,
      labels: { boxWidth: 12, font: { size: 11 } }
    }
  },
  scales: {
    y: {
      ticks: { font: { size: 10 } }
    },
    x: {
      ticks: { font: { size: 10 } }
    }
  }
};

export function CalcChart({ config, height = 220 }: CalcChartProps) {
  return (
    <div style={{ height: `clamp(180px, 45vw, ${height}px)` }} className="w-full">
      <Chart type={config.type} data={config.data} options={{ ...defaultOptions, ...config.options }} />
    </div>
  );
}
