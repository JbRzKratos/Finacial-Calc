"use client";

import { cn } from "@/lib/utils";

interface Segment {
  value: string;
  label: string;
}

interface SegmentedResultProps {
  segments: Segment[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SegmentedResult({ segments, value, onChange, className }: SegmentedResultProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {segments.map((seg) => {
        const selected = value === seg.value;
        return (
          <button
            key={seg.value}
            type="button"
            onClick={() => onChange(seg.value)}
            className={cn(
              "h-11 text-[12px] font-bold uppercase tracking-[0.06em] px-3 flex-1 min-w-[80px] whitespace-nowrap transition-all duration-200",
              selected
                ? "seg-selected bg-[#1A1A1A] text-white dark:bg-white dark:text-[#1A1A1A]"
                : "seg-unselected bg-brand-gray-light dark:bg-white/10 text-brand-gray-dark dark:text-white/70 border border-brand-gray-mid dark:border-white/20"
            )}
          >
            {seg.label}
          </button>
        );
      })}
    </div>
  );
}
