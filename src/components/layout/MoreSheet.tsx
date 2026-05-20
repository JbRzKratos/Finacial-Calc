"use client";

import { useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Calculator,
  PiggyBank,
  Landmark,
  TrendingUp,
  Clock,
  FileText,
  Scale,
  BarChart3,
} from "lucide-react";

interface MoreSheetProps {
  open: boolean;
  onClose: () => void;
}

const tools = [
  { id: "sip", label: "SIP", icon: PiggyBank },
  { id: "emi", label: "EMI", icon: Landmark },
  { id: "fd", label: "FD", icon: TrendingUp },
  { id: "cagr", label: "CAGR", icon: BarChart3 },
  { id: "retirement", label: "Retirement", icon: Clock },
  { id: "tax", label: "Tax", icon: FileText },
  { id: "loanvsinvest", label: "Loan vs Invest", icon: Scale },
];

export function MoreSheet({ open, onClose }: MoreSheetProps) {
  const navigate = useNavigate();

  const handleSelect = (id: string) => {
    navigate(`/calculator/${id}`);
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <SheetContent
        side="bottom"
        className="bg-[#141416] border-t border-white/[0.06] rounded-t-3xl px-5 pb-24 max-h-[70vh]"
      >
        <div className="mx-auto w-9 h-1 bg-white/20 rounded-full mb-4" />
        <SheetHeader className="text-left mb-5">
          <SheetTitle className="text-foreground font-semibold text-lg">
            All Calculators
          </SheetTitle>
        </SheetHeader>
        <div className="grid grid-cols-4 gap-3">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                type="button"
                onClick={() => handleSelect(tool.id)}
                className="more-sheet-btn"
              >
                <div className="more-sheet-btn-icon">
                  <Icon size={20} className="text-white/60" />
                </div>
                <span className="more-sheet-btn-label">{tool.label}</span>
              </button>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
