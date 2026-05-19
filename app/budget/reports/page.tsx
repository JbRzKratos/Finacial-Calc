"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useBudget } from "@/hooks/useBudget";
import { BudgetBottomNav } from "@/components/budget/BudgetBottomNav";
import { AddTransactionSheet } from "@/components/budget/AddTransactionSheet";
import { SpendingChart } from "@/components/budget/SpendingChart";
import { BudgetEmptyState } from "@/components/budget/BudgetEmptyState";
import { formatINR, formatINRShort } from "@/lib/budget/budgetCalc";
import { ArrowLeft, TrendingUp, TrendingDown } from "lucide-react";

export default function ReportsPage() {
  const router = useRouter();
  const { month, year, categories, transactions, summary, addTransaction } = useBudget();
  const [showAddSheet, setShowAddSheet] = useState(false);

  const handleAddTxn = useCallback(
    (data: { amount: number; categoryId: string; note: string; date: string; type: "expense" | "income" }) => {
      addTransaction(data);
    },
    [addTransaction]
  );

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const topDays = useMemo(() => {
    const byDay = new Map<string, number>();
    transactions.filter((t) => t.type === "expense").forEach((t) => {
      byDay.set(t.date, (byDay.get(t.date) || 0) + t.amount);
    });
    return Array.from(byDay.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([date, amount]) => {
        const dayTxns = transactions.filter((t) => t.date === date && t.type === "expense");
        const topCat = dayTxns.length > 0 ? categories.find((c) => c.id === dayTxns[0].categoryId) : null;
        return { date, amount, icon: topCat?.icon || "💳" };
      });
  }, [transactions, categories]);

  const categoryBreakdownSorted = useMemo(
    () => summary.categoryBreakdown.sort((a, b) => b.spent - a.spent),
    [summary.categoryBreakdown]
  );

  return (
    <div className="min-h-dvh bg-[#1A1A1A] text-white pb-[calc(64px+env(safe-area-inset-bottom))]">
      {/* Top bar */}
      <div className="px-5 pt-5 pb-3 flex items-center gap-3">
        <button type="button" onClick={() => router.push("/budget")} className="w-9 h-9 rounded-xl bg-[#242424] flex items-center justify-center hover:bg-[#2E2E2E] transition-colors">
          <ArrowLeft size={18} className="text-white/70" />
        </button>
        <h1 className="text-xl font-bold text-white">Analytics</h1>
      </div>

      <div className="px-5 space-y-6">
        {/* Spending trend chart */}
        <div>
          <p className="text-xs font-bold text-[#888888] uppercase tracking-wider mb-3">Daily Spending</p>
          <SpendingChart transactions={transactions} daysInMonth={daysInMonth} />
        </div>

        {/* Category breakdown */}
        <div>
          <p className="text-xs font-bold text-[#888888] uppercase tracking-wider mb-3">Category Breakdown</p>
          <div className="space-y-2.5">
            {categoryBreakdownSorted.map((bd) => (
              <div key={bd.category.id} className="rounded-2xl bg-[#242424] border border-[#2E2E2E] p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base" style={{ background: bd.category.iconBg }}>
                      {bd.category.icon}
                    </div>
                    <span className="text-sm font-medium text-white">{bd.category.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">{formatINRShort(bd.spent)}</p>
                    <p className="text-[10px] text-[#888888]">{Math.round(bd.percentSpent)}% of budget</p>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-[#3E3E3E] overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(100, bd.percentSpent)}%`, background: bd.category.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top spending days */}
        <div>
          <p className="text-xs font-bold text-[#888888] uppercase tracking-wider mb-3">Top Spending Days</p>
          {topDays.length === 0 ? (
            <p className="text-sm text-[#555555]">No data</p>
          ) : (
            <div className="space-y-2">
              {topDays.map((day, i) => (
                <div key={day.date} className="flex items-center justify-between rounded-2xl bg-[#242424] border border-[#2E2E2E] p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{day.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {new Date(day.date + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </p>
                      <p className="text-xs text-[#888888]">#{i + 1} highest</p>
                    </div>
                  </div>
                  <p className="text-base font-bold text-[#FF6B00]">{formatINRShort(day.amount)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary */}
        <div>
          <p className="text-xs font-bold text-[#888888] uppercase tracking-wider mb-3">Monthly Summary</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-[#242424] border border-[#2E2E2E] p-4">
              <p className="text-[10px] text-[#888888] uppercase tracking-wider mb-1">Total Spent</p>
              <p className="text-xl font-extrabold text-[#FF6B00]">{formatINR(summary.totalSpent)}</p>
            </div>
            <div className="rounded-2xl bg-[#242424] border border-[#2E2E2E] p-4">
              <p className="text-[10px] text-[#888888] uppercase tracking-wider mb-1">Budget Limit</p>
              <p className="text-xl font-extrabold text-white">{formatINR(summary.totalLimit)}</p>
            </div>
            <div className="rounded-2xl bg-[#242424] border border-[#2E2E2E] p-4">
              <p className="text-[10px] text-[#888888] uppercase tracking-wider mb-1">Remaining</p>
              <p className={`text-xl font-extrabold ${summary.totalRemaining > 0 ? "text-emerald-400" : "text-red-400"}`}>
                {formatINR(summary.totalRemaining)}
              </p>
            </div>
            <div className="rounded-2xl bg-[#242424] border border-[#2E2E2E] p-4">
              <p className="text-[10px] text-[#888888] uppercase tracking-wider mb-1">Days Left</p>
              <p className="text-xl font-extrabold text-white">{summary.daysLeftInMonth}d</p>
            </div>
          </div>
        </div>
      </div>

      <AddTransactionSheet
        categories={categories}
        open={showAddSheet}
        onClose={() => setShowAddSheet(false)}
        onSave={handleAddTxn}
      />
      <BudgetBottomNav onFabClick={() => setShowAddSheet(true)} />
    </div>
  );
}
