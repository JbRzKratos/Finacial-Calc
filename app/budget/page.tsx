"use client";

import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useBudget } from "@/hooks/useBudget";
import { BudgetGauge } from "@/components/budget/BudgetGauge";
import { BudgetCard } from "@/components/budget/BudgetCard";
import { MonthSelector } from "@/components/budget/MonthSelector";
import { AddTransactionSheet } from "@/components/budget/AddTransactionSheet";
import { AddBudgetSheet } from "@/components/budget/AddBudgetSheet";
import { PageLayout } from "@/components/layout/PageLayout";
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
    <PageLayout>
      <div className="page-scroll-container">
        <div className="app-header">
          <div className="app-header-left">
            <button type="button" onClick={() => navigate("/")} className="app-header-btn" aria-label="Home">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              <span>Home</span>
            </button>
          </div>
          <span className="app-header-title">Budgets</span>
          <div className="app-header-right">
            <button type="button" onClick={() => setShowMonth(true)} className="app-header-month">
              <span className="hidden sm:inline">{MONTHS[month]} {year}</span>
              <span className="sm:hidden">{MONTHS[month].slice(0,3)}"{String(year).slice(2)}</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M6 9l6 6 6-6"/></svg>
            </button>
            <button type="button" onClick={() => setShowBudget(true)} className="app-header-action">
              + New
            </button>
          </div>
        </div>

        <div className="page-container pt-4">
          <BudgetGauge percentSpent={summary.percentSpent} totalSpent={summary.totalSpent} totalRemaining={summary.totalRemaining} totalLimit={summary.totalLimit} />

          <p className="text-xs font-semibold text-[#8A8A90] uppercase tracking-wider mt-6 mb-3">Categories</p>

          {summary.categoryBreakdown.map((bd, i) => (
            <BudgetCard key={bd.category.id} breakdown={bd} daysLeft={summary.daysLeftInMonth} onClick={() => navigate(`/budget/transactions?category=${bd.category.id}`)} onDelete={() => handleDelete(bd.category.id)} index={i} />
          ))}
        </div>
      </div>

      {showMonth && <MonthSelector month={month} year={year} onChange={changeMonth} onClose={() => setShowMonth(false)} />}
      <AddTransactionSheet categories={categories} open={showAdd} onClose={() => setShowAdd(false)} onSave={handleAddTxn} />
      <AddBudgetSheet open={showBudget} onClose={() => setShowBudget(false)} onSave={handleAddCat} />
    </PageLayout>
  );
}
