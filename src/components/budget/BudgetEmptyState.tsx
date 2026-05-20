"use client";

import { Card, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";

interface BudgetEmptyStateProps {
  title?: string;
  subtitle?: string;
  onAction?: () => void;
  actionLabel?: string;
  onClose?: () => void;
}

export function BudgetEmptyState({ title = "Nothing here yet", subtitle = "Start by adding your first budget category", onAction, actionLabel = "Add Category", onClose }: BudgetEmptyStateProps) {
  return (
    <Card className="bg-card border-border">
      <CardContent className="flex flex-col items-center justify-center py-20 px-6 text-center relative">
        <div className="w-14 h-14 rounded-2xl bg-[#141416] border border-[rgba(255,255,255,0.06)] flex items-center justify-center mb-4"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-white/30"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 8h18M7 12h3"/></svg></div>
        <p className="text-[#F5F5F5] font-semibold text-base mb-1">{title}</p>
        <p className="text-[#8A8A90] text-sm mb-6 max-w-xs">{subtitle}</p>
        {onAction && (
          <button type="button" onClick={onAction} className="bg-[#FF6B00] text-white font-semibold px-6 py-3 rounded-xl text-sm shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 active:scale-[0.97] transition-all">
            {actionLabel}
          </button>
        )}
        {onClose && (
          <button type="button" onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-[#1C1C1F] flex items-center justify-center hover:bg-[#222226] transition-colors">
            <X size={16} className="text-[#8A8A90]" />
          </button>
        )}
      </CardContent>
    </Card>
  );
}
