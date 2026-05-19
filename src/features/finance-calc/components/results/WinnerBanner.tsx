"use client";

import { cn } from "@/lib/utils";

interface WinnerBannerProps {
  investLabel: string;
  loanLabel: string;
  winner: string;
  investHeader?: string;
  loanHeader?: string;
  className?: string;
}

export function WinnerBanner({ investLabel, loanLabel, winner, investHeader = "INVESTMENT VALUE", loanHeader = "LOAN SAVED", className }: WinnerBannerProps) {
  return (
    <div className={cn("p-6 text-center animate-banner-reveal bg-[#1A1A1A] text-white ", className)}>
      <p className="text-lg font-bold mb-1">
        {winner === "INVEST WINS" ? (
          <>?? INVESTING WINS</>
        ) : (
          <>? REPAYING WINS</>
        )}
      </p>
      <div className="grid grid-cols-2 gap-4 mt-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.06em] text-white/60">{investHeader}</p>
          <p className="text-[18px] font-bold">{investLabel}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.06em] text-white/60">{loanHeader}</p>
          <p className="text-[18px] font-bold">{loanLabel}</p>
        </div>
      </div>
    </div>
  );
}
