"use client";

import { useEffect, useCallback, useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { DateRangePickerInput } from "@/components/ui/date-range-picker-input";
import type { DateRange } from "@/types";
import { getMonthDateRange, getTodayISO } from "@/utils/calculations";

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

  return (
    <Sheet open={true} onOpenChange={(v) => { if (!v) onClose(); }}>
      <SheetContent
        side="bottom"
        className="bg-[#141416] border-t border-white/[0.06] rounded-t-3xl px-0 pb-0 max-h-[80vh] overflow-y-auto [&>button]:hidden"
      >
        <div className="w-10 h-1 rounded-full bg-white/15 mx-auto mt-3 mb-3" />
        <div className="px-5 pb-[calc(32px+env(safe-area-inset-bottom))]">
          <div className="flex items-center justify-between mb-5">
            <p className="text-xs font-semibold text-white/50 uppercase tracking-[0.12em]">Select Date Range</p>
          </div>

          {/* Preset buttons */}
          <div className="grid grid-cols-2 gap-2.5 mb-5">
            {presets.map((p) => {
              const pr = p.getRange();
              const active = pr.startDate === from && pr.endDate === to;
              return (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => applyPreset(pr.startDate, pr.endDate)}
                  className={`w-full py-2.5 rounded-xl text-sm font-semibold tracking-wide transition-all active:scale-[0.97] ${
                    active
                      ? "bg-[#FF6B00] text-black shadow-lg shadow-orange-500/25"
                      : "bg-[#1C1C1F] text-white/55 hover:bg-[#222226] hover:text-white/90 border border-white/[0.04]"
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          {/* Date range picker */}
          <div className="mb-6">
            <DateRangePickerInput
              from={from ? new Date(from + "T00:00:00") : undefined}
              to={to ? new Date(to + "T00:00:00") : undefined}
              onChange={(f, t) => {
                setFrom(f ? f.toISOString().slice(0, 10) : "")
                setTo(t ? t.toISOString().slice(0, 10) : "")
              }}
            />
          </div>

          {/* Apply button */}
          <Button
            type="button"
            onClick={handleApply}
            disabled={!from || !to || from > to}
            className={`w-full rounded-xl py-3.5 text-base font-bold transition-all active:scale-[0.97] h-auto ${
              from && to && from <= to
                ? "bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-black shadow-lg shadow-orange-500/30"
                : "bg-[#141416] text-[#55555C] cursor-not-allowed"
            }`}
          >
            Apply Range
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
