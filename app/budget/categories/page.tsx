"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useBudget } from "@/hooks/useBudget";
import { BudgetBottomNav } from "@/components/budget/BudgetBottomNav";
import { AddTransactionSheet } from "@/components/budget/AddTransactionSheet";
import { AddBudgetSheet } from "@/components/budget/AddBudgetSheet";
import { BudgetEmptyState } from "@/components/budget/BudgetEmptyState";
import { formatINR } from "@/lib/budget/budgetCalc";
import { ArrowLeft, Search } from "lucide-react";

export default function CategoriesPage() {
  const router = useRouter();
  const { categories, transactions, summary, addCategory, addTransaction, deleteCategory } = useBudget();
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [showTxnSheet, setShowTxnSheet] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = categories.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  const handleAddCategory = useCallback(
    (data: { name: string; icon: string; iconBg: string; monthlyLimit: number; color: string }) => {
      addCategory(data);
    },
    [addCategory]
  );

  const handleAddTxn = useCallback(
    (data: { amount: number; categoryId: string; note: string; date: string; type: "expense" | "income" }) => {
      addTransaction(data);
    },
    [addTransaction]
  );

  const getSpent = (catId: string) => transactions.filter((t) => t.categoryId === catId && t.type === "expense").reduce((s, t) => s + t.amount, 0);

  return (
    <div className="min-h-dvh bg-[#1A1A1A] text-white pb-[calc(64px+env(safe-area-inset-bottom))]">
      {/* Top bar */}
      <div className="px-5 pt-5 pb-3 flex items-center gap-3">
        <button type="button" onClick={() => router.push("/budget")} className="w-9 h-9 rounded-xl bg-[#242424] flex items-center justify-center hover:bg-[#2E2E2E] transition-colors">
          <ArrowLeft size={18} className="text-white/70" />
        </button>
        <h1 className="text-xl font-bold text-white">Categories</h1>
      </div>

      {/* Search */}
      <div className="px-5 mb-4">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#666666]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories..."
            className="w-full bg-[#242424] border border-[#2E2E2E] rounded-xl py-3 pl-10 pr-4 text-white text-sm outline-none focus:border-[#FF6B00]/50 transition-all placeholder:text-[#555555]"
          />
        </div>
      </div>

      {filtered.length === 0 && search ? (
        <BudgetEmptyState title="No matches" subtitle="Try a different search term" onAction={() => setSearch("")} actionLabel="Clear Search" />
      ) : filtered.length === 0 ? (
        <BudgetEmptyState title="No categories yet" subtitle="Add a budget category to start tracking" onAction={() => setShowAddSheet(true)} actionLabel="Add Category" />
      ) : (
        <div className="px-5 space-y-2.5">
          {filtered.map((cat) => {
            const spent = getSpent(cat.id);
            const pct = cat.monthlyLimit > 0 ? (spent / cat.monthlyLimit) * 100 : 0;
            return (
              <div
                key={cat.id}
                className="rounded-2xl bg-[#242424] border border-[#2E2E2E] p-4 active:scale-[0.98] transition-transform cursor-pointer"
                onClick={() => router.push(`/budget/transactions?category=${cat.id}`)}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ background: cat.iconBg }}>
                    {cat.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-semibold text-white">{cat.name}</p>
                    <p className="text-xs text-[#888888]">
                      {formatINR(spent)} / {formatINR(cat.monthlyLimit)}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-white">{Math.round(pct)}%</p>
                    <p className="text-[11px] text-[#888888]">used</p>
                  </div>
                </div>
                <div className="h-[3px] bg-[#3E3E3E] mt-3 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(100, pct)}%`, background: cat.color }} />
                </div>
              </div>
            );
          })}
          <button
            type="button"
            onClick={() => setShowAddSheet(true)}
            className="w-full rounded-2xl border-2 border-dashed border-[#2E2E2E] py-4 text-[#888888] font-semibold text-sm hover:border-[#FF6B00]/50 hover:text-[#FF6B00] transition-all"
          >
            + Add New Category
          </button>
        </div>
      )}

      <AddBudgetSheet open={showAddSheet} onClose={() => setShowAddSheet(false)} onSave={handleAddCategory} />
      <AddTransactionSheet categories={categories} open={showTxnSheet} onClose={() => setShowTxnSheet(false)} onSave={handleAddTxn} />
      <BudgetBottomNav onFabClick={() => setShowTxnSheet(true)} />
    </div>
  );
}
