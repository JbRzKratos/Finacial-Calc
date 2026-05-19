"use client";

import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useBudget } from "@/hooks/useBudget";
import { AddTransactionSheet } from "@/components/budget/AddTransactionSheet";
import { SpendingChart } from "@/components/budget/SpendingChart";
import { BudgetEmptyState } from "@/components/budget/BudgetEmptyState";
import { CategoryIcon } from "@/components/budget/CategoryIcon";
import { PageLayout } from "@/components/layout/PageLayout";
import { formatINR, formatINRShort } from "@/lib/budget/budgetCalc";
import { MonthSelector } from "@/components/budget/MonthSelector";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function ReportsPage() {
  const navigate = useNavigate();
  const { month, year, categories, transactions, summary, addTransaction, changeMonth } = useBudget();
  const [showAdd, setShowAdd] = useState(false);
  const [showMonth, setShowMonth] = useState(false);

  const handleAddTxn = useCallback((d: Parameters<typeof addTransaction>[0]) => addTransaction(d), [addTransaction]);

  const daysInMonth = new Date(year, month + 1, 0).getDate();

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
        <div className="glass-header sticky top-0 px-5 pt-4 pb-3 flex items-center gap-2">
        <h1 className="flex-1 text-[20px] font-bold text-[#F5F5F5] tracking-[-0.02em]">Analytics</h1>
        <button type="button" onClick={() => setShowMonth(true)} className="flex items-center gap-1 text-sm text-[#8A8A90] font-medium hover:text-white transition-colors px-3 py-1.5 rounded-lg bg-[#141416] border border-[rgba(255,255,255,0.06)]">
          <span className="hidden sm:inline text-xs">{MONTHS[month]} {year}</span>
          <span className="sm:hidden text-xs">{MONTHS[month].slice(0,3)}'{String(year).slice(2)}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 9l6 6 6-6"/></svg>
        </button>
      </div>

      <div className="page-container pt-4 space-y-6">
        <div>
          <p className="text-xs font-semibold text-[#8A8A90] uppercase tracking-wider mb-3">Daily Spending</p>
          <SpendingChart transactions={transactions} daysInMonth={daysInMonth} />
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
                  <div className="h-2 rounded-full bg-[#1C1C1F] overflow-hidden">
                    <div className="h-full rounded-full animate-progress" style={{ width: `${Math.min(100, bd.percentSpent)}%`, background: "rgba(255,255,255,0.15)", "--pct": `${Math.min(100, bd.percentSpent)}%` } as React.CSSProperties} />
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
          <p className="text-xs font-semibold text-[#8A8A90] uppercase tracking-wider mb-3">Monthly Summary</p>
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
              <p className="text-xl font-extrabold font-mono text-[#F5F5F5]">{summary.daysLeftInMonth}d</p>
            </div>
          </div>
        </div>
      </div>
      </div>

      <AddTransactionSheet categories={categories} open={showAdd} onClose={() => setShowAdd(false)} onSave={handleAddTxn} />
      {showMonth && <MonthSelector month={month} year={year} onChange={changeMonth} onClose={() => setShowMonth(false)} />}
    </PageLayout>
  );
}
