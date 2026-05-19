"use client";

import { Suspense, useState, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useBudget } from "@/hooks/useBudget";
import { BudgetBottomNav } from "@/components/budget/BudgetBottomNav";
import { AddTransactionSheet } from "@/components/budget/AddTransactionSheet";
import { BudgetEmptyState } from "@/components/budget/BudgetEmptyState";
import { CategoryIcon } from "@/components/budget/CategoryIcon";
import { formatINRShort } from "@/lib/budget/budgetCalc";
import { ArrowLeft } from "lucide-react";

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
      <div className="glass-header sticky top-0 px-5 pt-4 pb-3 flex items-center gap-2">
        <button type="button" onClick={() => navigate("/")} className="touch-target w-9 h-9 rounded-xl bg-[#141416] border border-[rgba(255,255,255,0.06)] hover:bg-[#1C1C1F] transition-all" aria-label="Home">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/70">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <button type="button" onClick={() => navigate(-1)} className="touch-target w-9 h-9 rounded-xl bg-[#141416] border border-[rgba(255,255,255,0.06)] hover:bg-[#1C1C1F] transition-all" aria-label="Back">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/70">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <div className="flex-1">
          <h1 className="text-[20px] font-bold text-[#F5F5F5] tracking-[-0.02em]">{cat?.name || "All Transactions"}</h1>
          {cat && <div className="flex gap-3 text-xs text-[#8A8A90] mt-0.5 flex-wrap"><span className="text-[#22C55E]">+{formatINRShort(totalInc)}</span><span className="text-[#EF4444]">-{formatINRShort(totalExp)}</span></div>}
        </div>
        <button type="button" onClick={() => setShowAdd(true)} className="bg-[#FF6B00] text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 active:scale-[0.96] transition-all">
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
                  {c && <CategoryIcon icon={c.icon} color={c.color} size={36} />}
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
      <BudgetBottomNav onFabClick={() => setShowAdd(true)} />
    </>
  );
}

export default function TransactionsPage() {
  return (
    <div className="min-h-dvh bg-[#0A0A0C] bg-noise page-scroll-container">
      <Suspense fallback={<div className="px-5 pt-20 text-center text-[#8A8A90]">Loading...</div>}>
        <TransactionsContent />
      </Suspense>
    </div>
  );
}
