"use client";

import { useEffect, useCallback } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface MonthSelectorProps {
  month: number;
  year: number;
  onChange: (m: number, y: number) => void;
  onClose: () => void;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function MonthSelector({ month, year, onChange, onClose }: MonthSelectorProps) {
  return (
    <Sheet open={true} onOpenChange={(v) => { if (!v) onClose(); }}>
      <SheetContent
        side="bottom"
        className="bg-[#141416] border-t border-white/[0.06] rounded-t-3xl px-0 pb-0 max-h-[70vh] overflow-y-auto [&>button]:hidden"
      >
        <div className="w-9 h-1 rounded-full bg-[#333] mx-auto mt-3 mb-5" />
        <div className="px-6 pb-8">
          <p className="text-xs font-semibold text-[#8A8A90] uppercase tracking-wider mb-4">Select Month</p>
          <div className="flex items-center justify-between mb-5">
            <button type="button" onClick={() => onChange(month === 0 ? 11 : month - 1, month === 0 ? year - 1 : year)} className="w-10 h-10 rounded-xl bg-[#1C1C1F] flex items-center justify-center hover:bg-[#222226] transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F5F5F5" strokeWidth="2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <p className="text-base font-semibold text-[#F5F5F5]">{MONTHS[month]} {year}</p>
            <button type="button" onClick={() => onChange(month === 11 ? 0 : month + 1, month === 11 ? year + 1 : year)} className="w-10 h-10 rounded-xl bg-[#1C1C1F] flex items-center justify-center hover:bg-[#222226] transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F5F5F5" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {MONTHS.map((name, i) => (
              <button key={i} type="button" onClick={() => { onChange(i, year); onClose(); }} className={`py-3 rounded-xl text-sm font-medium transition-all ${i === month ? "bg-[#FF6B00] text-white" : "bg-[#1C1C1F] text-[#8A8A90] hover:bg-[#222226] hover:text-white"}`}>
                {name}
              </button>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <button type="button" onClick={() => { const d = new Date(); onChange(d.getMonth(), d.getFullYear()); onClose(); }} className="text-xs font-semibold text-[#8A8A90] hover:text-[#F5F5F5] transition-colors">
              Jump to Today
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
