"use client";

import { memo, useRef, useCallback } from "react";
import type { CategoryBreakdown } from "@/lib/budget/budgetTypes";
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
  const touchStartX = useRef(0);
  const touchCurrentX = useRef(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const deleteRef = useRef<HTMLButtonElement>(null);

  const statusLabel = status === "over" ? "over budget!" : status === "warning" ? "at limit" : "under this month";
  const statusColor = status === "over" ? "#dc2626" : status === "warning" ? "#d97706" : "#16a34a";

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchCurrentX.current = e.touches[0].clientX;
    const diff = touchStartX.current - touchCurrentX.current;
    if (diff > 0 && cardRef.current) {
      cardRef.current.style.transform = `translateX(-${Math.min(diff, 80)}px)`;
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    const diff = touchStartX.current - touchCurrentX.current;
    if (diff > 60 && deleteRef.current) {
      deleteRef.current.style.opacity = "1";
      deleteRef.current.style.pointerEvents = "auto";
    }
    if (cardRef.current) {
      cardRef.current.style.transform = "";
    }
  }, []);

  const animDelay = `${index * 80}ms`;

  return (
    <div
      className="relative mb-2.5"
      style={{ animation: `cardSlideUp 0.4s cubic-bezier(0.22,1,0.36,1) ${animDelay} both` }}
    >
      <div
        ref={cardRef}
        className="relative overflow-hidden rounded-2xl bg-[#242424] border border-[#2E2E2E] active:scale-[0.98] transition-transform duration-150"
        onClick={onClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex items-center gap-3.5 p-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
            style={{ background: category.iconBg }}
          >
            {category.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-semibold text-white truncate">{category.name}</p>
            <p className="text-xs text-[#888888] mt-0.5">
              {daysLeft}d left &bull; {Math.round(percentSpent)}% spent
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xl font-bold text-white" style={{ color: statusColor }}>
              {formatINR(spent)}
            </p>
            <p className="text-[11px] text-[#888888]">{statusLabel}</p>
          </div>
        </div>
        <div className="h-[3px] bg-[#3E3E3E] mx-4 mb-3 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-800"
            style={{ width: `${Math.min(100, percentSpent)}%`, background: statusColor, transition: "width 0.8s cubic-bezier(0.22,1,0.36,1)" }}
          />
        </div>
      </div>
      <button
        ref={deleteRef}
        type="button"
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        className="absolute right-0 top-0 bottom-0 w-20 rounded-2xl bg-[#dc2626] text-white text-xs font-bold uppercase tracking-wider opacity-0 pointer-events-none transition-opacity duration-200"
        style={{ zIndex: 10 }}
      >
        Delete
      </button>
    </div>
  );
});
