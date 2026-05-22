
import { memo, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface MetricRowProps {
  label: string;
  value: string;
  variant?: "default" | "positive" | "negative" | "accent";
  index?: number;
}

function MetricRowInner({ label, value, variant = "default", index = 0 }: MetricRowProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.animationDelay = (index * 60) + "ms";
    }
  }, [index]);

  return (
    <div
      ref={ref}
      className="animate-metric flex justify-between items-center py-2.5 px-3 rounded-xl hover:bg-white/[0.02] transition-colors"
    >
      <span className="text-xs font-semibold tracking-[0.06em] text-white/40 uppercase">{label}</span>
      <span
        className={cn(
          "text-sm font-bold font-mono tabular-nums",
          variant === "default" && "text-white/70",
          variant === "positive" && "text-[#16a34a]",
          variant === "negative" && "text-[#dc2626]",
          variant === "accent" && "text-primary"
        )}
      >
        {value}
      </span>
    </div>
  );
}

export const MetricRow = memo(MetricRowInner);
MetricRow.displayName = 'MetricRow';
