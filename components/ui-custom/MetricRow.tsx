import { memo } from "react";
import { cn } from "@/lib/utils";

interface MetricRowProps {
  label: string;
  value: string;
  variant?: "default" | "positive" | "negative" | "accent";
  className?: string;
  index?: number;
}

function MetricRowInner({ label, value, variant = "default", className, index = 0 }: MetricRowProps) {
  const valueClass = variant === "positive" ? "text-brand-positive" :
    variant === "negative" ? "text-brand-negative" :
    variant === "accent" ? "text-brand-primary" : "text-brand-black dark:text-white";
  return (
    <div
      className={cn("animate-metric", className)}
      style={{ animationDelay: `${Math.min(index, 8) * 50}ms` }}
    >
      <hr className="border-t border-brand-gray-mid dark:border-white/10 m-0" />
      <div className="flex justify-between items-center py-3">
        <span className="text-[13px] text-brand-gray-text font-normal">{label}</span>
        <span className={cn("text-[15px] font-bold tabular-nums", valueClass)}>{value}</span>
      </div>
    </div>
  );
}

export const MetricRow = memo(MetricRowInner);
