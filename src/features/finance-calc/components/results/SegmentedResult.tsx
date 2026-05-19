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
    <div className={cn("flex flex-wrap gap-2 p-0.5", className)}>
      {segments.map((seg) => {
        const selected = value === seg.value;
        return (
          <button
            key={seg.value}
            type="button"
            onClick={() => onChange(seg.value)}
            className={cn(
              "h-10 text-[12px] font-bold uppercase tracking-[0.06em] px-4 flex-1 min-w-[80px] whitespace-nowrap transition-all duration-250",
              selected
                ? "seg-selected bg-[#1A1A1A] text-white shadow-[0_4px_16px_rgba(0,0,0,0.25)]"
                : "seg-unselected bg-brand-gray-light text-brand-gray-dark border border-brand-gray-mid"
            )}
          >
            {seg.label}
          </button>
        );
      })}
    </div>
  );
}
