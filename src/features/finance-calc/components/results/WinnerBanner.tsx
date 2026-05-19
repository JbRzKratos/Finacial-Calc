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
    <div className={cn("relative p-6 text-center animate-banner-reveal rounded-2xl bg-gradient-to-br from-[#1C1C1F] to-[#1A1A1A]", className)}>
      <div className="absolute inset-0 rounded-2xl p-px bg-gradient-to-br from-[rgba(255,107,0,0.2)] via-transparent to-[rgba(34,197,94,0.15)] pointer-events-none" style={{ WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude" }} />
      <p className="text-lg font-bold mb-1 text-white">
        {winner === "INVEST WINS" ? (
          <>INVESTING WINS</>
        ) : (
          <>REPAYING WINS</>
        )}
      </p>
      <div className="grid grid-cols-2 gap-4 mt-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.06em] text-white/60">{investHeader}</p>
          <p className="text-[18px] font-bold text-white">{investLabel}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.06em] text-white/60">{loanHeader}</p>
          <p className="text-[18px] font-bold text-white">{loanLabel}</p>
        </div>
      </div>
    </div>
  );
}
