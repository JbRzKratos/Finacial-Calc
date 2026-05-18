"use client";

import { cn } from "@/lib/utils";

interface WinnerBannerProps {
  winner: "invest" | "repay";
  amount: string;
  className?: string;
}

export function WinnerBanner({ winner, amount, className }: WinnerBannerProps) {
  const isInvest = winner === "invest";
  return (
    <div className={cn(
      "p-6 text-center animate-banner-reveal",
      isInvest ? "bg-brand-primary text-white" : "bg-[#1A1A1A] text-white dark:bg-[#2A2A2A] dark:text-white",
      className
    )}>
      <p className="text-lg font-bold mb-1">
        <span className="animate-trophy">{isInvest ? "🏆" : "✅"}</span>{" "}
        {isInvest ? "INVESTING WINS" : "REPAYING WINS"}
      </p>
      <p className="text-[clamp(24px,4vw,36px)] font-extrabold tabular-nums">
        by {amount}
      </p>
    </div>
  );
}
