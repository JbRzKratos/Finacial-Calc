"use client";

import { cn } from "@/lib/utils";

interface ToggleOption {
  value: string;
  label: string;
}

interface ToggleGroupProps {
  options: ToggleOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function ToggleGroup({ options, value, onChange, className }: ToggleGroupProps) {
  const isFour = options.length === 4;
  return (
    <div className={cn("flex flex-wrap gap-2 w-full", isFour ? "toggle-group-4" : "", className)}>
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn( "ripple-btn h-11 px-2.5 text-[12px] font-bold uppercase tracking-[0.04em] cursor-pointer flex-1 min-w-[90px] whitespace-normal min-h-[48px] flex items-center justify-center text-center",
               selected
                  ? "toggle-selected bg-[#1A1A1A] text-white border-2 border-[#1A1A1A]"
                  : "toggle-unselected bg-white/[0.04] text-white/80 border border-white/[0.08]"
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
