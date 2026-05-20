"use client";

import { useEffect, useRef } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler } from "chart.js";
import { Doughnut, Bar, Line } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler);

interface ChartConfig {
  type: "doughnut" | "bar" | "line";
  data: Record<string, unknown>;
  options?: Record<string, unknown>;
}

interface ResultChartProps {
  config: ChartConfig | null;
  height?: number;
}

export function ResultChart({ config, height = 240 }: ResultChartProps) {
  if (!config) return null;

  const chartProps = {
    data: config.data as Record<string, unknown>,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      ...(config.options as Record<string, unknown> || {}),
    },
  };

  return (
    <div className="animate-chart" style={{ height }}>
      {config.type === "doughnut" && <Doughnut data={chartProps.data as never} options={chartProps.options as never} />}
      {config.type === "bar" && <Bar data={chartProps.data as never} options={chartProps.options as never} />}
      {config.type === "line" && <Line data={chartProps.data as never} options={chartProps.options as never} />}
    </div>
  );
}
