"use client";

import { useRef, useEffect } from "react";
import type { Transaction } from "@/lib/budget/budgetTypes";
import { Chart, BarController, LinearScale, CategoryScale, BarElement, Tooltip, type ChartConfiguration } from "chart.js";

Chart.register(BarController, LinearScale, CategoryScale, BarElement, Tooltip);

interface SpendingChartInnerProps {
  transactions: Transaction[];
  daysInMonth: number;
}

export default function SpendingChartInner({ transactions, daysInMonth }: SpendingChartInnerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (chartRef.current) chartRef.current.destroy();

    const days = Math.min(daysInMonth, 31);
    const labels: string[] = [];
    const data: number[] = [];

    for (let d = 1; d <= days; d++) {
      const dayStr = String(d).padStart(2, "0");
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      const datePrefix = `${currentYear}-${String(currentMonth).padStart(2, "0")}-${dayStr}`;
      const total = transactions
        .filter((t) => t.date === datePrefix && t.type === "expense")
        .reduce((s, t) => s + t.amount, 0);
      labels.push(String(d));
      data.push(total);
    }

    const maxVal = Math.max(...data, 1);
    const today = new Date().getDate();

    const config: ChartConfiguration = {
      type: "bar",
      data: {
        labels,
        datasets: [{
          label: "Spent",
          data,
          backgroundColor: data.map((_, i) => (i + 1 === today ? "#FF6B00" : "#2E2E2E")),
          borderRadius: 4,
          borderSkipped: false as const,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { tooltip: { enabled: true, backgroundColor: "#1A1A1A", titleColor: "#FFFFFF", bodyColor: "#888888", borderColor: "#2E2E2E", borderWidth: 1 } },
        scales: {
          x: { grid: { display: false }, ticks: { color: "#555555", font: { size: 10 }, maxRotation: 0 } },
          y: { grid: { color: "#2E2E2E" }, ticks: { color: "#555555", font: { size: 10 }, callback: (v) => (Number(v) >= 1000 ? `${(Number(v) / 1000).toFixed(0)}K` : String(v)) }, beginAtZero: true, max: maxVal * 1.2 },
        },
      },
    };

    chartRef.current = new Chart(canvasRef.current, config);
    return () => { chartRef.current?.destroy(); };
  }, [transactions, daysInMonth]);

  return (
    <div className="rounded-2xl bg-[#242424] border border-[#2E2E2E] p-4" style={{ height: 200 }}>
      <canvas ref={canvasRef} />
    </div>
  );
}
