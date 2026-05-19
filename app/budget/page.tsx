"use client";

import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useBudget } from "@/hooks/useBudget";
import { BudgetGauge } from "@/components/budget/BudgetGauge";
import { BudgetCard } from "@/components/budget/BudgetCard";
import { BudgetBottomNav } from "@/components/budget/BudgetBottomNav";
import { MonthSelector } from "@/components/budget/MonthSelector";
import { AddTransactionSheet } from "@/components/budget/AddTransactionSheet";
import { AddBudgetSheet } from "@/components/budget/AddBudgetSheet";
import { formatINR } from "@/lib/budget/budgetCalc";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function BudgetDashboard() {
  const navigate = useNavigate();
  const { loaded, month, year, categories, summary, addTransaction, addCategory, deleteCategory, changeMonth } = useBudget();
  const [showMonth, setShowMonth] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showBudget, setShowBudget] = useState(false);

  const handleFab = useCallback(() => setShowAdd(true), []);
  const handleAddTxn = useCallback((d: Parameters<typeof addTransaction>[0]) => addTransaction(d), [addTransaction]);
  const handleAddCat = useCallback((d: Parameters<typeof addCategory>[0]) => addCategory(d), [addCategory]);
  const handleDelete = useCallback((id: string) => { if (confirm("Delete this category and all its transactions?")) deleteCategory(id); }, [deleteCategory]);

  const spentPct = summary.percentSpent;
  const spentColor = spentPct >= 100 ? "#EF4444" : spentPct >= 75 ? "#FF6B00" : "#22C55E";

  if (!loaded) return null;

  return (
    <div className="min-h-dvh bg-[#0A0A0C] bg-noise page-scroll-container">
      <div className="glass-header sticky top-0 px-5 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => navigate("/")} className="touch-target w-9 h-9 rounded-xl bg-[#141416] border border-[rgba(255,255,255,0.06)] hover:bg-[#1C1C1F] transition-all" aria-label="Home">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/70">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <h1 className="text-[20px] font-bold text-[#F5F5F5] tracking-[-0.02em]">Budgets</h1>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setShowMonth(true)} className="flex items-center gap-1.5 text-sm text-[#8A8A90] font-medium hover:text-white transition-colors px-3 py-1.5 rounded-lg bg-[#141416] border border-[rgba(255,255,255,0.06)]">
              <span className="hidden sm:inline text-xs">{MONTHS[month]} {year}</span>
              <span className="sm:hidden text-xs">{MONTHS[month].slice(0,3)}'{String(year).slice(2)}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 9l6 6 6-6"/></svg>
            </button>
            <button type="button" onClick={() => setShowBudget(true)} className="text-xs font-semibold uppercase text-[#FF6B00] bg-[rgba(255,107,0,0.08)] border border-[rgba(255,107,0,0.3)] px-4 py-2 rounded-xl hover:bg-[rgba(255,107,0,0.15)] active:scale-[0.96] transition-all">
              + New
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-3 text-xs text-[#8A8A90] flex-wrap">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full" style={{ background: spentColor }} />
            {formatINR(summary.totalSpent)} spent
          </span>
          <span>{formatINR(summary.totalLimit)} budget</span>
          <span>{summary.daysLeftInMonth}d left</span>
        </div>
      </div>

      <div className="page-container pt-4">
        <BudgetGauge percentSpent={summary.percentSpent} totalSpent={summary.totalSpent} totalRemaining={summary.totalRemaining} totalLimit={summary.totalLimit} />

        <p className="text-xs font-semibold text-[#8A8A90] uppercase tracking-wider mt-6 mb-3">Categories</p>

        {summary.categoryBreakdown.map((bd, i) => (
          <BudgetCard key={bd.category.id} breakdown={bd} daysLeft={summary.daysLeftInMonth} onClick={() => navigate(`/budget/transactions?category=${bd.category.id}`)} onDelete={() => handleDelete(bd.category.id)} index={i} />
        ))}
      </div>

      {showMonth && <MonthSelector month={month} year={year} onChange={changeMonth} onClose={() => setShowMonth(false)} />}
      <AddTransactionSheet categories={categories} open={showAdd} onClose={() => setShowAdd(false)} onSave={handleAddTxn} />
      <AddBudgetSheet open={showBudget} onClose={() => setShowBudget(false)} onSave={handleAddCat} />
      <BudgetBottomNav onFabClick={handleFab} />
    </div>
  );
}
