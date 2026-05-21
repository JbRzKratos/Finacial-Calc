"use client";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InputRowField {
  value: number;
  onChange: (value: string) => void;
  label: string;
  suffix?: string;
}

interface InputRowProps {
  fields: InputRowField[];
  className?: string;
}

export function InputRow({ fields, className }: InputRowProps) {
  return (
    <div className={cn("flex gap-3", className)}>
      {fields.map((field, i) => (
        <div key={`${field.label}-${i}`} className="flex-1 flex flex-col gap-1.5">
          <Label className="text-[10px] font-semibold tracking-[0.12em] text-white/40 uppercase">
            {field.label}
          </Label>
          <div className="relative">
            <Input
              type="number"
              value={field.value || ""}
              onChange={(e) => field.onChange(e.target.value)}
              onFocus={(e) => e.target.select()}
              className="bg-white/[0.06] border-white/[0.1] rounded-xl text-white font-mono text-base font-semibold text-center h-12 focus:border-orange-500/50 focus:ring-orange-500/10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            {field.suffix && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-white/30">
                {field.suffix}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
