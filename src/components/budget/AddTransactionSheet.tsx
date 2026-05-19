"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { BudgetCategory } from "@/lib/budget/budgetTypes";
import { getTodayISO } from "@/lib/budget/budgetCalc";
import { X } from "lucide-react";
import { CategoryIcon } from "@/components/budget/CategoryIcon";

interface AddTransactionSheetProps {
  categories: BudgetCategory[];
  open: boolean;
  defaultType?: "expense" | "income";
  onClose: () => void;
  onSave: (data: { amount: number; categoryId: string; note: string; date: string; type: "expense" | "income" }) => void;
}

export function AddTransactionSheet({ categories, open, defaultType = "expense", onClose, onSave }: AddTransactionSheetProps) {
  const [type, setType] = useState<"expense" | "income">(defaultType);
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(getTodayISO());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [closing, setClosing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setType(defaultType); setAmount(""); setCategoryId(""); setNote(""); setDate(getTodayISO()); setShowDatePicker(false); setClosing(false);
      setTimeout(() => inputRef.current?.focus(), 400);
    }
  }, [open, defaultType]);

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(onClose, 250);
  }, [onClose]);

  const handleBackdrop = useCallback((e: React.MouseEvent) => { if (e.target === e.currentTarget) handleClose(); }, [handleClose]);

  const handleSubmit = useCallback(() => {
    const amt = Number(amount);
    if (!amt || !categoryId) return;
    onSave({ amount: amt, categoryId, note: note.trim(), date, type });
    handleClose();
  }, [amount, categoryId, note, date, type, onSave, handleClose]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={handleBackdrop}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className={closing ? "animate-modal-out" : "animate-modal-in"}>
          <div className="w-9 h-1 rounded-full bg-[#333] mx-auto mt-3 mb-4" />

          <div className="px-5 pb-[calc(24px+env(safe-area-inset-bottom))]">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-[17px] font-semibold text-[#F5F5F5]">Add Transaction</p>
              <button type="button" onClick={handleClose} className="w-8 h-8 rounded-lg bg-[#1C1C1F] flex items-center justify-center hover:bg-[#222226] transition-colors" aria-label="Close">
                <X size={16} className="text-[#8A8A90]" />
              </button>
            </div>

            {/* Type toggle */}
            <div className="flex rounded-xl bg-[#141416] p-1 border border-[rgba(255,255,255,0.06)] mb-5">
              {(["expense", "income"] as const).map((t) => (
                <button key={t} type="button" onClick={() => { setType(t); setCategoryId(""); }} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${type === t ? "bg-[#FF6B00] text-white shadow-md" : "text-[#8A8A90] hover:text-white"}`}>
                  <span className="flex items-center gap-1.5">{t === "expense" ? <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-white"><path d="M12 5v14M5 12h14"/></svg> Expense</> : <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-white"><path d="M5 12h14M12 5l7 7-7 7"/></svg> Income</>}</span>
                </button>
              ))}
            </div>

            {/* Amount */}
            <div className="mb-5">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#55555C] font-mono text-lg">₹</span>
                <input
                  ref={inputRef}
                  type="number"
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="w-full bg-transparent border-b border-[rgba(255,255,255,0.1)] py-3 pl-9 pr-4 text-white font-mono text-[36px] font-bold outline-none focus:border-[#FF6B00]/50 transition-all placeholder:text-[#333]"
                />
              </div>
            </div>

            {/* Category pills */}
            <div className="mb-5">
              <label className="text-[11px] font-semibold text-[#8A8A90] uppercase tracking-wider mb-3 block">Category</label>
              <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
                {categories.map((cat) => {
                  const active = categoryId === cat.id;
                  return (
                    <button key={cat.id} type="button" onClick={() => setCategoryId(cat.id)} className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-all shrink-0 whitespace-nowrap ${active ? "bg-[#FF6B00] text-white" : "bg-[#141416] text-[#8A8A90] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)]"}`}>
                      <CategoryIcon icon={cat.icon} size={22} />
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Note */}
            <div className="mb-5">
              <div className="relative">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#55555C" strokeWidth="2" strokeLinecap="round" className="absolute left-3 top-1/2 -translate-y-1/2">
                  <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
                </svg>
                <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note..." className="w-full bg-[#141416] border border-[rgba(255,255,255,0.06)] rounded-xl py-3 pl-9 pr-4 text-white text-sm outline-none focus:border-[#FF6B00]/50 transition-all placeholder:text-[#55555C]" />
              </div>
            </div>

            {/* Date */}
            <div className="mb-6">
              <label className="text-[11px] font-semibold text-[#8A8A90] uppercase tracking-wider mb-2 block">Date</label>
              <div className="flex gap-2">
                {[{ label: "Today", value: getTodayISO() }, { label: "Yesterday", value: new Date(Date.now() - 86400000).toISOString().slice(0, 10) }].map((opt) => (
                  <button key={opt.label} type="button" onClick={() => { setDate(opt.value); setShowDatePicker(false); }} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${date === opt.value ? "bg-[#FF6B00] text-white" : "bg-[#141416] text-[#8A8A90] hover:bg-[#1C1C1F]"}`}>
                    {opt.label}
                  </button>
                ))}
                <button type="button" onClick={() => setShowDatePicker(!showDatePicker)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${showDatePicker ? "bg-[#FF6B00] text-white" : "bg-[#141416] text-[#8A8A90] hover:bg-[#1C1C1F]"}`}>
                  Pick Date
                </button>
              </div>
              {showDatePicker && (
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full mt-2 bg-[#141416] border border-[rgba(255,255,255,0.06)] rounded-xl py-3 px-4 text-white text-sm outline-none focus:border-[#FF6B00]/50 transition-all" />
              )}
            </div>

            {/* Submit */}
            <button type="button" onClick={handleSubmit} disabled={!amount || !categoryId} className={`w-full rounded-xl py-4 text-base font-bold transition-all active:scale-[0.97] ${amount && categoryId ? "bg-[#FF6B00] text-white shadow-lg shadow-orange-500/30" : "bg-[#141416] text-[#55555C] cursor-not-allowed"}`}>
              Add {type === "expense" ? "Expense" : "Income"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
