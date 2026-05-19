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
    variant === "accent" ? "text-brand-primary" : "text-brand-black";
  return (
    <div
      className={cn("animate-metric", className)}
      style={{ animationDelay: (Math.min(index, 8) * 50) + "ms" }}
    >
      <div className="flex justify-between items-center py-3 px-1">
        <span className="text-[13px] text-brand-gray-text font-normal">{label}</span>
        <span className={cn("text-[15px] font-bold tabular-nums tracking-[-0.01em]", valueClass)}>{value}</span>
      </div>
      {index < 7 && (
        <hr className="border-0 h-px bg-gradient-to-r from-brand-gray-mid via-brand-gray-mid to-transparent opacity-60" />
      )}
    </div>
  );
}

export const MetricRow = memo(MetricRowInner);
