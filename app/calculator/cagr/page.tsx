"use client";

import { useMemo, useState } from "react";
import { useCalculator } from "@/hooks/useCalculator";
import { formatINR, formatINRFull } from "@/lib/formatter";
import { cagr, ruleOf72 } from "@/lib/math";
import { generateInsights } from "@/lib/insights";
import { SplitShell } from "@/components/layout/SplitShell";
import { InputRow } from "@/components/ui-custom/InputRow";
import { ToggleGroup } from "@/components/ui-custom/ToggleGroup";
import { ActionButtonRow } from "@/components/ui-custom/ActionButtonRow";
import { ResultHero } from "@/components/ui-custom/ResultHero";
import { MetricRow } from "@/components/ui-custom/MetricRow";
import { InsightBanner } from "@/components/ui-custom/InsightBanner";
import { SegmentedResult } from "@/components/ui-custom/SegmentedResult";
import { ResultChart } from "@/components/ui-custom/ResultChart";

const defaultInputs = { initial: 100000, final: 200000, years: 5, benchmark: "nifty" };

const benchmarkMap: Record<string, number> = {
  fd: 7,
  nifty: 12,
  gold: 8,
};

function calcFn(inputs: Record<string, unknown>) {
  const initial = Math.max(1, Number(inputs.initial) || 1);
  const finalVal = Math.max(0, Number(inputs.final) || 0);
  const years = Math.max(1, Number(inputs.years) || 1);
  const cagrVal = cagr(initial, finalVal, years);
  const returns = finalVal - initial;
  const absReturn = initial > 0 ? ((returns / initial) * 100) : 0;
  const doubleYears = cagrVal > 0 ? Math.round(ruleOf72(cagrVal)) : 0;
  return {
    cagr: cagrVal,
    initial: Math.round(initial),
    final: Math.round(finalVal),
    returns: Math.round(returns),
    absReturn,
    doubleYears,
  };
}

export default function CAGRPage() {
  const { inputs, result, updateInput, resetInputs } = useCalculator("cagr", defaultInputs, calcFn);
  const [segment, setSegment] = useState("my");
  const r = result as ReturnType<typeof calcFn> | null;
  const benchmarkKey = String(inputs.benchmark || "nifty");
  const benchmarkRate = benchmarkMap[benchmarkKey] ?? 12;
  const selectedBenchmark = `${{ nifty: "Nifty 50", fd: "FD (7%)", gold: "Gold (8%)" }[benchmarkKey] ?? "Benchmark"}`;

  const chartConfig = useMemo(() => r ? {
    type: "line" as const,
    data: {
      labels: Array.from({ length: Number(inputs.years) + 1 }, (_, i) => `Y${i}`),
      datasets: [
        {
          label: "My Investment",
          data: Array.from({ length: Number(inputs.years) + 1 }, (_, i) => Math.round(r.initial * Math.pow(1 + r.cagr / 100, i))),
          borderColor: "#FF6B00",
          backgroundColor: "rgba(255,107,0,0.08)",
          fill: true,
        },
        {
          label: selectedBenchmark,
          data: Array.from({ length: Number(inputs.years) + 1 }, (_, i) => Math.round(r.initial * Math.pow(1 + benchmarkRate / 100, i))),
          borderColor: "#1A1A1A",
          borderDash: [6, 3] as [number, number],
          backgroundColor: "transparent",
          fill: false,
        },
      ]
    },
    options: {
      plugins: { legend: { position: "bottom" as const } },
    }
  } : null, [r, inputs.years, inputs.benchmark]);

  const insights = r ? generateInsights("cagr", r, inputs) : [];

  const cagrVal = r?.cagr ?? 0;
  const badgeText = cagrVal >= 12 ? "BEATS NIFTY AVERAGE"
    : cagrVal >= 7 ? "BEATS FD RETURNS"
    : cagrVal > 0 ? "BELOW FD RATE"
    : "LOSS MAKING";

  const badgeColor = cagrVal >= 12 ? "bg-brand-positive text-white"
    : cagrVal >= 7 ? "bg-brand-primary text-white"
    : cagrVal > 0 ? "bg-brand-warning text-white"
    : "bg-brand-negative text-white";

  return (
    <SplitShell
      left={
        <>
          <p className="text-[11px] font-medium text-white/50 uppercase tracking-[0.08em] mb-3">
            FinCalc Pro <span className="text-white/30">›</span>{" "}
            <span className="text-white/90 font-bold">CAGR Calculator</span>
          </p>
          <p className="text-[clamp(16px,2.5vw,20px)] font-bold text-white/95 tracking-[-0.01em] mb-1">
            CAGR Calculator
          </p>
          <p className="text-[12px] font-medium text-white/70 mb-5">
            Measure your true investment growth
          </p>

          <div className="section-divider" />
          <p className="text-[13px] font-semibold uppercase tracking-[0.05em] text-white/85 mb-2">
            Investment Details
          </p>
          <InputRow
            fields={[
              { value: Number(inputs.initial), onChange: (v) => updateInput("initial", parseFloat(v.replace(/[₹,\s]/g, "")) || 0), label: "INITIAL VALUE" },
              { value: Number(inputs.final), onChange: (v) => updateInput("final", parseFloat(v.replace(/[₹,\s]/g, "")) || 0), label: "FINAL VALUE" },
              { value: Number(inputs.years), onChange: (v) => updateInput("years", parseFloat(v) || 1), label: "PERIOD", suffix: "yr" },
            ]}
            className="mb-5"
          />

          <div className="section-divider" />
          <p className="text-[13px] font-semibold uppercase tracking-[0.05em] text-white/85 mb-2">
            Compare Against
          </p>
          <ToggleGroup
            options={[
              { value: "nifty", label: "NIFTY (12%)" },
              { value: "fd", label: "FD (7%)" },
              { value: "gold", label: "GOLD (8%)" },
            ]}
            value={String(inputs.benchmark || "nifty")}
            onChange={(v) => updateInput("benchmark", v)}
          />

          <ActionButtonRow onClear={resetInputs} />
        </>
      }
      right={
        <>
          {!r ? (
            <ResultHero value="" subtitle="" showEmptyState />
          ) : (
            <>
              <ResultHero
                value={`${(r?.cagr ?? 0).toFixed(2)}%`}
                subtitle="Compound Annual Growth Rate"
                variant={cagrVal >= 0 ? "positive" : "negative"}
              />

              <div className={`badge-pill inline-block px-3 py-1.5 mt-2 text-[11px] font-bold uppercase tracking-[0.06em] ${badgeColor}`}>
                {badgeText}
              </div>

              <SegmentedResult
                segments={[
                  { value: "my", label: "MY INVESTMENT" },
                  { value: "vs", label: "VS BENCHMARK" },
                  { value: "compare", label: "COMPARE" },
                ]}
                value={segment}
                onChange={setSegment}
                className="mt-5"
              />

              <div className="mt-1">
                <MetricRow label="Absolute Return" value={`${(r?.absReturn ?? 0).toFixed(1)}%`} variant="positive" index={0} />
                <MetricRow label="Money Doubled in" value={r ? `${r.doubleYears} years` : "-"} index={1} />
                <MetricRow label="CAGR vs FD (7%)" value={r ? `${(r.cagr - 7).toFixed(2)}%` : "-"} variant={r && r.cagr >= 7 ? "positive" : "negative"} index={2} />
                <MetricRow label="CAGR vs Nifty (12%)" value={r ? `${(r.cagr - 12).toFixed(2)}%` : "-"} variant={r && r.cagr >= 12 ? "positive" : "negative"} index={3} />
              </div>

              {insights.length > 0 && (
                <InsightBanner title={insights[0].title} body={insights[0].description} />
              )}

              {chartConfig && (
                <div className="mt-6">
                  <ResultChart config={chartConfig} height={240} />
                </div>
              )}
            </>
          )}
        </>
      }
    />
  );
}
