"use client";

import { ThemeToggle } from "@/components/shared/ThemeToggle";

const calculatorNames: Record<string, string> = {
  sip: "SIP Calculator",
  emi: "EMI Calculator",
  fd: "FD / RD Calculator",
  cagr: "CAGR Calculator",
  retirement: "Retirement Planner",
  tax: "Tax Calculator",
  loanvsinvest: "Loan vs Invest",
};

interface TopBarProps {
  currentId: string;
}

export function TopBar({ currentId }: TopBarProps) {
  const name = calculatorNames[currentId] || "FinCalc Pro";

  const handleShare = async () => {
    const text = `Calculated with FinCalc Pro: ${name}`;
    if (navigator.share) {
      try { await navigator.share({ text }); } catch {}
    } else {
      try { await navigator.clipboard.writeText(text); } catch {}
    }
  };

  return (
    <header className="md:hidden sticky top-0 z-40 h-14 px-4 flex items-center justify-between bg-background/80 backdrop-blur-sm border-b">
      <h1 className="text-sm font-semibold">{name}</h1>
      <div className="flex items-center gap-0.5">
        <button
          onClick={handleShare}
          className="min-w-11 min-h-11 flex items-center justify-center rounded-md hover:bg-muted transition-colors"
          aria-label="Share"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
        </button>
        <ThemeToggle />
      </div>
    </header>
  );
}
