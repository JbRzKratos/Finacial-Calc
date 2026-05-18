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
import { ChartConfig } from "@/types/calculator";
import { useIsDark } from "@/hooks/useIsDark";

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

function replaceBlack(c: string | string[] | undefined): string | string[] | undefined {
  if (!c) return c;
  if (Array.isArray(c)) return c.map((v) => v === "#1A1A1A" ? "#FFFFFF" : v);
  return c === "#1A1A1A" ? "#FFFFFF" : c;
}

export function ResultChart({ config, height = 220 }: ResultChartProps) {
  const chartRef = useRef<ChartJS | null>(null);
  const isDark = useIsDark();
  const isMobile = typeof navigator !== "undefined" && navigator.maxTouchPoints > 0;

  useEffect(() => {
    ChartJS.defaults.color = isDark ? "#CCCCCC" : "#666666";
  }, [isDark]);

  const adjustedConfig = useMemo(() => {
    if (!config || !isDark) return config;
    return {
      ...config,
      data: {
        ...config.data,
        datasets: config.data.datasets.map((ds) => ({
          ...ds,
          backgroundColor: replaceBlack(ds.backgroundColor),
          borderColor: replaceBlack(ds.borderColor),
        })),
      },
    };
  }, [config, isDark]);

  const mergedOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: { boxWidth: 10, font: { size: 11, weight: 500 }, padding: 16, pointStyle: "circle" as const, color: isDark ? "#CCCCCC" : "#666666" }
      },
      tooltip: {
        backgroundColor: isDark ? "#2A2A2A" : "#1A1A1A",
        titleFont: { size: 12, weight: 600 },
        bodyFont: { size: 11 },
        cornerRadius: 4,
        padding: 10,
      }
    },
    scales: {
      y: {
        ticks: { font: { size: 11, weight: 500 }, maxTicksLimit: 6, color: isDark ? "#CCCCCC" : "#666666" },
        grid: { color: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)", borderDash: [4, 4] as [number, number] },
        border: { display: false },
      },
      x: {
        ticks: { font: { size: 11, weight: 500 }, color: isDark ? "#CCCCCC" : "#666666" },
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
  }), [config.options, isDark, isMobile]);

  useEffect(() => {
    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, []);

  return (
    <div className="w-full animate-chart" style={{ height: `clamp(160px, 42vw, ${height}px)` }}>
      <Chart
        ref={chartRef}
        type={config.type}
        data={(adjustedConfig || config).data}
        options={mergedOptions}
      />
    </div>
  );
}
