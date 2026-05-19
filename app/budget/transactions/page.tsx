"use client";

import { Suspense, useState, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useBudget } from "@/hooks/useBudget";
import { AddTransactionSheet } from "@/components/budget/AddTransactionSheet";
import { BudgetEmptyState } from "@/components/budget/BudgetEmptyState";
import { CategoryIcon } from "@/components/budget/CategoryIcon";
import { PageLayout } from "@/components/layout/PageLayout";
import { formatINRShort } from "@/lib/budget/budgetCalc";

function TransactionsContent() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const catId = searchParams.get("category");
  const { categories, transactions, addTransaction, deleteTransaction } = useBudget();
  const [showAdd, setShowAdd] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const cat = categories.find((c) => c.id === catId);
  const catTxns = useMemo(() => (catId ? transactions.filter((t) => t.categoryId === catId) : transactions).sort((a, b) => b.date.localeCompare(a.date)), [transactions, catId]);

  const handleAddTxn = useCallback((d: Parameters<typeof addTransaction>[0]) => addTransaction(d), [addTransaction]);

  const handleDelete = useCallback((id: string) => {
    setDeletingId(id);
    setTimeout(() => { deleteTransaction(id); setDeletingId(null); setConfirmId(null); }, 250);
  }, [deleteTransaction]);

  const totalExp = catTxns.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const totalInc = catTxns.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);

  return (
    <>
      <div className="category-header">
        <button type="button" onClick={() => navigate("/budget")} className="category-back-btn" aria-label="Back to overview">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>Back</span>
        </button>
        <span className="category-header-title">{cat?.name || "All Transactions"}</span>
        <button type="button" onClick={() => setShowAdd(true)} className="category-add-btn">
          + Add
        </button>
      </div>

      <div className="page-container pt-4 space-y-1.5">
        {catTxns.length === 0 ? (
          <BudgetEmptyState title="No transactions" subtitle={cat ? `No ${cat.name} transactions this month` : "No transactions this month"} onAction={() => setShowAdd(true)} actionLabel="Add Transaction" />
        ) : (
          catTxns.map((txn) => {
            const c = categories.find((c) => c.id === txn.categoryId);
            const isDeleting = deletingId === txn.id;
            return (
              <div key={txn.id} className={isDeleting ? "animate-slide-out" : ""}>
                <div className={`rounded-2xl border ${confirmId === txn.id ? "border-[#EF4444]/30 bg-[rgba(239,68,68,0.06)]" : "glass-card"} p-3.5 flex items-center gap-3 relative`}>
                  {c && <CategoryIcon icon={c.icon} size={36} />}
                  {!c && <div className="w-9 h-9 rounded-xl bg-[#1C1C1F] flex items-center justify-center shrink-0"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-white/50"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 8h20"/></svg></div>}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#F5F5F5]">{txn.note || c?.name || txn.categoryId}</p>
                    <div className="flex items-center gap-1.5 text-xs text-[#8A8A90] mt-0.5">
                      <span className="bg-[#1C1C1F] rounded-md px-2 py-0.5 text-[10px]">{new Date(txn.date + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                      {c && <span>{c.name}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <p className={`text-sm font-bold font-mono ${txn.type === "income" ? "text-[#22C55E]" : "text-[#EF4444]"}`}>
                      {txn.type === "income" ? "+" : "-"}{formatINRShort(txn.amount)}
                    </p>
                    {confirmId === txn.id ? (
                      <div className="flex items-center gap-1 bg-[#1C1C1F] rounded-lg px-2 py-1">
                        <span className="text-[10px] text-[#8A8A90] font-medium">Delete?</span>
                        <button type="button" onClick={() => handleDelete(txn.id)} className="text-[10px] font-bold text-[#EF4444] hover:underline">Yes</button>
                        <button type="button" onClick={() => setConfirmId(null)} className="text-[10px] font-bold text-[#8A8A90] hover:underline">No</button>
                      </div>
                    ) : (
                      <button type="button" onClick={() => setConfirmId(txn.id)} className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all md:opacity-0 md:hover:opacity-100" aria-label="Delete">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"/></svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <AddTransactionSheet categories={categories} open={showAdd} defaultType="expense" onClose={() => setShowAdd(false)} onSave={handleAddTxn} />
    </>
  );
}

export default function TransactionsPage() {
  return (
    <PageLayout>
      <div className="page-scroll-container">
        <Suspense fallback={<div className="px-5 pt-20 text-center text-[#8A8A90]">Loading...</div>}>
          <TransactionsContent />
        </Suspense>
      </div>
    </PageLayout>
  );
}
