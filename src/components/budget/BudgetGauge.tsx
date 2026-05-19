"use client";

import { useEffect, useRef } from "react";

interface BudgetGaugeProps {
  percentSpent: number;
  totalSpent: number;
  totalRemaining: number;
  totalLimit: number;
}

export function BudgetGauge({ percentSpent, totalSpent, totalRemaining, totalLimit }: BudgetGaugeProps) {
  const radius = 120;
  const circumference = Math.PI * radius;
  const offset = circumference * (1 - Math.min(100, percentSpent) / 100);
  const pathRef = useRef<SVGPathElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);

  const gaugeColor =
    percentSpent >= 100 ? "#dc2626" : percentSpent >= 75 ? "#d97706" : "#FF6B00";

  useEffect(() => {
    if (pathRef.current) {
      pathRef.current.style.transition = "stroke-dashoffset 1.2s cubic-bezier(0.22,1,0.36,1)";
      pathRef.current.style.strokeDashoffset = String(offset);
    }
  }, [offset]);

  const formatINR = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);

  return (
    <div className="flex flex-col items-center w-full max-w-[min(340px,90vw)] mx-auto">
      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#888888] mb-1">
        Overall Spent: {Math.round(percentSpent)}%
      </p>
      <svg viewBox="0 0 300 170" className="w-full h-auto" style={{ overflow: "visible" }}>
        <g transform="rotate(180, 150, 150) translate(0, 0)">
          <path
            d={`M 30 150 A 120 120 0 0 1 270 150`}
            fill="none"
            stroke="#2E2E2E"
            strokeWidth="24"
            strokeLinecap="round"
          />
          <path
            ref={pathRef}
            d={`M 30 150 A 120 120 0 0 1 270 150`}
            fill="none"
            stroke={gaugeColor}
            strokeWidth="24"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.22,1,0.36,1)" }}
          />
        </g>
        <text x="150" y="95" textAnchor="middle" fill="#FFFFFF" fontSize="28" fontWeight="800">
          {formatINR(totalRemaining)}
        </text>
        <text x="150" y="118" textAnchor="middle" fill="#888888" fontSize="13">
          left this month
        </text>
      </svg>
      <div className="flex justify-between w-full px-2 mt-1">
        <span className="text-xs text-[#666666]">{formatINR(totalSpent)}</span>
        <span className="text-xs text-[#666666]">{formatINR(totalLimit)}</span>
      </div>
    </div>
  );
}
