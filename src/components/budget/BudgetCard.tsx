"use client";

import { memo, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import type { CategoryBreakdown } from "@/lib/budget/budgetTypes";
import { CategoryIcon } from "@/components/budget/CategoryIcon";
import { formatINR } from "@/lib/budget/budgetCalc";

interface BudgetCardProps {
  breakdown: CategoryBreakdown;
  daysLeft: number;
  onClick: () => void;
  onDelete: () => void;
  onEditLimit?: () => void;
  index: number;
}

export const BudgetCard = memo(function BudgetCard({ breakdown, daysLeft, onClick, onDelete, onEditLimit, index }: BudgetCardProps) {
  const { category, spent, percentSpent, status } = breakdown;
  const isOver = status === "over";
  const isWarning = status === "warning";
  const color = isOver ? "#EF4444" : isWarning ? "#FF6B00" : "#22C55E";
  const staggerClass = `card-stagger-${Math.min(index + 1, 4)}`;
  const [showDelete, setShowDelete] = useState(false);

  const handleDeleteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDelete(true);
  }, []);

  const handleConfirmDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
    setShowDelete(false);
  }, [onDelete]);

  const handleCancelDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDelete(false);
  }, []);

  return (
    <Card
      className={`bg-card border-border cursor-pointer active:scale-[0.99] transition-transform ${staggerClass} mb-2.5 relative overflow-hidden`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        {/* Main content */}
        <div className="flex items-center gap-3.5">
          <CategoryIcon icon={category.icon} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[15px] font-semibold text-[#F5F5F5] truncate">{category.name}</p>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onEditLimit?.(); }}
                  className="budget-mono text-sm font-bold hover:opacity-80 transition-opacity active:scale-95"
                  style={{ color }}
                >
                  {formatINR(spent)}
                </button>
                {/* Subtle delete button */}
                <button
                  type="button"
                  onClick={handleDeleteClick}
                  className="w-7 h-7 rounded-lg flex items-center justify-center opacity-40 hover:opacity-100 active:scale-90 transition-all hover:bg-[#EF4444]/10"
                  aria-label="Delete category"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round">
                    <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"/>
                  </svg>
                </button>
              </div>
            </div>
            <p className="text-xs text-[#8A8A90] mt-0.5">
              {daysLeft}d left &bull; {Math.round(percentSpent)}% spent
            </p>
          </div>
        </div>

        {/* Delete confirmation overlay */}
        {showDelete && (
          <div className="absolute inset-0 bg-[#0A0A0C]/95 backdrop-blur-sm flex items-center justify-center gap-3 z-10 rounded-2xl">
            <span className="text-sm text-[#F5F5F5] font-medium">Delete {category.name}?</span>
            <button
              type="button"
              onClick={handleConfirmDelete}
              className="px-4 py-2 rounded-xl bg-[#EF4444] text-white text-xs font-bold hover:opacity-90 active:scale-95 transition-all"
            >
              Delete
            </button>
            <button
              type="button"
              onClick={handleCancelDelete}
              className="px-4 py-2 rounded-xl bg-[#1C1C1F] text-[#8A8A90] text-xs font-bold hover:bg-[#222226] active:scale-95 transition-all"
            >
              Cancel
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
});
