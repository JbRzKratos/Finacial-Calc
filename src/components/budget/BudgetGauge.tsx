"use client";

import { useEffect, useRef } from "react";

interface BudgetGaugeProps {
  percentSpent: number;
  totalSpent: number;
  totalRemaining: number;
  totalLimit: number;
}

export function BudgetGauge({ percentSpent, totalSpent, totalRemaining, totalLimit }: BudgetGaugeProps) {
  const circRef = useRef<SVGCircleElement>(null);
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(100, percentSpent);
  const offset = circumference * (1 - pct / 100);

  const color = pct >= 100 ? "#EF4444" : pct >= 75 ? "#FF6B00" : "#22C55E";

  useEffect(() => {
    if (circRef.current) {
      circRef.current.style.transition = "stroke-dashoffset 0.8s ease-out";
      circRef.current.style.strokeDashoffset = String(offset);
    }
  }, [offset]);

  const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);

  const svgSize = "clamp(160px, 50vw, 200px)";

  return (
    <div className="flex flex-col items-center py-4">
      <svg width={svgSize} height={svgSize} viewBox="0 0 200 200" style={{ maxWidth: "100%" }}>
        {/* Track */}
        <circle cx="100" cy="100" r={radius} fill="none" stroke="#1C1C1F" strokeWidth="16" />
        {/* Progress */}
        <circle
          ref={circRef}
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          transform="rotate(-90, 100, 100)"
        />
        {/* Center text */}
        <text x="100" y="92" textAnchor="middle" fill="#F5F5F5" fontFamily="DM Mono, monospace" fontSize="24" fontWeight="700">
          {fmt(totalRemaining)}
        </text>
        <text x="100" y="116" textAnchor="middle" fill="#8A8A90" fontFamily="DM Sans, sans-serif" fontSize="11">
          left this month
        </text>
      </svg>
      <div className="flex gap-3 mt-3 flex-wrap justify-center">
        <div className="rounded-full bg-[rgba(239,68,68,0.12)] px-3.5 py-1.5 text-xs font-medium touch-target">
          <span className="font-mono text-[#EF4444]">{fmt(totalSpent)}</span>
          <span className="text-[#8A8A90] ml-1">spent</span>
        </div>
        <div className="rounded-full bg-[rgba(34,197,94,0.12)] px-3.5 py-1.5 text-xs font-medium touch-target">
          <span className="font-mono text-[#22C55E]">{fmt(totalLimit)}</span>
          <span className="text-[#8A8A90] ml-1">budget</span>
        </div>
      </div>
    </div>
  );
}
