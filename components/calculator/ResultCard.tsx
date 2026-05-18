"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";

interface Metric {
  label: string;
  value: string;
  variant?: "default" | "positive" | "negative" | "accent";
}

interface ResultCardProps {
  heroLabel: string;
  heroValue: string;
  heroVariant?: "positive" | "negative" | "accent";
  metrics: Metric[];
  summary: string;
}

function AnimatedNumber({ value, duration = 800 }: { value: string; duration?: number }) {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(0);

  useEffect(() => {
    const raw = value.replace(/[₹,L,Cr,\s]/g, "");
    const num = parseFloat(raw) || 0;
    const start = prevRef.current;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (num - start) * eased);
      const formatted = "₹" + current.toLocaleString("en-IN");
      setDisplay(formatted);
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
    prevRef.current = num;
  }, [value, duration]);

  return <>{display}</>;
}

export function ResultCard({ heroLabel, heroValue, heroVariant = "accent", metrics, summary }: ResultCardProps) {
  return (
    <Card className="p-6 space-y-4">
      <p className="text-sm font-medium text-muted-foreground">{heroLabel}</p>
      <p className={`fluid-hero font-extrabold tabular-nums ${
        heroVariant === "positive" ? "text-calc-positive" :
        heroVariant === "negative" ? "text-calc-negative" :
        "text-calc-accent"
      }`}>
        <AnimatedNumber value={heroValue} />
      </p>
      <div className="border-t pt-4">
        <div className="grid grid-cols-3 gap-3">
          {metrics.map((m, i) => (
            <div key={i} className="text-center">
              <p className="text-[11px] font-medium text-muted-foreground">{m.label}</p>
              <p className={`text-lg font-semibold tabular-nums ${
                m.variant === "positive" ? "text-calc-positive" :
                m.variant === "negative" ? "text-calc-negative" :
                m.variant === "accent" ? "text-calc-accent" : ""
              }`}>{m.value}</p>
            </div>
          ))}
        </div>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{summary}</p>
    </Card>
  );
}
