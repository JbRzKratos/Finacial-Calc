"use client";

import { useFinance } from "../contexts/FinanceContext";
import { formatCurrency, formatDate, getMonthKey } from "../utils/format";
import { ArrowUpRight, ArrowDownRight, Wallet, Plus } from "lucide-react";
import type { TabId } from "../types/budget";
import { cn } from "@/lib/utils";

interface DashboardProps {
  onTabChange: (tab: TabId) => void;
}

export function Dashboard({ onTabChange }: DashboardProps) {
  const { transactions } = useFinance();

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const recentTxns = transactions.slice(0, 5);
  const currentMonth = getMonthKey(new Date().toISOString().slice(0, 10));
  const monthIncome = transactions.filter((t) => t.type === "income" && getMonthKey(t.date) === currentMonth).reduce((s, t) => s + t.amount, 0);
  const monthExpense = transactions.filter((t) => t.type === "expense" && getMonthKey(t.date) === currentMonth).reduce((s, t) => s + t.amount, 0);

  return (
    <div className="px-5 pt-6 pb-6">
      {/* Balance Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-800 to-neutral-900 p-6 mb-6 border border-white/5 shadow-xl">
        <div className="absolute top-0 right-0 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
        <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-1">Total Balance</p>
        <p className="text-3xl font-extrabold text-white tracking-tight">
          {balance >= 0 ? "" : "-"}{formatCurrency(Math.abs(balance))}
        </p>
        <div className="flex gap-4 mt-4">
          <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3.5 py-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <ArrowUpRight size={16} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-[10px] text-white/40 uppercase tracking-wider">Income</p>
              <p className="text-sm font-bold text-emerald-400">{formatCurrency(monthIncome)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3.5 py-2.5">
            <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
              <ArrowDownRight size={16} className="text-red-400" />
            </div>
            <div>
              <p className="text-[10px] text-white/40 uppercase tracking-wider">Expense</p>
              <p className="text-sm font-bold text-red-400">{formatCurrency(monthExpense)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 xs:grid-cols-3 gap-3 mb-6">
        {[
          { label: "Total Income", value: formatCurrency(totalIncome), icon: ArrowUpRight, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "Total Expense", value: formatCurrency(totalExpense), icon: ArrowDownRight, color: "text-red-400", bg: "bg-red-500/10" },
          { label: "Transactions", value: String(transactions.length), icon: Wallet, color: "text-violet-400", bg: "bg-violet-500/10" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-2xl bg-neutral-800/60 border border-white/[0.04] p-3.5">
              <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center mb-2.5", stat.bg)}>
                <Icon size={16} className={stat.color} />
              </div>
              <p className="text-[18px] font-bold text-white tracking-tight">{stat.value}</p>
              <p className="text-[10px] text-white/40 mt-0.5 uppercase tracking-wider">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Transactions */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-white/80">Recent Activity</h3>
        <button type="button" onClick={() => onTabChange("history")} className="text-[11px] font-semibold text-violet-400 hover:text-violet-300 transition-colors">
          See All
        </button>
      </div>

      <div className="space-y-1.5">
        {recentTxns.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-white/30">No transactions yet</p>
            <p className="text-xs text-white/20 mt-1">Tap + to add your first entry</p>
          </div>
        ) : (
          recentTxns.map((txn) => (
            <div key={txn.id} className="flex items-center justify-between rounded-2xl bg-neutral-800/40 px-4 py-3 border border-white/[0.03]">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center text-lg",
                  txn.type === "income" ? "bg-emerald-500/15" : "bg-red-500/15"
                )}>
                  {txn.type === "income" ? "💼" : "💳"}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white/90 capitalize">{txn.category}</p>
                  <p className="text-[11px] text-white/40">{formatDate(txn.date)}</p>
                </div>
              </div>
              <p className={cn(
                "text-sm font-bold",
                txn.type === "income" ? "text-emerald-400" : "text-red-400"
              )}>
                {txn.type === "income" ? "+" : "-"}{formatCurrency(txn.amount)}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Quick Add CTA */}
      <button
        type="button"
        onClick={() => onTabChange("add")}
        className="mt-5 w-full rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold py-3.5 flex items-center justify-center gap-2 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 transition-all active:scale-[0.98]"
      >
        <Plus size={18} />
        Add New Transaction
      </button>
    </div>
  );
}
