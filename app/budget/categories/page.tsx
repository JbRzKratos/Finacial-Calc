"use client";

import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useBudget } from "@/hooks/useBudget";
import { BudgetBottomNav } from "@/components/budget/BudgetBottomNav";
import { AddTransactionSheet } from "@/components/budget/AddTransactionSheet";
import { AddBudgetSheet } from "@/components/budget/AddBudgetSheet";
import { BudgetEmptyState } from "@/components/budget/BudgetEmptyState";
import { CategoryIcon } from "@/components/budget/CategoryIcon";
import { formatINR } from "@/lib/budget/budgetCalc";
import { ArrowLeft } from "lucide-react";

export default function CategoriesPage() {
  const navigate = useNavigate();
  const { categories, transactions, addCategory, addTransaction, deleteCategory } = useBudget();
  const [showAdd, setShowAdd] = useState(false);
  const [showTxn, setShowTxn] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = categories.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));
  const handleAddCat = useCallback((d: Parameters<typeof addCategory>[0]) => addCategory(d), [addCategory]);
  const handleAddTxn = useCallback((d: Parameters<typeof addTransaction>[0]) => addTransaction(d), [addTransaction]);
  const getSpent = (id: string) => transactions.filter((t) => t.categoryId === id && t.type === "expense").reduce((s, t) => s + t.amount, 0);

  return (
    <div className="min-h-dvh bg-[#0A0A0C] bg-noise page-scroll-container">
      <div className="glass-header sticky top-0 px-5 pt-4 pb-3 flex items-center gap-2">
        <button type="button" onClick={() => navigate("/")} className="touch-target w-9 h-9 rounded-xl bg-[#141416] border border-[rgba(255,255,255,0.06)] hover:bg-[#1C1C1F] transition-all" aria-label="Home">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/70">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <button type="button" onClick={() => navigate("/budget")} className="touch-target w-9 h-9 rounded-xl bg-[#141416] border border-[rgba(255,255,255,0.06)] hover:bg-[#1C1C1F] transition-all" aria-label="Back">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/70">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <h1 className="text-[20px] font-bold text-[#F5F5F5] tracking-[-0.02em]">Categories</h1>
      </div>

      <div className="page-container pt-4">
        <div className="relative mb-4">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#55555C" strokeWidth="2" strokeLinecap="round" className="absolute left-3.5 top-1/2 -translate-y-1/2">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search categories..." className="w-full bg-[#141416] border border-[rgba(255,255,255,0.06)] rounded-xl py-3 pl-10 pr-4 text-white text-sm outline-none focus:border-[#FF6B00]/50 transition-all placeholder:text-[#55555C]" />
        </div>

        {filtered.length === 0 && search ? (
          <BudgetEmptyState title="No matches" subtitle="Try a different search term" onAction={() => setSearch("")} actionLabel="Clear Search" />
        ) : filtered.length === 0 ? (
          <BudgetEmptyState title="No categories yet" subtitle="Add a budget category to start tracking" onAction={() => setShowAdd(true)} actionLabel="Add Category" />
        ) : (
          <div className="space-y-2.5">
            {filtered.map((cat) => {
              const spent = getSpent(cat.id);
              const pct = cat.monthlyLimit > 0 ? (spent / cat.monthlyLimit) * 100 : 0;
              return (
                <div key={cat.id} className="glass-card p-4 cursor-pointer active:scale-[0.99] transition-transform" onClick={() => navigate(`/budget/transactions?category=${cat.id}`)}>
                  <div className="flex items-center gap-3.5">
                    <CategoryIcon icon={cat.icon} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[15px] font-semibold text-[#F5F5F5]">{cat.name}</p>
                      <p className="text-xs text-[#8A8A90] mt-0.5">{formatINR(spent)} / {formatINR(cat.monthlyLimit)}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-[#F5F5F5] font-mono">{Math.round(pct)}%</p>
                      <p className="text-[10px] text-[#8A8A90]">used</p>
                    </div>
                  </div>
                  <div className="h-1 rounded-full bg-[#1C1C1F] mt-3 overflow-hidden">
                    <div className="h-full rounded-full animate-progress" style={{ width: `${Math.min(100, pct)}%`, background: "rgba(255,255,255,0.15)", "--pct": `${Math.min(100, pct)}%` } as React.CSSProperties} />
                  </div>
                </div>
              );
            })}
            <button type="button" onClick={() => setShowAdd(true)} className="w-full rounded-2xl border-2 border-dashed border-[rgba(255,255,255,0.06)] py-4 text-[#55555C] font-semibold text-sm hover:border-[#FF6B00]/50 hover:text-[#FF6B00] transition-all">
              + Add New Category
            </button>
          </div>
        )}
      </div>

      <AddBudgetSheet open={showAdd} onClose={() => setShowAdd(false)} onSave={handleAddCat} />
      <AddTransactionSheet categories={categories} open={showTxn} onClose={() => setShowTxn(false)} onSave={handleAddTxn} />
      <BudgetBottomNav onFabClick={() => setShowTxn(true)} />
    </div>
  );
}
