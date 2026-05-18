"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { CalcIcon } from "@/components/shared/CalcIcon";

const primaryTabs = [
  { id: "sip", icon: "💰", label: "SIP" },
  { id: "emi", icon: "🏦", label: "EMI" },
  { id: "fd", icon: "🏛️", label: "FD" },
  { id: "cagr", icon: "📊", label: "CAGR" },
];

const moreItems = [
  { id: "retirement", icon: "🎯", label: "Retirement" },
  { id: "tax", icon: "💸", label: "Tax Saver" },
  { id: "loanvsinvest", icon: "⚖️", label: "Loan vs Invest" },
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const current = pathname.split("/").filter(Boolean).pop() || "sip";
  const [sheetOpen, setSheetOpen] = useState(false);

  const navigate = (id: string) => {
    setSheetOpen(false);
    router.push(`/calculator/${id}`);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-16 pb-[env(safe-area-inset-bottom)] bg-background border-t flex items-center">
      {primaryTabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => navigate(tab.id)}
          className={cn(
            "flex-1 flex flex-col items-center justify-center gap-0.5 h-full text-[11px] font-medium transition-colors",
            current === tab.id ? "text-calc-accent" : "text-muted-foreground"
          )}
        >
          <CalcIcon name={tab.icon} className="w-5 h-5" />
          <span>{tab.label}</span>
        </button>
      ))}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <button
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-0.5 h-full text-[11px] font-medium transition-colors",
              moreItems.some(m => m.id === current) ? "text-calc-accent" : "text-muted-foreground"
            )}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
            <span>More</span>
          </button>
        </SheetTrigger>
        <SheetContent side="bottom" className="pb-[env(safe-area-inset-bottom)]">
          <SheetTitle className="sr-only">More Calculators</SheetTitle>
          <div className="pt-2 pb-4 space-y-1">
            {moreItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left",
                  current === item.id ? "bg-calc-accent-bg text-calc-accent" : "text-foreground hover:bg-muted"
                )}
              >
                <CalcIcon name={item.icon} className="w-5 h-5 shrink-0" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
}
