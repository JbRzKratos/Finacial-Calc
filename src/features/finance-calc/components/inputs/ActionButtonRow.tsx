"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { useMobileResults } from "@/features/finance-calc/contexts/MobileResultsContext";

interface ActionButtonRowProps {
  onClear: () => void;
}

export function ActionButtonRow({ onClear }: ActionButtonRowProps) {
  const { setShowMobileResults } = useMobileResults();

  return (
    <div className="flex gap-3 mt-6">
      <Button
        onClick={() => setShowMobileResults(true)}
        className="flex-1 h-12 bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-black font-bold rounded-xl text-sm"
      >
        Calculate
      </Button>
      <Button
        variant="outline"
        onClick={onClear}
        className="h-12 px-5 border-white/[0.15] text-white/60 hover:text-white/80 hover:bg-white/5 rounded-xl text-xs font-semibold"
      >
        Clear
      </Button>
    </div>
  );
}
