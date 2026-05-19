"use client";

import { useRef, useEffect, useMemo } from "react";
import {
  Chart as ChartJS,
  ArcElement, Tooltip as ChartTooltip, Legend,
  CategoryScale, LinearScale,
  PointElement, LineElement, LineController,
  BarElement, BarController,
  Filler, DoughnutController,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { ChartConfig } from "@/features/finance-calc/types/calculator";

ChartJS.register(
  ArcElement, ChartTooltip, Legend,
  CategoryScale, LinearScale,
  PointElement, LineElement, LineController,
  BarElement, BarController,
  Filler, DoughnutController,
);

ChartJS.defaults.font.family = "'Inter', system-ui, sans-serif";

interface ResultChartProps {
  config: ChartConfig;
  height?: number;
}

export function ResultChart({ config, height = 220 }: ResultChartProps) {
  const chartRef = useRef<ChartJS | null>(null);
  const isMobile = typeof navigator !== "undefined" && navigator.maxTouchPoints > 0;

  useEffect(() => {
    ChartJS.defaults.color = "#666666";
  }, []);

  const mergedOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: { boxWidth: 10, font: { size: 11, weight: 500 }, padding: 16, pointStyle: "circle" as const, color: "#666666" }
      },
      tooltip: {
        backgroundColor: "#1A1A1A",
        titleFont: { size: 12, weight: 600 },
        bodyFont: { size: 11 },
        cornerRadius: 4,
        padding: 10,
      }
    },
    scales: {
      y: {
        ticks: { font: { size: 11, weight: 500 }, maxTicksLimit: 6, color: "#666666" },
        grid: { color: "rgba(0,0,0,0.06)", borderDash: [4, 4] as [number, number] },
        border: { display: false },
      },
      x: {
        ticks: { font: { size: 11, weight: 500 }, color: "#666666" },
        grid: { display: false },
        border: { display: false },
      }
    },
    animation: {
      duration: isMobile ? 400 : 800,
      easing: "easeOutQuart" as const,
    },
    datasets: {
      line: {
        pointRadius: 0,
        pointHoverRadius: 4,
        borderWidth: 2.5,
      },
    },
    ...config.options,
  }), [config.options, isMobile]);

  useEffect(() => {
    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, []);

  return (
    <div className="w-full animate-chart" style={{ height: "clamp(160px, 42vw, " + height + "px)" }}>
      <Chart
        ref={chartRef}
        type={config.type}
        data={config.data}
        options={mergedOptions}
      />
    </div>
  );
}
