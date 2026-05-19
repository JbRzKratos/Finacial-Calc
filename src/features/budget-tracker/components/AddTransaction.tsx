"use client";

import { useState } from "react";
import { useFinance } from "../contexts/FinanceContext";
import { allCategories } from "../utils/constants";
import type { TabId } from "../types/budget";
import { cn } from "@/lib/utils";
import { Check, ArrowLeft } from "lucide-react";

interface AddTransactionProps {
  onTabChange: (tab: TabId) => void;
}

export function AddTransaction({ onTabChange }: AddTransactionProps) {
  const { addTransaction } = useFinance();
  const [type, setType] = useState<"expense" | "income">("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  const cats = allCategories(type);
  const isValid = amount && Number(amount) > 0 && category && date;

  function handleSave() {
    if (!isValid) return;
    addTransaction({
      type,
      amount: Math.round(Number(amount) * 100) / 100,
      category,
      date,
      note: note.trim(),
    });
    setAmount("");
    setCategory("");
    setNote("");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="px-5 pt-6 pb-6">
      <div className="flex items-center gap-3 mb-6">
        <button type="button" onClick={() => onTabChange("dashboard")} className="w-9 h-9 rounded-xl bg-neutral-800 flex items-center justify-center hover:bg-neutral-700 transition-colors">
          <ArrowLeft size={18} className="text-white/70" />
        </button>
        <h1 className="text-lg font-bold text-white">Add Transaction</h1>
      </div>

      {/* Type Toggle */}
      <div className="flex rounded-2xl bg-neutral-800 p-1 mb-6 border border-white/[0.04]">
        {(["expense", "income"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => { setType(t); setCategory(""); }}
            className={cn(
              "flex-1 py-3 rounded-xl text-sm font-semibold transition-all",
              type === t
                ? "bg-neutral-700 text-white shadow-sm"
                : "text-white/40 hover:text-white/70"
            )}
          >
            {t === "expense" ? "💸 Expense" : "💰 Income"}
          </button>
        ))}
      </div>

      {/* Amount Input */}
      <div className="mb-6">
        <label className="text-[11px] font-semibold text-white/50 uppercase tracking-wider mb-2 block">Amount</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 font-semibold text-lg">₹</span>
          <input
            type="number"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="w-full bg-neutral-800 border border-white/[0.06] rounded-2xl py-4 pl-9 pr-4 text-white text-xl font-bold outline-none focus:border-violet-500/50 focus:bg-neutral-750 transition-all placeholder:text-white/20"
          />
        </div>
      </div>

      {/* Category Grid */}
      <div className="mb-6">
        <label className="text-[11px] font-semibold text-white/50 uppercase tracking-wider mb-3 block">Category</label>
        <div className="grid grid-cols-3 xs:grid-cols-4 gap-2">
          {cats.map((cat) => {
            const active = category === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-xl p-3 transition-all border",
                  active
                    ? "bg-violet-500/20 border-violet-500/40"
                    : "bg-neutral-800/60 border-white/[0.04] hover:border-white/10"
                )}
              >
                <span className="text-xl">{cat.icon}</span>
                <span className={cn("text-[9px] font-semibold text-center leading-tight", active ? "text-white" : "text-white/50")}>
                  {cat.label.split(" &")[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Date */}
      <div className="mb-6">
        <label className="text-[11px] font-semibold text-white/50 uppercase tracking-wider mb-2 block">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full bg-neutral-800 border border-white/[0.06] rounded-2xl py-3.5 px-4 text-white text-sm font-medium outline-none focus:border-violet-500/50 transition-all"
        />
      </div>

      {/* Note */}
      <div className="mb-8">
        <label className="text-[11px] font-semibold text-white/50 uppercase tracking-wider mb-2 block">Note (optional)</label>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note..."
          className="w-full bg-neutral-800 border border-white/[0.06] rounded-2xl py-3.5 px-4 text-white text-sm outline-none focus:border-violet-500/50 transition-all placeholder:text-white/20"
        />
      </div>

      {/* Save Button */}
      <button
        type="button"
        onClick={handleSave}
        disabled={!isValid}
        className={cn(
          "w-full rounded-2xl font-semibold py-4 flex items-center justify-center gap-2 transition-all active:scale-[0.98]",
          isValid
            ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30"
            : "bg-neutral-800 text-white/30 cursor-not-allowed"
        )}
      >
        {saved ? (
          <>
            <Check size={18} />
            Saved!
          </>
        ) : (
          "Save Transaction"
        )}
      </button>
    </div>
  );
}
