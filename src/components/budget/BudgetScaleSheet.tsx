"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { X } from "lucide-react";
import type { BudgetCategory } from "@/lib/budget/budgetTypes";
import { formatINR } from "@/lib/budget/budgetCalc";
import { CategoryIcon } from "@/components/budget/CategoryIcon";

const PRESETS = [5000, 10000, 15000, 20000, 30000, 50000, 100000];

interface BudgetScaleSheetProps {
  open: boolean;
  onClose: () => void;
  currentTotal: number;
  categories: BudgetCategory[];
  onApply: (newTotal: number) => void;
}

function scaleTo(cats: BudgetCategory[], target: number): BudgetCategory[] {
  const cur = cats.reduce((s, c) => s + c.monthlyLimit, 0);
  if (cur === 0) return cats;
  const r = target / cur;
  return cats.map((c) => ({ ...c, monthlyLimit: Math.round(c.monthlyLimit * r) }));
}

export function BudgetScaleSheet({ open, onClose, currentTotal, categories, onApply }: BudgetScaleSheetProps) {
  const [value, setValue] = useState(currentTotal);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) { setValue(currentTotal); }
  }, [open, currentTotal]);

  const scaled = useMemo(() => scaleTo(categories, value), [categories, value]);

  const handleSlider = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(e.target.value));
  }, []);

  const handlePreset = useCallback((v: number) => {
    setValue(v);
  }, []);

  const handleApply = useCallback(() => {
    onApply(value);
    onClose();
  }, [value, onApply, onClose]);

  const handleCustomInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    setValue(raw ? Number(raw) : 0);
  }, []);

  const maxPreset = Math.max(...PRESETS, currentTotal * 2);
  const sliderMax = Math.max(maxPreset, 200000);

  return (
    <Sheet open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <SheetContent
        side="bottom"
        className="bg-[#141416] border-t border-white/[0.06] rounded-t-3xl px-0 pb-0 max-h-[85vh] overflow-y-auto [&>button]:hidden"
      >
        <div className="w-9 h-1 rounded-full bg-[#333] mx-auto mt-3 mb-2" />
        <div className="px-5 pb-[calc(24px+env(safe-area-inset-bottom))]">
          <div className="flex items-center justify-between mb-5">
            <p className="text-[17px] font-semibold text-[#F5F5F5]">Scale Budget</p>
            <button type="button" onClick={onClose} className="w-8 h-8 rounded-lg bg-[#1C1C1F] flex items-center justify-center hover:bg-[#222226] transition-colors" aria-label="Close">
              <X size={16} className="text-[#8A8A90]" />
            </button>
          </div>

          {/* Large animated number */}
          <div className="text-center py-4">
            <p className="text-[40px] font-bold font-mono text-[#F5F5F5] tracking-tight leading-none">
              {formatINR(value)}
            </p>
            <p className="text-xs text-[#8A8A90] mt-2">total monthly budget</p>
          </div>

          {/* Preset chips */}
          <div className="flex gap-2 flex-wrap justify-center mb-5">
            {PRESETS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => handlePreset(p)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  value === p
                    ? "bg-[#FF6B00] text-black font-bold"
                    : "bg-[#1C1C1F] text-[#8A8A90] hover:bg-[#222226] hover:text-white"
                }`}
              >
                {p >= 1000 ? `₹${(p / 1000).toFixed(p % 1000 === 0 ? 0 : 1)}K` : `₹${p}`}
              </button>
            ))}
          </div>

          {/* Slider */}
          <div className="mb-6">
            <input
              ref={inputRef}
              type="range"
              min={0}
              max={sliderMax}
              step={500}
              value={value}
              onChange={handleSlider}
              className="budget-scale-slider"
            />
            <div className="flex justify-between text-[10px] text-[#55555C] mt-1 px-0.5 font-mono">
              <span>₹0</span>
              <span>{formatINR(sliderMax)}</span>
            </div>
          </div>

          {/* Custom input */}
          <div className="flex items-center gap-3 mb-5">
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#55555C] font-mono text-sm">₹</span>
              <input
                type="text"
                inputMode="numeric"
                value={value || ""}
                onChange={handleCustomInput}
                placeholder="Enter amount"
                className="w-full bg-[#141416] border border-[rgba(255,255,255,0.06)] rounded-xl py-2.5 pl-7 pr-3.5 text-white font-mono text-sm outline-none focus:border-[#FF6B00]/50 transition-all placeholder:text-[#55555C]"
              />
            </div>
            <button
              type="button"
              onClick={handleApply}
              className="bg-[#FF6B00] text-black font-bold text-sm px-5 py-2.5 rounded-xl hover:opacity-90 active:scale-[0.97] transition-all whitespace-nowrap"
            >
              Apply
            </button>
          </div>

          {/* Live category preview */}
          <div>
            <p className="text-[11px] font-semibold text-[#8A8A90] uppercase tracking-wider mb-3">How it distributes</p>
            <div className="space-y-2 max-h-[160px] overflow-y-auto custom-scrollbar pr-1">
              {scaled.map((c) => {
                const orig = categories.find((o) => o.id === c.id)?.monthlyLimit ?? 0;
                const delta = c.monthlyLimit - orig;
                return (
                  <div key={c.id} className="flex items-center gap-2.5 bg-[#141416] rounded-xl p-2.5">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: c.color + "20" }}>
                      <CategoryIcon icon={c.icon} size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-[#F5F5F5] truncate">{c.name}</p>
                      <p className="text-[11px] font-mono text-[#8A8A90]">{formatINR(c.monthlyLimit)}</p>
                    </div>
                    <p className={`text-[11px] font-mono font-medium ${delta > 0 ? "text-[#22C55E]" : delta < 0 ? "text-[#EF4444]" : "text-[#55555C]"}`}>
                      {delta > 0 ? "+" : ""}{formatINR(delta)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
