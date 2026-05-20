"use client";

import { useEffect, useCallback, useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import type { DateRange } from "@/lib/budget/budgetTypes";
import { getMonthDateRange, getTodayISO } from "@/lib/budget/budgetCalc";

interface DateRangePickerProps {
  range: DateRange;
  onChange: (range: DateRange) => void;
  onClose: () => void;
}

export function DateRangePicker({ range, onChange, onClose }: DateRangePickerProps) {
  const [from, setFrom] = useState(range.startDate);
  const [to, setTo] = useState(range.endDate);

  useEffect(() => {
    setFrom(range.startDate);
    setTo(range.endDate);
  }, [range]);

  const applyPreset = useCallback((startDate: string, endDate: string) => {
    setFrom(startDate);
    setTo(endDate);
  }, []);

  const handleApply = useCallback(() => {
    if (from && to && from <= to) {
      onChange({ startDate: from, endDate: to });
      onClose();
    }
  }, [from, to, onChange, onClose]);

  const now = new Date();
  const cy = now.getFullYear();
  const cm = now.getMonth();

  const presets = [
    {
      label: "This Month",
      getRange: () => getMonthDateRange(cm, cy),
    },
    {
      label: "Last 30 Days",
      getRange: () => {
        const end = getTodayISO();
        const start = new Date(now);
        start.setDate(start.getDate() - 29);
        return { startDate: start.toISOString().slice(0, 10), endDate: end };
      },
    },
    {
      label: "This Year",
      getRange: () => ({ startDate: `${cy}-01-01`, endDate: `${cy}-12-31` }),
    },
    {
      label: "Last Month",
      getRange: () => {
        const lm = cm === 0 ? 11 : cm - 1;
        const ly = cm === 0 ? cy - 1 : cy;
        return getMonthDateRange(lm, ly);
      },
    },
  ];

  const today = getTodayISO();

  return (
    <Sheet open={true} onOpenChange={(v) => { if (!v) onClose(); }}>
      <SheetContent
        side="bottom"
        className="bg-[#141416] border-t border-white/[0.06] rounded-t-3xl px-0 pb-0 max-h-[80vh] overflow-y-auto [&>button]:hidden"
      >
        <div className="w-9 h-1 rounded-full bg-[#333] mx-auto mt-3 mb-2" />
        <div className="px-5 pb-[calc(24px+env(safe-area-inset-bottom))]">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold text-[#8A8A90] uppercase tracking-wider">Select Date Range</p>
          </div>

          {/* Preset buttons */}
          <div className="flex gap-2 flex-wrap mb-5">
            {presets.map((p) => {
              const pr = p.getRange();
              const active = pr.startDate === from && pr.endDate === to;
              return (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => applyPreset(pr.startDate, pr.endDate)}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? "bg-[#FF6B00] text-white"
                      : "bg-[#1C1C1F] text-[#8A8A90] hover:bg-[#222226] hover:text-white"
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          {/* From date */}
          <div className="mb-4">
            <label className="text-[11px] font-semibold text-[#8A8A90] uppercase tracking-wider mb-2 block">From</label>
            <input
              type="date"
              value={from}
              max={to || today}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full bg-[#141416] border border-[rgba(255,255,255,0.06)] rounded-xl py-3 px-4 text-white text-sm outline-none focus:border-[#FF6B00]/50 transition-all"
            />
          </div>

          {/* To date */}
          <div className="mb-6">
            <label className="text-[11px] font-semibold text-[#8A8A90] uppercase tracking-wider mb-2 block">To</label>
            <input
              type="date"
              value={to}
              min={from}
              onChange={(e) => setTo(e.target.value)}
              className="w-full bg-[#141416] border border-[rgba(255,255,255,0.06)] rounded-xl py-3 px-4 text-white text-sm outline-none focus:border-[#FF6B00]/50 transition-all"
            />
          </div>

          {/* Apply button */}
          <button
            type="button"
            onClick={handleApply}
            disabled={!from || !to || from > to}
            className={`w-full rounded-xl py-3.5 text-base font-bold transition-all active:scale-[0.97] ${
              from && to && from <= to
                ? "bg-[#FF6B00] text-black shadow-lg shadow-orange-500/30"
                : "bg-[#141416] text-[#55555C] cursor-not-allowed"
            }`}
          >
            Apply Range
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
