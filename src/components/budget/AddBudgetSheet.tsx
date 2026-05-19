"use client";

import { useState, useCallback, useEffect } from "react";
import { X } from "lucide-react";

const EMOJI_OPTIONS = ["🍔", "🛒", "🚗", "✈️", "🎬", "🏥", "💊", "🎓", "📱", "💻", "👔", "🏠", "💡", "🐶", "💰", "🎁", "🏋️", "☕", "🍕", "🎮"];

const COLOR_OPTIONS = ["#FFE8D6", "#E8F4FF", "#F0E8FF", "#E8FFE8", "#FFE8E8", "#E8FFF0", "#FFF0E8", "#F0E8F0"];

interface AddBudgetSheetProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { name: string; icon: string; iconBg: string; monthlyLimit: number; color: string }) => void;
}

export function AddBudgetSheet({ open, onClose, onSave }: AddBudgetSheetProps) {
  const [name, setName] = useState("");
  const [monthlyLimit, setMonthlyLimit] = useState("");
  const [icon, setIcon] = useState("🍔");
  const [iconBg, setIconBg] = useState("#FFE8D6");

  useEffect(() => {
    if (open) { setName(""); setMonthlyLimit(""); setIcon("🍔"); setIconBg("#FFE8D6"); }
  }, [open]);

  const handleBackdrop = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  }, [onClose]);

  const handleSubmit = useCallback(() => {
    if (!name.trim() || !monthlyLimit) return;
    onSave({ name: name.trim(), icon, iconBg, monthlyLimit: Number(monthlyLimit), color: iconBg });
    onClose();
  }, [name, monthlyLimit, icon, iconBg, onSave, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60" onClick={handleBackdrop}>
      <div className="w-full max-w-md bg-[#1A1A1A] rounded-t-3xl border-t border-[#2E2E2E] px-5 pt-2 pb-[calc(24px+env(safe-area-inset-bottom))] max-h-[90dvh] overflow-y-auto">
        <div className="w-10 h-1 rounded-full bg-[#3E3E3E] mx-auto mb-4" />

        <div className="flex items-center justify-between mb-5">
          <p className="text-lg font-bold text-white">New Budget</p>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-lg bg-[#2E2E2E] flex items-center justify-center hover:bg-[#3E3E3E] transition-colors">
            <X size={16} className="text-[#888888]" />
          </button>
        </div>

        {/* Name */}
        <div className="mb-5">
          <label className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider mb-2 block">Category Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Entertainment"
            className="w-full bg-[#242424] border border-[#2E2E2E] rounded-xl py-3 px-4 text-white text-sm outline-none focus:border-[#FF6B00]/50 transition-all placeholder:text-[#3E3E3E]"
          />
        </div>

        {/* Monthly Limit */}
        <div className="mb-5">
          <label className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider mb-2 block">Monthly Limit</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#888888] font-semibold">₹</span>
            <input
              type="number"
              inputMode="numeric"
              value={monthlyLimit}
              onChange={(e) => setMonthlyLimit(e.target.value)}
              placeholder="5,000"
              className="w-full bg-[#242424] border border-[#2E2E2E] rounded-xl py-3 pl-8 pr-4 text-white text-lg font-bold outline-none focus:border-[#FF6B00]/50 transition-all placeholder:text-[#3E3E3E]"
            />
          </div>
        </div>

        {/* Icon picker */}
        <div className="mb-5">
          <label className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider mb-3 block">Icon</label>
          <div className="flex flex-wrap gap-2">
            {EMOJI_OPTIONS.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => setIcon(e)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all ${icon === e ? "bg-[#FF6B00] scale-110 shadow-md" : "bg-[#242424] border border-[#2E2E2E] hover:border-[#3E3E3E]"}`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        {/* Color swatches */}
        <div className="mb-6">
          <label className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider mb-3 block">Color Theme</label>
          <div className="flex gap-2">
            {COLOR_OPTIONS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setIconBg(c)}
                className={`w-10 h-10 rounded-xl transition-all border-2 ${iconBg === c ? "border-[#FF6B00] scale-110" : "border-transparent hover:border-white/20"}`}
                style={{ background: c }}
              />
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!name.trim() || !monthlyLimit}
          className={`w-full rounded-2xl py-4 text-base font-bold transition-all active:scale-[0.97] shadow-lg ${
            name.trim() && monthlyLimit
              ? "bg-[#FF6B00] text-white shadow-orange-500/40 hover:shadow-orange-500/50"
              : "bg-[#242424] text-[#555555] cursor-not-allowed"
          }`}
        >
          Create Budget
        </button>
      </div>
    </div>
  );
}
