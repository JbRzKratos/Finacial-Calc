"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ResultHeroProps {
  value: string;
  subtitle: string;
  variant?: "default" | "positive" | "negative";
  className?: string;
  showEmptyState?: boolean;
}

function AnimatedHero({ value }: { value: string }) {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(0);
  const isMobile = typeof navigator !== "undefined" && navigator.maxTouchPoints > 0;
  const duration = isMobile ? 500 : 700;

  useEffect(() => {
    const unit = value.endsWith(" Cr") ? " Cr" : value.endsWith(" L") ? " L" : value.endsWith("%") ? "%" : "";
    const raw = value.replace(/[?,L,Cr,%,\s]/g, "");
    const num = parseFloat(raw) || 0;
    const start = prevRef.current;
    if (Math.abs(num - start) < 0.5) {
      setDisplay(value);
      prevRef.current = num;
      return;
    }
    const startTime = performance.now();
    const raf = requestAnimationFrame(function tick(now) {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      const cur = Math.round(start + (num - start) * eased);
      const prefix = value.startsWith("?") ? "?" : "";
      setDisplay(prefix + cur.toLocaleString("en-IN") + unit);
      if (t < 1) requestAnimationFrame(tick);
    });
    prevRef.current = num;
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return <>{display}</>;
}

export function ResultHero({ value, subtitle, variant = "default", className, showEmptyState }: ResultHeroProps) {
  if (showEmptyState) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📊</div>
        <div className="empty-state-title">Enter your details and hit Calculate</div>
        <div className="empty-state-sub">Your results will appear here</div>
      </div>
    );
  }

  return (
    <div className={cn("relative rounded-2xl bg-white p-6 border border-[rgba(255,107,0,0.06)] shadow-[0_2px_24px_rgba(255,107,0,0.04)]", className)}>
      <div className="animate-result-pop">
        <p className={cn("text-[clamp(30px,9vw,44px)] sm:text-[clamp(36px,6vw,64px)] font-extrabold leading-none tabular-nums tracking-[-0.03em]",
          variant === "positive" ? "text-brand-positive" :
          variant === "negative" ? "text-brand-negative" : "text-brand-black"
        )}>
          <AnimatedHero value={value} />
        </p>
        <p className="text-[13px] text-brand-gray-text mt-2 font-normal">{subtitle}</p>
      </div>
    </div>
  );
}
