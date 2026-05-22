
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface SegmentedResultSegments {
  value: string;
  label: string;
}

interface SegmentedResultProps {
  segments: SegmentedResultSegments[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SegmentedResult({ segments, value, onChange, className }: SegmentedResultProps) {
  return (
    <div className={cn("flex bg-white/[0.03] border border-white/[0.06] rounded-2xl p-1 w-max", className)}>
      {segments.map((seg) => {
        const active = seg.value === value;
        return (
          <Button
            key={seg.value}
            type="button"
            variant="ghost"
            onClick={() => onChange(seg.value)}
            className={cn(
              "px-4 py-2 text-xs font-semibold tracking-[0.04em]",
              active
                ? "seg-selected bg-primary/10 text-primary border border-primary/30"
                : "seg-unselected text-white/40 hover:text-white/70"
            )}
            style={{
              borderRadius: "12px",
            }}
          >
            {seg.label}
          </Button>
        );
      })}
    </div>
  );
}
