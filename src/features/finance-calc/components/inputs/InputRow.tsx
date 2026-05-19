"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

interface InputRowProps {
  fields: {
    value: string | number;
    onChange?: (value: string) => void;
    placeholder?: string;
    label: string;
    suffix?: string;
  }[];
  className?: string;
}

export function InputRow({ fields, className }: InputRowProps) {
  const uid = useId();
  const isThree = fields.length === 3;
  return (
    <div className={cn("grid gap-3", isThree ? "input-row-3" : "", className)}
      style={!isThree ? { gridTemplateColumns: "repeat(" + fields.length + ", 1fr)" } : {}}
    >
      {fields.map((f, i) => (
        <div className="input-brand" key={uid + "-" + i}>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              value={f.value}
              onChange={(e) => f.onChange?.(e.target.value)}
              placeholder={f.placeholder}
              className={cn( "w-full h-12 rounded-[6px] bg-black/20 border-2 border-white/20 text-white text-[16px] font-semibold tabular-nums min-h-[48px] transition-all duration-200", "focus:border-white/90 focus:bg-black/30 focus:outline-none",
                f.suffix ? "pr-8 text-right" : "px-3 text-center"
              )}
              style={{ WebkitTapHighlightColor: "transparent" }}
            />
            {f.suffix && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 text-[13px] font-semibold pointer-events-none">
                {f.suffix}
              </span>
            )}
          </div>
          <label className="text-[11px] font-semibold uppercase tracking-[0.06em] text-white/70 text-center mt-1.5 block transition-colors duration-200">
            {f.label}
          </label>
        </div>
      ))}
    </div>
  );
}
