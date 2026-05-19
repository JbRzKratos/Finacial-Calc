"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useBudget } from "@/hooks/useBudget";
import { BudgetGauge } from "@/components/budget/BudgetGauge";
import { BudgetCard } from "@/components/budget/BudgetCard";
import { BudgetBottomNav } from "@/components/budget/BudgetBottomNav";
import { MonthSelector } from "@/components/budget/MonthSelector";
import { AddTransactionSheet } from "@/components/budget/AddTransactionSheet";
import { AddBudgetSheet } from "@/components/budget/AddBudgetSheet";
import { Plus } from "lucide-react";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function BudgetDashboard() {
  const router = useRouter();
  const { loaded, month, year, categories, transactions, summary, addTransaction, addCategory, deleteCategory, changeMonth } = useBudget();

  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [showBudgetSheet, setShowBudgetSheet] = useState(false);

  const handleFab = useCallback(() => {
    setShowAddSheet(true);
  }, []);

  const handleAddTxn = useCallback(
    (data: { amount: number; categoryId: string; note: string; date: string; type: "expense" | "income" }) => {
      addTransaction(data);
    },
    [addTransaction]
  );

  const handleAddCategory = useCallback(
    (data: { name: string; icon: string; iconBg: string; monthlyLimit: number; color: string }) => {
      addCategory(data);
    },
    [addCategory]
  );

  const handleDeleteCategory = useCallback(
    (catId: string) => {
      if (window.confirm("Delete this category and all its transactions?")) {
        deleteCategory(catId);
      }
    },
    [deleteCategory]
  );

  if (!loaded) return null;

  return (
    <div className="min-h-dvh bg-[#1A1A1A] text-white pb-[calc(64px+env(safe-area-inset-bottom))]">
      {/* Top Bar */}
      <div className="px-5 pt-5 pb-2 flex items-center justify-between">
        <h1 className="text-[28px] font-extrabold tracking-[-0.02em] text-white">Budgets</h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowMonthPicker(true)}
            className="text-sm text-[#888888] font-medium hover:text-white transition-colors"
          >
            {MONTHS[month]} {year}
          </button>
          <button
            type="button"
            onClick={() => setShowBudgetSheet(true)}
            className="bg-[#2E2E2E] hover:bg-[#3E3E3E] text-white text-sm font-semibold px-4 py-2 rounded-xl border border-[#3E3E3E] transition-all active:scale-[0.96] flex items-center gap-1.5"
          >
            <Plus size={16} />
            new
          </button>
        </div>
      </div>

      {/* Gauge */}
      <div className="mt-3 mb-6">
        <BudgetGauge
          percentSpent={summary.percentSpent}
          totalSpent={summary.totalSpent}
          totalRemaining={summary.totalRemaining}
          totalLimit={summary.totalLimit}
        />
      </div>

      {/* Category Cards */}
      <div className="px-5">
        {summary.categoryBreakdown.map((bd, i) => (
          <BudgetCard
            key={bd.category.id}
            breakdown={bd}
            daysLeft={summary.daysLeftInMonth}
            onClick={() => router.push(`/budget/transactions?category=${bd.category.id}`)}
            onDelete={() => handleDeleteCategory(bd.category.id)}
            index={i}
          />
        ))}
      </div>

      {/* Month picker */}
      {showMonthPicker && (
        <MonthSelector month={month} year={year} onChange={changeMonth} onClose={() => setShowMonthPicker(false)} />
      )}

      {/* Add transaction sheet */}
      <AddTransactionSheet
        categories={categories}
        open={showAddSheet}
        onClose={() => setShowAddSheet(false)}
        onSave={handleAddTxn}
      />

      {/* Add budget sheet */}
      <AddBudgetSheet
        open={showBudgetSheet}
        onClose={() => setShowBudgetSheet(false)}
        onSave={handleAddCategory}
      />

      {/* Bottom nav */}
      <BudgetBottomNav onFabClick={handleFab} />
    </div>
  );
}
