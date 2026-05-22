
import { memo } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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

function ToggleGroupInner({ options, value, onChange, className }: ToggleGroupProps) {
  return (
    <div className={cn("flex flex-wrap gap-1.5 justify-center", className)}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <Button
            key={opt.value}
            type="button"
            variant="ghost"
            onClick={() => onChange(opt.value)}
            className={cn("stepup-option-btn", active && "active")}
          >
            {opt.label}
          </Button>
        );
      })}
    </div>
  );
}

export const ToggleGroup = memo(ToggleGroupInner);
ToggleGroup.displayName = 'ToggleGroup';
