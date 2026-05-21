"use client";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InputRowField {
  value: number;
  onChange: (value: string) => void;
  label: string;
  suffix?: string;
  step?: number;
}

interface InputRowProps {
  fields: InputRowField[];
  className?: string;
}

export function InputRow({ fields, className }: InputRowProps) {
  const stepVal = (field: InputRowField, dir: number) => {
    const step = field.step || 1;
    const newVal = field.value + dir * step;
    field.onChange(String(newVal));
  };

  return (
    <div className={cn("flex gap-3", className)}>
      {fields.map((field, i) => {
        const id = `calc-${field.label.toLowerCase().replace(/\s+/g, '-')}-${i}`;
        const hasStep = field.step !== undefined;
        return (
          <div key={`${field.label}-${i}`} className="flex-1 flex flex-col gap-1.5">
            <Label htmlFor={id} className="text-[10px] font-semibold tracking-[0.12em] text-white/40 uppercase">
              {field.label}
            </Label>
            <div className="relative flex items-center gap-0.5">
              {hasStep && (
                <button
                  type="button"
                  onClick={() => stepVal(field, -1)}
                  className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/[0.06] text-white/40 hover:text-white hover:bg-white/[0.12] transition-all shrink-0"
                  aria-label={`Decrease ${field.label.toLowerCase()}`}
                  tabIndex={-1}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                    <path d="M5 12h14"/>
                  </svg>
                </button>
              )}
              <div className="relative flex-1">
                <Input
                  id={id}
                  type="number"
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  onFocus={(e) => e.target.select()}
                  className="bg-white/[0.06] border-white/[0.1] rounded-xl text-white font-mono text-base font-semibold text-center h-12 focus:border-orange-500/50 focus:ring-orange-500/10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                {field.suffix && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-white/30 pointer-events-none">
                    {field.suffix}
                  </span>
                )}
              </div>
              {hasStep && (
                <button
                  type="button"
                  onClick={() => stepVal(field, 1)}
                  className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/[0.06] text-white/40 hover:text-white hover:bg-white/[0.12] transition-all shrink-0"
                  aria-label={`Increase ${field.label.toLowerCase()}`}
                  tabIndex={-1}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
