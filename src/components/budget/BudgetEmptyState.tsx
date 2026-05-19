"use client";

import { X } from "lucide-react";

interface BudgetEmptyStateProps {
  title?: string;
  subtitle?: string;
  onAction?: () => void;
  actionLabel?: string;
  onClose?: () => void;
}

export function BudgetEmptyState({
  title = "Nothing here yet",
  subtitle = "Start by adding your first budget category",
  onAction,
  actionLabel = "Add Category",
  onClose,
}: BudgetEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#242424] border border-[#2E2E2E] flex items-center justify-center mb-4 text-3xl">
        📭
      </div>
      <p className="text-white text-lg font-semibold mb-1">{title}</p>
      <p className="text-[#888888] text-sm mb-6 max-w-xs">{subtitle}</p>
      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="bg-[#FF6B00] text-white font-semibold px-6 py-3 rounded-xl text-sm shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 active:scale-[0.97] transition-all"
        >
          {actionLabel}
        </button>
      )}
      {onClose && (
        <button type="button" onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-[#2E2E2E] flex items-center justify-center hover:bg-[#3E3E3E] transition-colors">
          <X size={16} className="text-[#888888]" />
        </button>
      )}
    </div>
  );
}
