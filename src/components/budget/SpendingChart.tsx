"use client";

import { useMemo } from "react";
import type { Transaction } from "@/lib/budget/budgetTypes";

interface SpendingChartProps {
  transactions: Transaction[];
  daysInMonth: number;
}

export function SpendingChart({ transactions, daysInMonth }: SpendingChartProps) {
  const dayData = useMemo(() => {
    const days = Math.min(daysInMonth, 31);
    const result: { day: number; amount: number }[] = [];
    for (let d = 1; d <= days; d++) {
      const ds = String(d).padStart(2, "0");
      const today = new Date();
      const prefix = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${ds}`;
      const total = transactions.filter((t) => t.date === prefix && t.type === "expense").reduce((s, t) => s + t.amount, 0);
      result.push({ day: d, amount: total });
    }
    return result;
  }, [transactions, daysInMonth]);

  const maxAmount = Math.max(...dayData.map((d) => d.amount), 1);
  const today = new Date().getDate();

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
        {dayData[today - 1] && (
          <circle
            cx={pad + ((today - 1) / Math.max(dayData.length - 1, 1)) * chartW}
            cy={pad + chartH - (dayData[today - 1].amount / maxAmount) * chartH}
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
