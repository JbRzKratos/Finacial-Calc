"use client";

import { useState, useCallback, useEffect } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatINR } from "@/utils/formatters";
import { CategoryIcon } from "@/screens/BudgetScreen/CategoryIcon";
import type { BudgetCategory } from "@/types";

interface EditBudgetLimitSheetProps {
  open: boolean;
  onClose: () => void;
  category: BudgetCategory;
  onSave: (newLimit: number) => void;
}

export function EditBudgetLimitSheet({ open, onClose, category, onSave }: EditBudgetLimitSheetProps) {
  const [value, setValue] = useState(String(category.monthlyLimit));

  useEffect(() => {
    if (open) { setValue(String(category.monthlyLimit)); }
  }, [open, category.monthlyLimit]);

  const handleSave = useCallback(() => {
    const n = Number(value);
    if (n > 0) onSave(n);
    onClose();
  }, [value, onSave, onClose]);

  return (
    <Sheet open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <SheetContent
        side="bottom"
        className="bg-[#141416] border-t border-white/[0.06] rounded-t-3xl px-0 pb-0 max-h-[85vh] overflow-y-auto [&>button]:hidden"
      >
        <div className="w-9 h-1 rounded-full bg-[#333] mx-auto mt-3 mb-2" />
        <div className="px-5 pb-[calc(24px+env(safe-area-inset-bottom))]">
          <div className="flex items-center justify-between mb-5">
            <p className="text-[17px] font-semibold text-[#F5F5F5]">Adjust Limit</p>
            <Button type="button" variant="ghost" onClick={onClose} className="w-8 h-8 rounded-lg bg-[#1C1C1F] hover:bg-[#222226] p-0 flex items-center justify-center" aria-label="Close">
              <X size={16} className="text-[#8A8A90]" />
            </Button>
          </div>

          <div className="flex items-center gap-3 bg-[#141416] rounded-xl p-3.5 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: category.color + "20" }}>
              <CategoryIcon icon={category.icon} size={18} />
            </div>
            <div>
              <p className="text-[15px] font-semibold text-[#F5F5F5]">{category.name}</p>
              <p className="text-[11px] text-[#8A8A90]">Current: {formatINR(category.monthlyLimit)}</p>
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="edit-budget-limit" className="text-[11px] font-semibold text-[#8A8A90] uppercase tracking-wider mb-2 block">New Monthly Limit</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#55555C] font-mono text-lg">₹</span>
              <input
                id="edit-budget-limit"
                type="number"
                inputMode="numeric"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full bg-[#141416] border border-[rgba(255,255,255,0.06)] rounded-xl py-3.5 pl-9 pr-4 text-white font-mono text-xl font-bold outline-none focus:border-[#FF6B00]/50 transition-all"
                autoFocus
              />
            </div>
          </div>

          {/* Quick adjust chips */}
          <div className="flex gap-2 flex-wrap mb-6">
            {[500, 1000, 2000, 5000].map((step) => {
              const up = Number(value) + step;
              const down = Math.max(100, Number(value) - step);
              return (
                <div key={step} className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setValue(String(down))}
                    className="px-3 py-1.5 rounded-lg bg-[#1C1C1F] text-[11px] text-[#8A8A90] hover:bg-[#222226] hover:text-white transition-all font-mono"
                  >
                    -{formatINR(step)}
                  </button>
                  <button
                    type="button"
                    onClick={() => setValue(String(up))}
                    className="px-3 py-1.5 rounded-lg bg-[#1C1C1F] text-[11px] text-[#8A8A90] hover:bg-[#222226] hover:text-white transition-all font-mono"
                  >
                    +{formatINR(step)}
                  </button>
                </div>
              );
            })}
          </div>

          <Button
            type="button"
            onClick={handleSave}
            disabled={!value || Number(value) <= 0}
            className={`w-full rounded-xl py-3.5 text-base font-bold transition-all active:scale-[0.97] h-auto ${value && Number(value) > 0 ? "bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-black shadow-lg shadow-orange-500/30" : "bg-[#141416] text-[#55555C] cursor-not-allowed"}`}
          >
            Save Limit
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
