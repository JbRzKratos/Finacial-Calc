"use client";

import { Suspense, useState, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useBudget } from "@/hooks/useBudget";
import { BudgetBottomNav } from "@/components/budget/BudgetBottomNav";
import { AddTransactionSheet } from "@/components/budget/AddTransactionSheet";
import { BudgetEmptyState } from "@/components/budget/BudgetEmptyState";
import { formatINRShort } from "@/lib/budget/budgetCalc";
import { ArrowLeft, Trash2 } from "lucide-react";

function TransactionsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category");
  const { categories, transactions, addTransaction, deleteTransaction } = useBudget();

  const [showAddSheet, setShowAddSheet] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const category = categories.find((c) => c.id === categoryId);
  const catTxns = useMemo(
    () => (categoryId ? transactions.filter((t) => t.categoryId === categoryId) : transactions),
    [transactions, categoryId]
  );

  const handleAddTxn = useCallback(
    (data: { amount: number; categoryId: string; note: string; date: string; type: "expense" | "income" }) => {
      addTransaction(data);
    },
    [addTransaction]
  );

  const totalExpense = catTxns.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const totalIncome = catTxns.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);

  return (
    <>
      {/* Top bar */}
      <div className="px-5 pt-5 pb-3 flex items-center gap-3">
        <button type="button" onClick={() => router.back()} className="w-9 h-9 rounded-xl bg-[#242424] flex items-center justify-center hover:bg-[#2E2E2E] transition-colors">
          <ArrowLeft size={18} className="text-white/70" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-white">{category?.name || "All Transactions"}</h1>
          {category && (
            <div className="flex gap-3 text-xs text-[#888888] mt-0.5">
              <span className="text-emerald-400">+{formatINRShort(totalIncome)}</span>
              <span className="text-red-400">-{formatINRShort(totalExpense)}</span>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => setShowAddSheet(true)}
          className="bg-[#FF6B00] text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 active:scale-[0.96] transition-all"
        >
          + Add
        </button>
      </div>

      {catTxns.length === 0 ? (
        <BudgetEmptyState
          title="No transactions"
          subtitle={category ? `No ${category.name} transactions this month` : "No transactions this month"}
          onAction={() => setShowAddSheet(true)}
          actionLabel="Add Transaction"
        />
      ) : (
        <div className="px-5 space-y-1.5">
          {catTxns
            .sort((a, b) => b.date.localeCompare(a.date))
            .map((txn) => {
              const cat = categories.find((c) => c.id === txn.categoryId);
              const deleting = confirmDelete === txn.id;
              return (
                <div
                  key={txn.id}
                  className={`rounded-2xl border transition-all ${deleting ? "bg-red-500/10 border-red-500/30" : "bg-[#242424] border-[#2E2E2E]"}`}
                >
                  <div className="flex items-center gap-3 p-4">
                    {cat && (
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ background: cat.iconBg }}>
                        {cat.icon}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white capitalize">{cat?.name || txn.categoryId}</p>
                      <div className="flex items-center gap-1.5 text-xs text-[#888888]">
                        <span>{new Date(txn.date + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                        {txn.note && <><span>·</span><span className="truncate">{txn.note}</span></>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <p className={`text-sm font-bold ${txn.type === "income" ? "text-emerald-400" : "text-red-400"}`}>
                        {txn.type === "income" ? "+" : "-"}{formatINRShort(txn.amount)}
                      </p>
                      {deleting ? (
                        <button type="button" onClick={() => { deleteTransaction(txn.id); setConfirmDelete(null); }} className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center hover:bg-red-500/30 transition-colors">
                          <Trash2 size={14} className="text-red-400" />
                        </button>
                      ) : (
                        <button type="button" onClick={() => setConfirmDelete(txn.id)} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors md:opacity-0 md:hover:opacity-100">
                          <Trash2 size={14} className="text-white/40" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      <AddTransactionSheet
        categories={categories}
        open={showAddSheet}
        defaultType="expense"
        onClose={() => setShowAddSheet(false)}
        onSave={handleAddTxn}
      />
      <BudgetBottomNav onFabClick={() => setShowAddSheet(true)} />
    </>
  );
}

export default function TransactionsPage() {
  return (
    <div className="min-h-dvh bg-[#1A1A1A] text-white pb-[calc(64px+env(safe-area-inset-bottom))]">
      <Suspense fallback={<div className="px-5 pt-20 text-center text-[#888888]">Loading...</div>}>
        <TransactionsContent />
      </Suspense>
    </div>
  );
}
