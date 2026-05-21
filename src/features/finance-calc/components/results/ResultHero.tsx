"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ResultHeroProps {
  value: string;
  subtitle: string;
  variant?: "default" | "accent" | "positive" | "negative";
  showEmptyState?: boolean;
}

function animateValue(ref: HTMLSpanElement, start: number, end: number, duration: number) {
  const startTime = performance.now();
  const isFloat = end % 1 !== 0;
  let rafId: number;
  const step = (now: number) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = start + (end - start) * eased;
    if (ref) {
      if (isFloat) {
        ref.textContent = "₹" + current.toFixed(2);
      } else {
        ref.textContent = "₹" + Math.round(current).toLocaleString("en-IN");
      }
    }
    if (progress < 1) rafId = requestAnimationFrame(step);
  };
  rafId = requestAnimationFrame(step);
  return () => cancelAnimationFrame(rafId);
}

function parseValue(value: string): number {
  const cleaned = value.replace(/[₹,\s]/g, "");
  if (cleaned.endsWith("Cr")) return parseFloat(cleaned) * 10000000;
  if (cleaned.endsWith("L")) return parseFloat(cleaned) * 100000;
  return parseFloat(cleaned) || 0;
}

export function ResultHero({ value, subtitle, variant = "default", showEmptyState }: ResultHeroProps) {
  const displayRef = useRef<HTMLSpanElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || showEmptyState || !displayRef.current || !value) return;
    const endVal = parseValue(value);
    const cancel = animateValue(displayRef.current, 0, endVal, 800);
    return cancel;
  }, [value, mounted, showEmptyState]);

  if (showEmptyState) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center empty-state">
        <div className="text-[48px] mb-4 opacity-30">📊</div>
        <div className="text-sm font-semibold text-[#666] mb-1">Adjust the inputs</div>
        <div className="text-xs text-[#666] opacity-70">Results will appear here</div>
      </div>
    );
  }

  return (
    <div className="text-center py-4">
      <span
        ref={displayRef}
        className={cn(
          "block text-[32px] md:text-[36px] font-bold font-mono tabular-nums animate-result-pop",
          variant === "accent" && "text-orange-500",
          variant === "positive" && "text-[#16a34a]",
          variant === "negative" && "text-[#dc2626]",
          variant === "default" && "text-[#FF6B00]"
        )}
      >
        {value || "—"}
      </span>
      <span className="block text-xs font-semibold tracking-[0.08em] text-white/40 uppercase mt-1.5">
        {subtitle}
      </span>
    </div>
  );
}
