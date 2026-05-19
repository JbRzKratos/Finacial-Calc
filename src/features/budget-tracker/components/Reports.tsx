"use client";

import { useMemo } from "react";
import { useFinance } from "../contexts/FinanceContext";
import { formatCurrency } from "../utils/format";
import { DonutChart } from "./DonutChart";
import { allCategories } from "../utils/constants";
import { cn } from "@/lib/utils";

export function Reports() {
  const { transactions } = useFinance();
  const expenses = transactions.filter((t) => t.type === "expense");

  const grouped = useMemo(() => {
    const map = new Map<string, number>();
    expenses.forEach((t) => {
      map.set(t.category, (map.get(t.category) || 0) + t.amount);
    });
    return map;
  }, [expenses]);

  const cats = allCategories("expense");
  const total = expenses.reduce((s, t) => s + t.amount, 0);

  const chartData = useMemo(() => {
    return Array.from(grouped.entries())
      .map(([id, val]) => {
        const cat = cats.find((c) => c.id === id);
        return { label: cat?.label ?? id, value: val, color: cat?.color ?? "#78716c" };
      })
      .sort((a, b) => b.value - a.value);
  }, [grouped, cats]);

  if (transactions.length === 0) {
    return (
      <div className="px-5 pt-6 pb-24 flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-white/50 font-semibold">No data to report</p>
        <p className="text-white/30 text-sm mt-1">Add transactions to see insights</p>
      </div>
    );
  }

  return (
    <div className="px-5 pt-6 pb-6">
      <h1 className="text-lg font-bold text-white mb-5">Spending Reports</h1>

      {/* Donut Chart */}
      <div className="flex justify-center mb-8">
        <div className="w-[200px] h-[200px] max-w-full">
          <DonutChart data={chartData} size={200} strokeWidth={36} />
        </div>
      </div>

      <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-3">Spending Breakdown</p>

      <div className="space-y-2.5">
        {chartData.map((item) => {
          const pct = total > 0 ? (item.value / total) * 100 : 0;
          return (
            <div key={item.label} className="rounded-2xl bg-neutral-800/40 px-4 py-3 border border-white/[0.03]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm font-medium text-white/80">{item.label}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">{formatCurrency(item.value)}</p>
                  <p className="text-[10px] text-white/40">{pct.toFixed(1)}%</p>
                </div>
              </div>
              <div className="w-full h-1.5 rounded-full bg-neutral-700 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: item.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
