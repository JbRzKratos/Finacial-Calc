"use client";

import { useMemo } from "react";
import type { Transaction, DateRange } from "@/lib/budget/budgetTypes";

interface SpendingChartProps {
  transactions: Transaction[];
  daysInRange: number;
  dateRange?: DateRange;
}

export function SpendingChart({ transactions, daysInRange, dateRange }: SpendingChartProps) {
  const dayData = useMemo(() => {
    const days = Math.min(daysInRange, 60);
    const startDate = dateRange ? new Date(dateRange.startDate + "T00:00:00") : new Date();
    const result: { day: number; amount: number }[] = [];
    for (let d = 0; d < days; d++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + d);
      const ds = date.toISOString().slice(0, 10);
      const total = transactions.filter((t) => t.date === ds && t.type === "expense").reduce((s, t) => s + t.amount, 0);
      result.push({ day: d + 1, amount: total });
    }
    return result;
  }, [transactions, daysInRange, dateRange]);

  const maxAmount = Math.max(...dayData.map((d) => d.amount), 1);
  const today = new Date().toISOString().slice(0, 10);
  const todayIndex = dateRange
    ? dayData.findIndex((_, i) => {
        const d = new Date(dateRange.startDate + "T00:00:00");
        d.setDate(d.getDate() + i);
        return d.toISOString().slice(0, 10) === today;
      })
    : -1;

  const w = 320, h = 120, pad = 0;
  const chartW = w - pad * 2;
  const chartH = h - pad * 2;

  const points = dayData.map((d, i) => {
    const x = pad + (i / Math.max(dayData.length - 1, 1)) * chartW;
    const y = pad + chartH - (d.amount / maxAmount) * chartH;
    return `${x},${y}`;
  });

  const areaPoints = [...points, `${pad + chartW},${pad + chartH}`, `${pad},${pad + chartH}`];

  return (
    <div className="rounded-2xl bg-[#141416] border border-[rgba(255,255,255,0.06)] p-4">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" preserveAspectRatio="none">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => (
          <line key={i} x1={pad} y1={pad + chartH * pct} x2={pad + chartW} y2={pad + chartH * pct} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        ))}
        {/* Area fill */}
        <polygon points={areaPoints.join(" ")} fill="rgba(255,107,0,0.08)" />
        {/* Line */}
        <polyline points={points.join(" ")} fill="none" stroke="#FF6B00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {/* Today dot */}
        {todayIndex >= 0 && todayIndex < dayData.length && (
          <circle
            cx={pad + (todayIndex / Math.max(dayData.length - 1, 1)) * chartW}
            cy={pad + chartH - (dayData[todayIndex].amount / maxAmount) * chartH}
            r="3"
            fill="#FF6B00"
            stroke="#0A0A0C"
            strokeWidth="2"
          />
        )}
      </svg>
    </div>
  );
}
