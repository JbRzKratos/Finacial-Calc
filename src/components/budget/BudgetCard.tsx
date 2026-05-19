"use client";

import { memo, useRef, useCallback } from "react";
import type { CategoryBreakdown } from "@/lib/budget/budgetTypes";
import { CategoryIcon } from "@/components/budget/CategoryIcon";
import { formatINR } from "@/lib/budget/budgetCalc";

interface BudgetCardProps {
  breakdown: CategoryBreakdown;
  daysLeft: number;
  onClick: () => void;
  onDelete: () => void;
  index: number;
}

export const BudgetCard = memo(function BudgetCard({ breakdown, daysLeft, onClick, onDelete, index }: BudgetCardProps) {
  const { category, spent, percentSpent, status } = breakdown;
  const cardRef = useRef<HTMLDivElement>(null);
  const deleteBtnRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const isOver = status === "over";
  const isWarning = status === "warning";
  const color = isOver ? "#EF4444" : isWarning ? "#FF6B00" : "#22C55E";
  const label = isOver ? "over budget" : isWarning ? "at limit" : "under this month";
  const staggerClass = `card-stagger-${Math.min(index + 1, 4)}`;

  const handleTouchStart = useCallback((e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; }, []);
  const handleTouchEnd = useCallback(() => {
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50 && deleteBtnRef.current) {
      deleteBtnRef.current.classList.remove("opacity-0", "pointer-events-none");
      deleteBtnRef.current.classList.add("opacity-100");
    }
  }, []);

  return (
    <div className={`relative mb-2.5 ${staggerClass}`}>
      <div
        ref={cardRef}
        className="glass-card p-4 flex items-center gap-3.5 cursor-pointer active:scale-[0.99] transition-transform"
        onClick={onClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <CategoryIcon icon={category.icon} color={category.color} />
        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-[15px] font-semibold text-[#F5F5F5]">{category.name}</p>
            <p className={`budget-mono text-sm font-bold`} style={{ color }}>{formatINR(spent)}</p>
          </div>
          <p className="text-xs text-[#8A8A90] mt-0.5">
            {daysLeft}d left &bull; {Math.round(percentSpent)}% spent
          </p>
        </div>
      </div>
      {/* Progress bar */}
      <div className="h-1 rounded-full bg-[#1C1C1F] mx-4 mb-3 overflow-hidden" style={{ marginTop: -8 }}>
        <div
          className="h-full rounded-full animate-progress"
          style={{ width: `${Math.min(100, percentSpent)}%`, background: color, "--pct": `${Math.min(100, percentSpent)}%` } as React.CSSProperties}
        />
      </div>
      {/* Delete */}
      <button
        ref={deleteBtnRef}
        type="button"
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-[#EF4444]/20 flex items-center justify-center opacity-0 pointer-events-none hover:bg-[#EF4444]/30 transition-all"
        aria-label="Delete category"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round">
          <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"/>
        </svg>
      </button>
    </div>
  );
});
