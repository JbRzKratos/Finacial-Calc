import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MetricBadgeProps {
  label: string;
  value: string;
  variant?: "default" | "positive" | "negative" | "accent";
}

export function MetricBadge({ label, value, variant = "default" }: MetricBadgeProps) {
  return (
    <div className="flex flex-col items-center p-3 rounded-lg bg-muted/50">
      <span className="text-[11px] font-medium text-muted-foreground mb-1">{label}</span>
      <span
        className={cn(
          "text-lg font-semibold tabular-nums",
          variant === "positive" && "text-calc-positive",
          variant === "negative" && "text-calc-negative",
          variant === "accent" && "text-calc-accent",
          variant === "default" && "text-foreground"
        )}
      >
        {value}
      </span>
    </div>
  );
}
