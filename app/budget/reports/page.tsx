"use client";

import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useBudget } from "@/hooks/useBudget";
import { AddTransactionSheet } from "@/components/budget/AddTransactionSheet";
import { SpendingChart } from "@/components/budget/SpendingChart";
import { BudgetEmptyState } from "@/components/budget/BudgetEmptyState";
import { CategoryIcon } from "@/components/budget/CategoryIcon";
import { PageLayout } from "@/components/layout/PageLayout";
import { formatINR, formatINRShort, formatDateRange } from "@/lib/budget/budgetCalc";
import { DateRangePicker } from "@/components/budget/DateRangePicker";

export default function ReportsPage() {
  const navigate = useNavigate();
  const { dateRange, categories, transactions, summary, addTransaction, changeDateRange } = useBudget();
  const [showAdd, setShowAdd] = useState(false);
  const [showRange, setShowRange] = useState(false);

  const handleAddTxn = useCallback((d: Parameters<typeof addTransaction>[0]) => addTransaction(d), [addTransaction]);

  const daysInRange = useMemo(() => {
    const s = new Date(dateRange.startDate + "T00:00:00");
    const e = new Date(dateRange.endDate + "T00:00:00");
    return Math.ceil((e.getTime() - s.getTime()) / 86400000) + 1;
  }, [dateRange]);

  const topDays = useMemo(() => {
    const byDay = new Map<string, number>();
    transactions.filter((t) => t.type === "expense").forEach((t) => byDay.set(t.date, (byDay.get(t.date) || 0) + t.amount));
    return Array.from(byDay.entries()).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([date, amount]) => {
      const cat = categories.find((c) => c.id === transactions.find((t) => t.date === date && t.type === "expense")?.categoryId);
      return { date, amount, icon: cat?.icon || "credit-card" };
    });
  }, [transactions, categories]);

  const sortedCats = useMemo(() => summary.categoryBreakdown.sort((a, b) => b.spent - a.spent), [summary.categoryBreakdown]);

  return (
    <PageLayout>
      <div className="page-scroll-container">
        <div className="app-header">
          <div className="app-header-left" />
          <span className="app-header-title">Analytics</span>
          <div className="app-header-right">
            <button type="button" onClick={() => setShowRange(true)} className="app-header-month">
              <span className="hidden sm:inline">{formatDateRange(dateRange)}</span>
              <span className="sm:hidden">{formatDateRange(dateRange)}</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M6 9l6 6 6-6"/></svg>
            </button>
          </div>
        </div>

      <div className="page-container pt-4 space-y-6">
        <div>
          <p className="text-xs font-semibold text-[#8A8A90] uppercase tracking-wider mb-3">Daily Spending</p>
          <SpendingChart transactions={transactions} daysInRange={daysInRange} dateRange={dateRange} />
        </div>

        <div>
          <p className="text-xs font-semibold text-[#8A8A90] uppercase tracking-wider mb-3">Category Breakdown</p>
          {sortedCats.length === 0 ? (
            <BudgetEmptyState title="No data" subtitle="Add transactions to see breakdown" />
          ) : (
            <div className="space-y-2.5">
              {sortedCats.map((bd) => (
                <div key={bd.category.id} className="rounded-2xl bg-[#141416] border border-[rgba(255,255,255,0.06)] p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <CategoryIcon icon={bd.category.icon} size={32} />
                      <span className="text-sm font-medium text-[#F5F5F5]">{bd.category.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-[#F5F5F5] font-mono">{formatINRShort(bd.spent)}</p>
                      <p className="text-[10px] text-[#8A8A90]">{Math.round(bd.percentSpent)}% of budget</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-xs font-semibold text-[#8A8A90] uppercase tracking-wider mb-3">Top Spending Days</p>
          {topDays.length === 0 ? (
            <p className="text-sm text-[#55555C]">No data</p>
          ) : (
            <div className="space-y-2">
              {topDays.map((day, i) => (
                <div key={day.date} className="rounded-2xl bg-[#141416] border border-[rgba(255,255,255,0.06)] p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`flex items-center justify-center w-7 h-7 rounded-full text-[10px] font-bold ${i === 0 ? "bg-white/15 text-[#F5F5F5]" : i === 1 ? "bg-white/10 text-white/60" : "bg-white/[0.06] text-white/40"}`}>
                      #{i + 1}
                    </span>
                    <div className="flex items-center gap-2">
                      <CategoryIcon icon={day.icon} size={24} />
                      <div>
                        <p className="text-sm font-medium text-[#F5F5F5]">{new Date(day.date + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                        <p className="text-xs text-[#8A8A90]">#{i + 1} highest</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-base font-bold text-[#F5F5F5] font-mono">{formatINRShort(day.amount)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pb-4">
          <p className="text-xs font-semibold text-[#8A8A90] uppercase tracking-wider mb-3">Period Summary</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-[#141416] border border-[rgba(255,255,255,0.06)] p-4">
              <p className="text-[10px] text-[#8A8A90] uppercase tracking-wider mb-1">Total Spent</p>
              <p className="text-xl font-extrabold font-mono text-[#F5F5F5]">{formatINR(summary.totalSpent)}</p>
            </div>
            <div className="rounded-2xl bg-[#141416] border border-[rgba(255,255,255,0.06)] p-4">
              <p className="text-[10px] text-[#8A8A90] uppercase tracking-wider mb-1">Budget</p>
              <p className="text-xl font-extrabold font-mono text-[#F5F5F5]">{formatINR(summary.totalLimit)}</p>
            </div>
            <div className="rounded-2xl bg-[#141416] border border-[rgba(255,255,255,0.06)] p-4">
              <p className="text-[10px] text-[#8A8A90] uppercase tracking-wider mb-1">Remaining</p>
              <p className={`text-xl font-extrabold font-mono ${summary.totalRemaining > 0 ? "text-[#22C55E]" : "text-[#EF4444]"}`}>{formatINR(summary.totalRemaining)}</p>
            </div>
            <div className="rounded-2xl bg-[#141416] border border-[rgba(255,255,255,0.06)] p-4">
              <p className="text-[10px] text-[#8A8A90] uppercase tracking-wider mb-1">Days Left</p>
              <p className="text-xl font-extrabold font-mono text-[#F5F5F5]">{summary.daysLeft}d</p>
            </div>
          </div>
        </div>
      </div>
      </div>

      <AddTransactionSheet categories={categories} open={showAdd} onClose={() => setShowAdd(false)} onSave={handleAddTxn} />
      {showRange && <DateRangePicker range={dateRange} onChange={changeDateRange} onClose={() => setShowRange(false)} />}
    </PageLayout>
  );
}
