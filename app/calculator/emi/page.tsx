"use client";

import { useMemo, useState } from "react";
import { useCalculator } from "@/hooks/useCalculator";
import { formatINR, formatINRFull } from "@/lib/formatter";
import { emi, emiBreakdown } from "@/lib/math";
import { generateInsights } from "@/lib/insights";
import { SplitShell } from "@/components/layout/SplitShell";
import { InputRow } from "@/components/ui-custom/InputRow";
import { ToggleGroup } from "@/components/ui-custom/ToggleGroup";
import { BrandSlider } from "@/components/ui-custom/BrandSlider";
import { ActionButtonRow } from "@/components/ui-custom/ActionButtonRow";
import { ResultHero } from "@/components/ui-custom/ResultHero";
import { MetricRow } from "@/components/ui-custom/MetricRow";
import { InsightBanner } from "@/components/ui-custom/InsightBanner";
import { SegmentedResult } from "@/components/ui-custom/SegmentedResult";
import { ResultChart } from "@/components/ui-custom/ResultChart";

const loanPresets = [
  { value: "home", label: "HOME" },
  { value: "car", label: "CAR" },
  { value: "edu", label: "EDUCATION" },
  { value: "other", label: "PERSONAL" },
];

const presetMap: Record<string, { amount: number; rate: number; years: number }> = {
  home: { amount: 5000000, rate: 8.5, years: 20 },
  car: { amount: 800000, rate: 9, years: 5 },
  edu: { amount: 1000000, rate: 8, years: 10 },
  other: { amount: 500000, rate: 12, years: 3 },
};

const defaultInputs = { amount: 5000000, rate: 8.5, years: 20, preset: "home" };

function calcFn(inputs: Record<string, unknown>) {
  const amount = Math.max(0, Number(inputs.amount) || 0);
  const rate = Math.max(0, Number(inputs.rate) || 0);
  const years = Math.max(1, Number(inputs.years) || 1);
  const months = years * 12;
  const emiAmt = emi(amount, rate, months);
  const totalPayment = emiAmt * months;
  const totalInterest = totalPayment - amount;
  const breakdown = emiBreakdown(amount, rate, months);
  return {
    emi: Math.round(emiAmt),
    totalPayment: Math.round(totalPayment),
    totalInterest: Math.round(totalInterest),
    amount: Math.round(amount),
    months,
    breakdown,
    interestRatio: totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 0,
  };
}

const speedStops = [
  { value: 1, label: "MINIMUM" },
  { value: 0.75, label: "STANDARD" },
  { value: 0.5, label: "FAST" },
  { value: 0.25, label: "VERY FAST" },
];

export default function EMIPage() {
  const { inputs, result, updateInput, resetInputs } = useCalculator("emi", defaultInputs, calcFn);
  const [segment, setSegment] = useState("month");
  const r = result as ReturnType<typeof calcFn> | null;

  const chartConfig = useMemo(() => r ? {
    type: "bar" as const,
    data: {
      labels: r.breakdown.map((b: { year: number }) => `Y${b.year}`),
      datasets: [
        { label: "Principal Paid", data: r.breakdown.map((b: { principalPaid: number }) => b.principalPaid), backgroundColor: "#FF6B00" },
        { label: "Interest Paid", data: r.breakdown.map((b: { interestPaid: number }) => b.interestPaid), backgroundColor: "#1A1A1A" },
      ]
    },
    options: {
      plugins: {
        legend: { position: "bottom" as const },
      },
      scales: {
        y: { stacked: true, grid: { color: "rgba(0,0,0,0.06)", borderDash: [4, 4] as [number, number] }, border: { display: false } },
        x: { stacked: true, grid: { display: false }, border: { display: false } },
      }
    }
  } : null, [r]);

  const insights = r ? generateInsights("emi", r, inputs) : [];

  const heroValue = segment === "month" ? formatINRFull(r?.emi ?? 0)
    : segment === "year" ? formatINRFull(r ? Math.round(r.emi * 12) : 0)
    : formatINRFull(r?.totalPayment ?? 0);

  const heroSub = segment === "month" ? "Monthly EMI payment"
    : segment === "year" ? "Yearly payment amount"
    : "Total payment over loan term";

  const applyPreset = (preset: string) => {
    const p = presetMap[preset];
    if (p) {
      updateInput("amount", p.amount);
      updateInput("rate", p.rate);
      updateInput("years", p.years);
      updateInput("preset", preset);
    }
  };

  const basePreset = presetMap[String(inputs.preset || "home")] || defaultInputs;
  const currentSpeed = basePreset.years > 0 ? Number(inputs.years) / basePreset.years : 1;
  const closestSpeed = speedStops.reduce((prev, curr) =>
    Math.abs(curr.value - currentSpeed) < Math.abs(prev.value - currentSpeed) ? curr : prev
  );

  return (
    <SplitShell
      left={
        <>
          <p className="text-[11px] font-medium text-white/50 uppercase tracking-[0.08em] mb-3">
            FinCalc Pro <span className="text-white/30">›</span>{" "}
            <span className="text-white/90 font-bold">EMI Calculator</span>
          </p>
          <p className="text-[clamp(16px,2.5vw,20px)] font-bold text-white/95 tracking-[-0.01em] mb-1">
            EMI Calculator
          </p>
          <p className="text-[12px] font-medium text-white/70 mb-5">
            Plan your loan repayment
          </p>

          <div className="section-divider" />
          <p className="text-[13px] font-semibold uppercase tracking-[0.05em] text-white/85 mb-2">
            Loan Type
          </p>
          <ToggleGroup
            options={loanPresets}
            value={String(inputs.preset || "home")}
            onChange={applyPreset}
            className="mb-5"
          />

          <div className="section-divider" />
          <p className="text-[13px] font-semibold uppercase tracking-[0.05em] text-white/85 mb-2">
            Loan Details
          </p>
          <InputRow
            fields={[
              { value: Number(inputs.amount), onChange: (v) => { updateInput("amount", parseFloat(v.replace(/[₹,\s]/g, "")) || 0); updateInput("preset", "other"); }, label: "AMOUNT" },
              { value: Number(inputs.rate), onChange: (v) => { updateInput("rate", parseFloat(v) || 0); updateInput("preset", "other"); }, label: "INTEREST", suffix: "%" },
              { value: Number(inputs.years), onChange: (v) => { updateInput("years", parseFloat(v) || 1); updateInput("preset", "other"); }, label: "TENURE", suffix: "yr" },
            ]}
            className="mb-5"
          />

          <div className="section-divider" />
          <p className="text-[13px] font-semibold uppercase tracking-[0.05em] text-white/85 mb-3">
            Repayment Speed
          </p>
          <BrandSlider
            stops={speedStops}
            value={closestSpeed.value}
            onChange={(v) => {
              const base = presetMap[String(inputs.preset || "home")] || defaultInputs;
              updateInput("years", Math.max(1, Math.round(base.years * v)));
            }}
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
              <ResultHero value={heroValue} subtitle={heroSub} />

              <SegmentedResult
                segments={[
                  { value: "month", label: "PER MONTH" },
                  { value: "year", label: "PER YEAR" },
                  { value: "total", label: "TOTAL" },
                ]}
                value={segment}
                onChange={setSegment}
                className="mt-5"
              />

              <div className="mt-1">
                <MetricRow label="Principal Amount" value={formatINRFull(r?.amount ?? 0)} index={0} />
                <MetricRow label="Total Interest" value={formatINRFull(r?.totalInterest ?? 0)} variant="negative" index={1} />
                <MetricRow label="Total Payment" value={formatINRFull(r?.totalPayment ?? 0)} index={2} />
                <MetricRow label="Interest to Loan Ratio" value={`${(r?.interestRatio ?? 0).toFixed(1)}%`} variant="negative" index={3} />
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
