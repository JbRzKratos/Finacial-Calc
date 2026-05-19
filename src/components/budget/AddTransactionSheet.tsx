"use client";

import { useState, useRef, useCallback, useEffect, type ReactNode } from "react";
import type { BudgetCategory } from "@/lib/budget/budgetTypes";
import { getTodayISO } from "@/lib/budget/budgetCalc";
import { X, Plus } from "lucide-react";

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
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef(0);
  const dragY = useRef(0);

  useEffect(() => {
    if (open) {
      setType(defaultType);
      setAmount("");
      setCategoryId("");
      setNote("");
      setDate(getTodayISO());
      setShowDatePicker(false);
    }
  }, [open, defaultType]);

  const handleBackdrop = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  }, [onClose]);

  const handleDragStart = useCallback((e: React.TouchEvent) => {
    dragStartY.current = e.touches[0].clientY;
  }, []);

  const handleDragMove = useCallback((e: React.TouchEvent) => {
    dragY.current = e.touches[0].clientY - dragStartY.current;
    if (dragY.current > 0 && sheetRef.current) {
      sheetRef.current.style.transform = `translateY(${dragY.current}px)`;
    }
  }, []);

  const handleDragEnd = useCallback(() => {
    if (dragY.current > 60) onClose();
    if (sheetRef.current) sheetRef.current.style.transform = "";
    dragY.current = 0;
  }, [onClose]);

  const handleSubmit = useCallback(() => {
    const amt = Number(amount);
    if (!amt || !categoryId) return;
    onSave({ amount: amt, categoryId, note: note.trim(), date, type });
    onClose();
  }, [amount, categoryId, note, date, type, onSave, onClose]);

  if (!open) return null;

  const dateOptions: { label: string; value: string }[] = [
    { label: "Today", value: getTodayISO() },
    { label: "Yesterday", value: new Date(Date.now() - 86400000).toISOString().slice(0, 10) },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60" onClick={handleBackdrop}>
      <div
        ref={sheetRef}
        className="w-full max-w-md bg-[#1A1A1A] rounded-t-3xl border-t border-[#2E2E2E] px-5 pt-2 pb-[calc(24px+env(safe-area-inset-bottom))] max-h-[90dvh] overflow-y-auto transition-transform duration-300"
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        <div className="w-10 h-1 rounded-full bg-[#3E3E3E] mx-auto mb-4" />

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-lg font-bold text-white">Add {type === "expense" ? "Expense" : "Income"}</p>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-lg bg-[#2E2E2E] flex items-center justify-center hover:bg-[#3E3E3E] transition-colors">
            <X size={16} className="text-[#888888]" />
          </button>
        </div>

        {/* Type toggle */}
        <div className="flex rounded-xl bg-[#242424] p-1 mb-5 border border-[#2E2E2E]">
          {(["expense", "income"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => { setType(t); setCategoryId(""); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${type === t ? "bg-[#FF6B00] text-white shadow-md" : "text-[#888888] hover:text-white"}`}
            >
              {t === "expense" ? "💸 Expense" : "💰 Income"}
            </button>
          ))}
        </div>

        {/* Amount */}
        <div className="mb-5">
          <label className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider mb-2 block">Amount</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#888888] font-semibold text-lg">₹</span>
            <input
              type="number"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full bg-[#242424] border border-[#2E2E2E] rounded-2xl py-4 pl-9 pr-4 text-white text-3xl font-extrabold outline-none focus:border-[#FF6B00]/50 transition-all placeholder:text-[#3E3E3E]"
            />
          </div>
        </div>

        {/* Category selector */}
        <div className="mb-5">
          <label className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider mb-3 block">Category</label>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => {
              const active = categoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryId(cat.id)}
                  className={`flex flex-col items-center gap-1.5 rounded-xl p-3 min-w-[64px] transition-all shrink-0 border ${active ? "border-[#FF6B00] bg-[rgba(255,107,0,0.1)] scale-105" : "border-[#2E2E2E] bg-[#242424] hover:border-[#3E3E3E]"}`}
                >
                  <span className="text-2xl">{cat.icon}</span>
                  <span className={`text-[10px] font-semibold ${active ? "text-white" : "text-[#888888]"}`}>{cat.name.slice(0, 5)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Note */}
        <div className="mb-5">
          <label className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider mb-2 block">Note (optional)</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note..."
            className="w-full bg-[#242424] border border-[#2E2E2E] rounded-xl py-3 px-4 text-white text-sm outline-none focus:border-[#FF6B00]/50 transition-all placeholder:text-[#3E3E3E]"
          />
        </div>

        {/* Date */}
        <div className="mb-6">
          <label className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider mb-2 block">Date</label>
          <div className="flex gap-2">
            {dateOptions.map((opt) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => { setDate(opt.value); setShowDatePicker(false); }}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${date === opt.value ? "bg-[#FF6B00] text-white" : "bg-[#242424] text-[#888888] hover:bg-[#2E2E2E]"}`}
              >
                {opt.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setShowDatePicker(!showDatePicker)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${showDatePicker ? "bg-[#FF6B00] text-white" : "bg-[#242424] text-[#888888] hover:bg-[#2E2E2E]"}`}
            >
              Pick Date
            </button>
          </div>
          {showDatePicker && (
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full mt-2 bg-[#242424] border border-[#2E2E2E] rounded-xl py-3 px-4 text-white text-sm outline-none focus:border-[#FF6B00]/50 transition-all"
            />
          )}
        </div>

        {/* Submit */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!amount || !categoryId}
          className={`w-full rounded-2xl py-4 text-base font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.97] shadow-lg ${
            amount && categoryId
              ? "bg-[#FF6B00] text-white shadow-orange-500/40 hover:shadow-orange-500/50"
              : "bg-[#242424] text-[#555555] cursor-not-allowed"
          }`}
        >
          Add {type === "expense" ? "Expense" : "Income"}
        </button>
      </div>
    </div>
  );
}
