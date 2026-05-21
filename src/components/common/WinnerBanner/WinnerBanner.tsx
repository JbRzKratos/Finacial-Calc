"use client";

interface WinnerBannerProps {
  winner: "invest" | "repay";
  difference: string;
  investValue: string;
  repayValue: string;
}

export function WinnerBanner({ winner, difference, investValue, repayValue }: WinnerBannerProps) {
  return (
    <div className="calc-card !p-0 overflow-hidden animate-banner-reveal mt-4">
      <div className="p-4 text-center border-b border-white/[0.06]">
        <span className="inline-block text-2xl mb-1 animate-trophy">{winner === "invest" ? "🏆" : "✅"}</span>
        <p className="text-sm font-bold text-white/85">
          {winner === "invest" ? "Investing wins" : "Repaying wins"} by {difference}
        </p>
      </div>
      <div className="flex gap-4 p-4">
        <div className="flex-1 text-center">
          <p className="text-[10px] font-semibold tracking-[0.06em] text-white/40 uppercase mb-1">Investment Value</p>
          <p className="text-sm font-bold font-mono text-orange-500">{investValue}</p>
        </div>
        <div className="w-px bg-white/[0.06]" />
        <div className="flex-1 text-center">
          <p className="text-[10px] font-semibold tracking-[0.06em] text-white/40 uppercase mb-1">Repayment Cost</p>
          <p className="text-sm font-bold font-mono text-white/60">{repayValue}</p>
        </div>
      </div>
    </div>
  );
}
