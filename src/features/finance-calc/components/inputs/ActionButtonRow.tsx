"use client";

import { useState, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { useMobileResults } from "@/features/finance-calc/contexts/MobileResultsContext";

interface ActionButtonRowProps {
  onClear: () => void;
  calculateLabel?: string;
}

export function ActionButtonRow({ onClear, calculateLabel = "CALCULATE" }: ActionButtonRowProps) {
  const [loading, setLoading] = useState(false);
  const { setShowMobileResults } = useMobileResults();

  const handleCalculate = useCallback(async () => {
    if (typeof window === "undefined") return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 300));
    setLoading(false);
    if (window.innerWidth < 768) {
      setShowMobileResults(true);
    } else {
      const el = document.getElementById("results");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [setShowMobileResults]);

  return (
    <div className="flex gap-3 items-center mt-6">
      <button
        type="button"
        onClick={onClear}
        className="btn-clear ripple-btn h-12 px-6 border-2 border-white/60 bg-transparent text-white text-[13px] font-bold tracking-[0.08em] uppercase cursor-pointer whitespace-nowrap min-w-[90px] min-h-[48px]"
      >
        CLEAR
      </button>
      <button
        type="button"
        onClick={handleCalculate}
        disabled={loading}
        className="btn-calculate h-12 flex-1 border-0 bg-[#1A1A1A] text-white text-[13px] font-bold tracking-[0.08em] uppercase cursor-pointer flex items-center justify-center gap-2 min-h-[52px]"
        style={loading ? { opacity: 0.85, pointerEvents: "none" as const } : {}}
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin-slow" />
            CALCULATING...
          </>
        ) : (
          calculateLabel
        )}
      </button>
    </div>
  );
}
