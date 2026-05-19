"use client";

import { useState } from "react";
import { useFinance } from "../contexts/FinanceContext";
import { formatCurrency, formatDate, getMonthKey, formatMonthYear } from "../utils/format";
import { cn } from "@/lib/utils";
import { Trash2, AlertTriangle } from "lucide-react";
import type { Transaction } from "../types/budget";

export function TransactionList() {
  const { transactions, deleteTransaction } = useFinance();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const grouped = transactions.reduce<Record<string, Transaction[]>>((acc, t) => {
    const key = getMonthKey(t.date);
    if (!acc[key]) acc[key] = [];
    acc[key].push(t);
    return acc;
  }, {});

  const sortedMonths = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  function handleDelete(id: string) {
    deleteTransaction(id);
    setDeleteId(null);
  }

  if (transactions.length === 0) {
    return (
      <div className="px-5 pt-6 pb-6 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 rounded-2xl bg-neutral-800 flex items-center justify-center mb-4">
          <AlertTriangle size={28} className="text-white/30" />
        </div>
        <p className="text-white/50 font-semibold">No transactions</p>
        <p className="text-white/30 text-sm mt-1">Start tracking your finances</p>
      </div>
    );
  }

  return (
    <div className="px-5 pt-6 pb-6">
      <h1 className="text-lg font-bold text-white mb-5">Transaction History</h1>

      {sortedMonths.map((monthKey) => {
        const txns = grouped[monthKey];
        const monthIncome = txns.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
        const monthExpense = txns.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);

        return (
          <div key={monthKey} className="mb-5">
            <div className="flex items-center justify-between mb-2.5">
              <p className="text-xs font-bold text-white/60 uppercase tracking-wider">{formatMonthYear(txns[0].date)}</p>
              <div className="flex gap-3 text-[10px] font-semibold">
                <span className="text-emerald-400">+{formatCurrency(monthIncome)}</span>
                <span className="text-red-400">-{formatCurrency(monthExpense)}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              {txns.map((txn) => {
                const isDeleting = deleteId === txn.id;
                return (
                  <div key={txn.id} className="relative overflow-hidden rounded-2xl">
                    <div
                      className={cn(
                        "flex items-center justify-between px-4 py-3 border transition-all",
                        isDeleting
                          ? "bg-red-500/15 border-red-500/30"
                          : "bg-neutral-800/40 border-white/[0.03]"
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0",
                          txn.type === "income" ? "bg-emerald-500/15" : "bg-red-500/15"
                        )}>
                          {txn.type === "income" ? "💼" : "💳"}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white/90 capitalize truncate">{txn.category}</p>
                          <div className="flex items-center gap-1.5">
                            <p className="text-[11px] text-white/40 whitespace-nowrap">{formatDate(txn.date)}</p>
                            {txn.note && (
                              <>
                                <span className="text-[10px] text-white/20 shrink-0">·</span>
                                <span className="text-[10px] text-white/30 truncate">{txn.note}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <p className={cn(
                          "text-sm font-bold",
                          txn.type === "income" ? "text-emerald-400" : "text-red-400"
                        )}>
                          {txn.type === "income" ? "+" : "-"}{formatCurrency(txn.amount)}
                        </p>
                        {isDeleting ? (
                          <button
                            type="button"
                            onClick={() => handleDelete(txn.id)}
                            className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center hover:bg-red-500/30 transition-colors active:scale-90"
                            aria-label="Confirm delete"
                          >
                            <Trash2 size={14} className="text-red-400" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setDeleteId(txn.id)}
                            className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center md:opacity-0 md:hover:opacity-100 transition-all hover:bg-white/10 active:opacity-100 active:scale-90"
                            aria-label="Delete transaction"
                          >
                            <Trash2 size={14} className="text-white/40" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
