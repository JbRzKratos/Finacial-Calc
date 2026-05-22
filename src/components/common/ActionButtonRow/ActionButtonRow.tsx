
import { memo } from "react";
import { Button } from "@/components/ui/button";
import { useMobileResults } from "@/contexts/MobileResultsContext";

interface ActionButtonRowProps {
  onClear: () => void;
}

function ActionButtonRowInner({ onClear }: ActionButtonRowProps) {
  const { setShowMobileResults } = useMobileResults();

  return (
    <div className="action-btn-row">
      <Button
        onClick={() => setShowMobileResults(true)}
        className="calc-btn bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
      >
        Calculate
      </Button>
      <Button
        variant="outline"
        onClick={onClear}
        className="clear-btn border-white/[0.15] text-white/60 hover:text-white/80 hover:bg-white/5"
      >
        Clear
      </Button>
    </div>
  );
}

export const ActionButtonRow = memo(ActionButtonRowInner);
ActionButtonRow.displayName = 'ActionButtonRow';
