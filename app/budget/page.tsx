"use client";

import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useBudget } from "@/hooks/useBudget";
import type { BudgetCategory } from "@/lib/budget/budgetTypes";
import { formatDateRange } from "@/lib/budget/budgetCalc";
import { BudgetGauge } from "@/components/budget/BudgetGauge";
import { BudgetCard } from "@/components/budget/BudgetCard";
import { DateRangePicker } from "@/components/budget/DateRangePicker";
import { AddTransactionSheet } from "@/components/budget/AddTransactionSheet";
import { AddBudgetSheet } from "@/components/budget/AddBudgetSheet";
import { BudgetScaleSheet } from "@/components/budget/BudgetScaleSheet";
import { EditBudgetLimitSheet } from "@/components/budget/EditBudgetLimitSheet";
import { PageLayout } from "@/components/layout/PageLayout";

export default function BudgetDashboard() {
  const navigate = useNavigate();
  const { loaded, dateRange, categories, summary, totalBudgetOverride, addTransaction, addCategory, deleteCategory, changeDateRange, updateTotalBudget, updateCategoryLimit } = useBudget();
  const [showRange, setShowRange] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showBudget, setShowBudget] = useState(false);
  const [showScale, setShowScale] = useState(false);
  const [editCategory, setEditCategory] = useState<BudgetCategory | null>(null);

  const handleAddTxn = useCallback((d: Parameters<typeof addTransaction>[0]) => addTransaction(d), [addTransaction]);
  const handleAddCat = useCallback((d: Parameters<typeof addCategory>[0]) => addCategory(d), [addCategory]);
  const handleDelete = useCallback((id: string) => { if (confirm("Delete this category and all its transactions?")) deleteCategory(id); }, [deleteCategory]);

  if (!loaded) return null;

  return (
    <PageLayout>
      <div className="page-scroll-container">
        {/* Clean header */}
        <div className="app-header">
          <div className="app-header-left">
            <button type="button" onClick={() => navigate("/")} className="app-header-btn" aria-label="Home">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          </div>
          <span className="app-header-title">Budgets</span>
          <div className="app-header-right">
            <button type="button" onClick={() => setShowBudget(true)} className="app-header-action-primary" aria-label="Add category">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
          </div>
        </div>

        <div className="page-container pt-4">
          {/* Date range pill */}
          <div className="flex justify-center mb-4">
            <button
              type="button"
              onClick={() => setShowRange(true)}
              className="flex items-center gap-2 bg-[#1C1C1F] border border-[rgba(255,255,255,0.06)] rounded-full px-4 py-2 text-sm font-medium text-[#8A8A90] hover:bg-[#222226] hover:text-[#F5F5F5] transition-all active:scale-[0.97]"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <span>{formatDateRange(dateRange)}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M6 9l6 6 6-6"/></svg>
            </button>
          </div>

          <BudgetGauge percentSpent={summary.percentSpent} totalSpent={summary.totalSpent} totalRemaining={summary.totalRemaining} totalLimit={summary.totalLimit} onBudgetClick={() => setShowScale(true)} />

          <div className="flex items-center justify-between mt-6 mb-3">
            <p className="text-xs font-semibold text-[#8A8A90] uppercase tracking-wider">Categories</p>
            <span className="text-[10px] text-[#55555C] font-mono">{summary.categoryBreakdown.length} active</span>
          </div>

          {summary.categoryBreakdown.map((bd, i) => (
            <BudgetCard key={bd.category.id} breakdown={bd} daysLeft={summary.daysLeft} onClick={() => navigate(`/budget/transactions?category=${bd.category.id}`)} onDelete={() => handleDelete(bd.category.id)} onEditLimit={() => setEditCategory(bd.category)} index={i} />
          ))}
        </div>
      </div>

      {showRange && <DateRangePicker range={dateRange} onChange={changeDateRange} onClose={() => setShowRange(false)} />}
      <AddTransactionSheet categories={categories} open={showAdd} onClose={() => setShowAdd(false)} onSave={handleAddTxn} />
      <AddBudgetSheet open={showBudget} onClose={() => setShowBudget(false)} onSave={handleAddCat} />
      <BudgetScaleSheet open={showScale} onClose={() => setShowScale(false)} currentTotal={totalBudgetOverride ?? summary.totalLimit} categories={categories} onApply={updateTotalBudget} />
      {editCategory && <EditBudgetLimitSheet open={!!editCategory} onClose={() => setEditCategory(null)} category={editCategory} onSave={(v) => updateCategoryLimit(editCategory.id, v)} />}
    </PageLayout>
  );
}
