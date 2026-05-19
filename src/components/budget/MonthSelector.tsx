"use client";

import { useRef, useEffect, useCallback } from "react";

interface MonthSelectorProps {
  month: number;
  year: number;
  onChange: (month: number, year: number) => void;
  onClose: () => void;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function MonthSelector({ month, year, onChange, onClose }: MonthSelectorProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleBackdrop = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  }, [onClose]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const goPrev = () => {
    if (month === 0) onChange(11, year - 1);
    else onChange(month - 1, year);
  };

  const goNext = () => {
    if (month === 11) onChange(0, year + 1);
    else onChange(month + 1, year);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60" onClick={handleBackdrop}>
      <div
        ref={modalRef}
        className="w-full max-w-md bg-[#1A1A1A] rounded-t-3xl border-t border-[#2E2E2E] px-6 pt-4 pb-8 animate-slide-up"
      >
        <div className="w-10 h-1 rounded-full bg-[#3E3E3E] mx-auto mb-5" />
        <p className="text-sm font-semibold text-[#888888] uppercase tracking-wider mb-4">Select Month</p>

        <div className="flex items-center justify-between mb-6">
          <button type="button" onClick={goPrev} className="w-10 h-10 rounded-xl bg-[#242424] flex items-center justify-center hover:bg-[#2E2E2E] transition-colors text-white">
            ←
          </button>
          <p className="text-lg font-bold text-white">{MONTHS[month]} {year}</p>
          <button type="button" onClick={goNext} className="w-10 h-10 rounded-xl bg-[#242424] flex items-center justify-center hover:bg-[#2E2E2E] transition-colors text-white">
            →
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {MONTHS.map((name, i) => {
            const active = i === month;
            return (
              <button
                key={i}
                type="button"
                onClick={() => { onChange(i, year); onClose(); }}
                className={`py-3 rounded-xl text-sm font-semibold transition-all ${
                  active ? "bg-[#FF6B00] text-white shadow-lg shadow-orange-500/20" : "bg-[#242424] text-[#888888] hover:bg-[#2E2E2E] hover:text-white"
                }`}
              >
                {name}
              </button>
            );
          })}
        </div>

        <div className="flex justify-center mt-5">
          <button
            type="button"
            onClick={() => {
              const d = new Date();
              onChange(d.getMonth(), d.getFullYear());
              onClose();
            }}
            className="text-sm text-[#FF6B00] font-semibold hover:underline"
          >
            Jump to Today
          </button>
        </div>
      </div>
    </div>
  );
}
